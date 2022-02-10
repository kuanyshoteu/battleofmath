from django.contrib.auth import (
    authenticate,
    get_user_model,
    login,
    logout,

    )
from urllib.parse import quote_plus

from django.contrib import messages
from django.contrib.auth import update_session_auth_hash
from django.contrib.contenttypes.models import ContentType
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render, get_object_or_404, redirect
from django.utils import timezone
import dateutil.parser
from datetime import timedelta
from django.contrib.auth.models import User

from django.shortcuts import render, redirect
from .models import *
from .forms import *
from papers.models import *
from django.contrib.auth.forms import PasswordChangeForm
from constants import *

def account_view(request, user = None):
    profile = get_profile(request)
    user = user.replace('_', ' ')
    user = User.objects.get(username = user)
    hisprofile = Profile.objects.get(user = user)
    if profile.is_student:
        courses = Course.objects.filter(shown=True)
    else:
        courses = Course.objects.all()        
    context = {
        "profile":profile,
        "hisprofile": hisprofile,
        "courses":courses,
    }
    return render(request, "profile/profile.html", context)

def check_confirmation(request):
    profile = get_profile(request)  
    skill = profile.skill
    if skill.confirmed == False:
        if timezone.now() - skill.confirmation_time:
            skill.confirmation_code = random_secrete_confirm()
            skill.confirmation_time = timezone.now()
            skill.save()
            url = request.build_absolute_uri().replace(request.get_full_path(), '') + '/confirm/?confirm='+profile.skill.confirmation_code
            text = "Здравствуйте "+profile.first_name+ "!<br><br> Вы зарегестрировались на сайте Bilimtap.kz, для подтверждения вашего Email пожалуйста пройдите по ссылке: "
            html_content = text + "<br><a href='"+url+"'>подтвердить</a>"
            try:
                send_email("Подтверждение", html_content, [profile.mail])
            except Exception as e:
                pass
        context = {
            "profile": profile,
        }
        return render(request, "confirm.html", context)
    else:
        return redirect(profile.get_absolute_url())

def save_profile(request):
    profile = get_profile(request)
    if request.GET.get('name'):
        profile.first_name = request.GET.get('name')
        profile.mail = request.GET.get('mail')
        profile.phone = request.GET.get('phone')
        if request.FILES.get('image'):
            profile.image = request.FILES.get('image')
        profile.save()
    data = {
    }
    return JsonResponse(data)

def change_profile(request):
    profile = get_profile(request)
    form = ProfileForm(request.POST or None, request.FILES or None,instance=profile)
    if form.is_valid():
        profile = form.save(commit=False)
        profile.save()
    context = {
        "profile":profile, 
        'form':form,
    }
    return render(request, "profile/change_profile.html", context)

def confirm_email(request):
    if request.GET.get('confirm'):
        profile = Profile.objects.get(user = request.user)
        skill = profile.skill
        if skill.confirmation_code == request.GET.get('confirm'):
            skill.confirmed = True
            skill.save()
    return redirect(profile.get_absolute_url())

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.http import JsonResponse

def subject_attendance(request):
    if request.GET.get('subject_id'):
        profile = Profile.objects.get(user = request.user)
        cache_att = CacheAttendance.objects.get_or_create(profile=profile)[0]
        subject = Subject.objects.get(id = int(request.GET.get('subject_id')))
        school = subject.school
        is_in_school(profile, school)
        cache_att.subject = subject
        cache_att.save()
    data = {
    }
    return JsonResponse(data)
def squad_attendance(request):
    if request.GET.get('squad_id'):
        profile = Profile.objects.get(user = request.user)
        cache_att = CacheAttendance.objects.get(profile=profile)
        squad = Squad.objects.get(id = int(request.GET.get('squad_id')))
        school = squad.school
        is_in_school(profile, school)
        cache_att.squad = squad
        if not cache_att.subject in squad.subjects.all():
            cache_att.subject = squad.subjects.first()
        cache_att.save()
    data = {
    }
    return JsonResponse(data)

def more_attendance(request):
    profile = Profile.objects.get(user = request.user)
    if profile.is_student:
        return more_attendance_student(request)
    if request.GET.get('subject_id') and request.GET.get('squad_id') and request.GET.get('direction') and request.GET.get('sm_id'):
        subject = Subject.objects.get(id = int(request.GET.get('subject_id')))
        squad = Squad.objects.get(id = int(request.GET.get('squad_id')))
        school = subject.school
        is_in_school(profile, school)
        current_sm = int(request.GET.get('sm_id'))
        columns = []
        last_set = False
        first_set = False
        stopleft = False
        stopright = False
        if request.GET.get('direction') == 'left':
            queryset = subject.materials.filter(id__lt = current_sm).order_by('-id')
            if len(queryset) <= 4:
                first_set = True
                if len(queryset) == 0:
                    stopleft = True
            for sm in queryset:
                if len(columns) == 4:
                    break
                if len(sm.sm_atts.filter(squad = squad)) < len(squad.students.all()):
                    create_atts(squad, sm, subject)
                get_date_results = get_date(sm, squad)
                if get_date_results == '_':
                    section = ['_', sm.id, '_']
                else:
                    section = [get_date_results[0].strftime('%d %B %Y'), sm.id, get_date_results[1]]
                for att in sm.sm_atts.filter(squad = squad):
                    section.append([att.id, att.present, att.grade])
                columns.append(section)
        else:
            queryset = subject.materials.filter(id__gt = current_sm)
            if len(queryset) <= 4:
                last_set = True
                if len(queryset) == 0:
                    stopright = True                
            for sm in queryset:
                if len(columns) == 4:
                    break
                section = [get_date(sm, squad)[0].strftime('%d %B %Y'), sm.id]
                columns.append(section)
        data = {
            'first_set':first_set,
            'last_set':last_set,
            'columns':columns,
            'stopleft':stopleft,
            'stopright':stopright,
        }
        return JsonResponse(data)

def more_attendance_student(request):
    profile = get_profile(request)
    if request.GET.get('subject_id') and request.GET.get('direction') and request.GET.get('sm_id'):
        subject = Subject.objects.get(id = int(request.GET.get('subject_id')))
        squad = subject.squads.filter(students=profile)[0]
        school = subject.school
        is_in_school(profile, school)
        current_sm = int(request.GET.get('sm_id'))
        columns = []
        last_set = False
        first_set = False
        if request.GET.get('direction') == 'left':
            queryset = subject.materials.filter(id__lt = current_sm).order_by('-id')
            if len(queryset) <= 4:
                first_set = True
            for sm in queryset:
                if len(columns) == 4:
                    break
                if len(sm.sm_atts.filter(student = profile)) < 1:
                    create_atts_student(squad, sm, profile)
                section = [get_date(sm, squad)[0].strftime('%d %B %Y'), sm.id, 'past']
                att = sm.sm_atts.get(student = profile)
                section.append([att.id, att.present, att.grade])
                columns.append(section)
        else:
            queryset = subject.materials.filter(id__gt = current_sm)
            if len(queryset) <= 4:
                last_set = True
            for sm in queryset:
                if len(columns) == 4:
                    break
                section = [get_date(sm, squad)[0].strftime('%d %B %Y'), sm.id]
                columns.append(section)
        data = {
            'first_set':first_set,
            'last_set':last_set,
            'columns':columns,
        }
        return JsonResponse(data)

def miss_lecture(request):
    profile = Profile.objects.get(user = request.user)
    if request.GET.get('date'):
        miss_lesson = MissLesson.objects.filter(profile = profile)
        if len(miss_lesson) > 0:
            miss_lesson = miss_lesson[0]
        else:
            miss_lesson = MissLesson.objects.create(profile=profile)
        date = datetime.datetime.strptime(request.GET.get('date'), "%Y-%m-%d").date()
        if date in miss_lesson.dates:
            action = 'remove'
            miss_lesson.dates.remove(date)
        else:
            action = 'add'
            miss_lesson.dates.append(date)
        miss_lesson.save()

    data = {
        'action':action
    }
    return JsonResponse(data)

def att_present(request):
    profile = Profile.objects.get(user = request.user)
    only_staff(profile)
    ok = False
    teacher_attendance_id = -1
    if request.GET.get('id') and request.GET.get('status'):
        attendance = Attendance.objects.get(id = int(request.GET.get('id')))
        school = attendance.school
        subject = attendance.subject
        squad = attendance.squad
        is_in_school(profile, school)
        profile = squad.teacher
        ok = True
        material = attendance.subject_materials
        need_change_school_money = False
        card = attendance.student.card.get_or_create(school=school)[0]
        if request.GET.get('status') == 'present':
            attendance.present = 'present'
            attendance.save()
            ##### Teacher made lesson
            teacher_attendance = material.sm_atts.filter(student=profile)
            if len(teacher_attendance):
                teacher_attendance = teacher_attendance[0]
                teacher_attendance.present = 'present'
                teacher_attendance.save()
                teacher_attendance_id = teacher_attendance.id
            ##### Move CRMCard in columns
            if card.column:
                if card.column.id == 2:
                    card.column = CRMColumn.objects.get(id=3)
                    card.save()
            ##### Teacher salary increase
            salary = 0
            if not profile in material.done_by.all():
                material.done_by.add(profile)
                if subject.cost_period == 'lesson':
                    profile.money += profile.salary
                    salary = -1*profile.salary
                    need_change_school_money = True
            cost = subject.cost
        elif request.GET.get('status') == 'cancel':
            att_present_was = attendance.present
            attendance.present = ''
            attendance.save()
            cost = 0
            if len(material.sm_atts.filter(squad=squad,present='present')) == 0:
                if profile in material.done_by.all():
                    material.done_by.remove(profile)
                    if subject.cost_period == 'lesson':
                        profile.money -= profile.salary
                if att_present_was == 'present' and subject.cost_period == 'lesson':
                    need_change_school_money = True
                    salary = profile.salary
            if att_present_was == 'present' and subject.cost_period == 'lesson':
                cost = -1*subject.cost        
        if request.GET.get('status') == 'cancel' or request.GET.get('status') == 'present':
            #### Update first presence in squad and subject
            if subject.cost > 0:
                date1 = get_date(attendance.subject_materials, squad)[0]
                nm = card.bill_data.filter(squad=squad)
                need_fc = False
                if len(nm) > 0:
                    nm = nm[0]
                    fc = nm.finance_closed.filter(subject=subject)
                    if len(fc) == 0:
                        need_fc = True
                    else:
                        fc = fc[0]
                else:
                    nm = card.bill_data.create(squad=squad,start_date=date1)
                    need_fc = True
                    nm.save()
                if need_fc:
                    fc = nm.finance_closed.create(subject=subject,
                        moneys=[0],
                        bills=[subject.cost],
                        start=date1,
                        first_present=date1,
                        pay_date=date1,)
                if len(subject.subject_attendances.filter(student=attendance.student,squad=squad,present='present')) == 1:
                    if request.GET.get('status') == 'present':
                        fc.first_present=date1
                        fc.save()
            if need_change_school_money:
                change_school_money(school, salary, 'teacher_salary', profile.first_name)
                school.save()
            # student money change
            if subject.cost_period == 'lesson':
                nm.money -= cost
                nm.save()
                print('111', nm.money)
        else:            
            attendance.present = request.GET.get('status')
            attendance.save()   
     
        profile.save()
    data = {
        'ok':ok,
        'teacher_id':teacher_attendance_id,
    }
    return JsonResponse(data)

def pay_for_lesson(card, cost, squad):
    nm = squad.bill_data.filter(card=card)
    if len(nm) > 0:
        nm = nm[0]
        nm.money -= int(cost)
        if nm.money < squad.lesson_bill:
            nm.lesson_pay_notice = 2
        elif nm.money < 2 * squad.lesson_bill:
            nm.lesson_pay_notice = 1
        elif nm.money >= 2 * squad.lesson_bill:
            nm.lesson_pay_notice = 0
        nm.save()

def ChangeAttendance(request):
    profile = Profile.objects.get(user = request.user)
    if request.GET.get('id'):
        attendance = Attendance.objects.get(id = int(request.GET.get('id')))
        school = attendance.school
        is_in_school(profile, school)        
        if request.GET.get('grade'):
            attendance.grade = int(request.GET.get('grade'))
        attendance.save()
    data = {
    }
    return JsonResponse(data)

def tell_about_corruption(request):
    profile = Profile.objects.get(user = request.user)
    ok = False
    if request.GET.get('text'):
        Corruption.objects.create(text=request.GET.get('text'),author_profile=profile, school=profile.school)
        ok = True
    data = {
        'ok':ok
    }
    return JsonResponse(data)

def logout_view(request):
    logout(request)
    return redirect("/")

def add_money(profile, school, squad, card, amount, manager):
    if amount > squad.bill*10 and amount > squad.lesson_bill * 100:
        return 'too much'
    nm = card.bill_data.get(squad=squad)
    nm.money += amount
    nm.save()
    crnt = amount
    today = timezone.now().date()
    ok = True
    subjects = squad.subjects.filter(cost__gt=0)
    while crnt > 0:
        for subject in subjects:
            if crnt <= 0:
                break
            fc = nm.finance_closed.filter(subject=subject)
            if len(fc) > 0:
                fc = fc[0]
            elif len(fc) == 0:
                fc = nm.finance_closed.create(
                    subject=subject,
                    start=today,
                    first_present=today,
                    moneys=[0],
                    pay_date=today,
                    bills=[0],
                    )
                if subject.cost_period == 'month':
                    fc.bills = [subject.cost]
            added_money = min(subject.cost - fc.moneys[-1], crnt)
            fc.moneys[-1] += added_money
            crnt -= added_money
            finance_update_month(fc, subject.cost, subject.cost_period)
            fc.save()
    canceled = False
    if amount < 0:
        canceled = True
    ph = profile.payment_history.create(
        action_author = manager,
        amount = amount,
        school = school,
        squad = squad,
        canceled = canceled,
    )
    change_school_money(school, amount, 'student_payment', profile.first_name)
    school.save()

def finance_update_month(fc, subject_cost, cost_period):
    if cost_period == 'month':
        if fc.moneys[-1] >= fc.bills[-1]:
            fc.moneys.append(0)
            fc.bills.append(subject_cost)
            fc.closed_months += 1
            ok = True
            fc.save()

def make_payment(request):
    manager = Profile.objects.get(user = request.user)
    only_managers(manager)
    amount = int(request.GET.get('amount'))
    if amount > 0 and request.GET.get('id') and request.GET.get('group_id'):
        profile = Profile.objects.get(id = int(request.GET.get('id')))
        school = manager.schools.first()
        squad = school.groups.get(id=int(request.GET.get('group_id')))
        card = profile.card.get(school=school)
        add_money(profile, school, squad, card, amount, manager)
    data = {
    }
    return JsonResponse(data)

def make_payment_card(request):
    manager = Profile.objects.get(user = request.user)
    only_managers(manager)
    amount = 0
    if request.GET.get('amount'):
        amount = int(request.GET.get('amount'))
    bills = []
    if amount > 0 and request.GET.get('id') and request.GET.get('group_id'):
        card = CRMCard.objects.get(id = int(request.GET.get('id')))
        profile = card.card_user
        school = manager.schools.first()
        squad = school.groups.get(id=int(request.GET.get('group_id')))
        add_money(profile, school, squad, card, amount, manager)
        nms = card.bill_data.select_related('squad')
        for squad in profile.squads.all():
            crnt = nms.filter(squad=squad)
            if len(crnt) > 0:
                crnt = crnt[0]
                bills.append([squad.title, crnt.money, squad.lesson_bill, squad.bill,squad.id])
    data = {
        'bills':bills,
    }
    return JsonResponse(data)
