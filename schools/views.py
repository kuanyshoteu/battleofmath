from urllib.parse import quote_plus

from django.contrib import messages
from django.contrib.contenttypes.models import ContentType
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render, get_object_or_404, redirect
from django.utils import timezone
from django.views.generic import RedirectView
from datetime import timedelta

from .models import *
from papers.models import *
from accounts.models import Profile
from accounts.views import add_money
from django.contrib.auth import (
    authenticate,
    get_user_model,
    login,
    logout,
    )
from django.contrib.auth.models import User
import os
from constants import *
from .social_media import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.http import JsonResponse
import json
import urllib
from django.contrib.postgres.search import TrigramSimilarity
from dateutil.relativedelta import relativedelta

def school_info(request):
    profile = get_profile(request)
    only_directors(profile)
    school = is_moderator_school(request, profile)
    if is_profi(profile, 'Director'):
        money = school.money
    if request.POST: 
        if len(request.FILES) > 0:
            if 'school_banner' in request.FILES:
                file = request.FILES['school_banner']
                banner = school.banners.create()
                banner.image_banner = file
                banner.save()
                additional = '?type=moderator&mod_school_id='+str(school.id)
                return redirect(school.get_absolute_url()+additional)
    manager_prof = Profession.objects.get(title='Manager')
    managers = school.people.filter(profession=manager_prof)
    teacher_prof = Profession.objects.get(title='Teacher')
    teachers = school.people.filter(profession=teacher_prof)
    weekago = timezone.now().date() - timedelta(7)    
    voronka = []
    voronka2 = []
    number = 0
    all_cards = school.crm_cards.filter(timestamp__gt=weekago)
    number_of_all = len(all_cards)    
    if school.version == 'business':
        for column in school.crm_columns.all().order_by('-id'):
            if column.id != 6:
                x = len(all_cards.filter(column=column))
                number += x
                if number_of_all > 0:
                    percent = round((number/number_of_all)*100,2)
                else:
                    percent = 0
                voronka.append([column.title, number, percent])
                voronka2.append([column.title, number, percent])
        voronka = reversed(voronka)
        voronka2 = reversed(voronka2)
    worktime1 = ''
    worktime2 = ''
    if '-' in school.worktime:
        worktime1 = school.worktime.split('-')[0]
        worktime2 = school.worktime.split('-')[1]
    context = {
        "profile":profile,
        "instance": school,
        "squads":school.groups.filter(shown=True),
        "main_school":True,
        "subjects":school.school_subjects.all(),
        'is_trener':is_profi(profile, 'Teacher'),
        "is_manager":is_profi(profile, 'Manager'),
        "is_director":is_profi(profile, 'Director'),
        "is_moderator":is_profi(profile, 'Moderator'),
        "school_money":school.money,
        "school_crnt":school,
        "today":timezone.now().date().strftime('%Y-%m-%d'),
        "weekago":(timezone.now().date() - timedelta(7)).strftime('%Y-%m-%d'),
        "all_students_len":len(school.people.filter(is_student=True, squads__in=school.groups.filter(shown=True)).exclude(card=None).exclude(squads=None).distinct()),
        "managers":managers,
        "teachers":teachers,
        "voronka_array":voronka,
        "voronka2":voronka2,
        "worktime1":worktime1,
        "worktime2":worktime2,
        "number_of_all":number_of_all,
        "social_networks":get_social_networks(school),
        "page":"info",
        "info_data":"info_data",
        "hint":profile.hint_numbers[0],
    }
    return render(request, "school/info.html", context)

def change_title(request):
    profile = Profile.objects.get(user = request.user.id)
    only_directors(profile)
    if request.GET.get('id') and request.GET.get('text') and request.GET.get('status') and request.GET.get('text') != "":
        school = is_moderator_school(request, profile)
        if request.GET.get('status') == 'title':
            school.title = request.GET.get('text') 
        if request.GET.get('status') == 'slogan':
            school.slogan = request.GET.get('text') 
        if request.GET.get('status') == 'content':
            school.content = request.GET.get('text') 
        if request.GET.get('status') == 'site':
            school.site = request.GET.get('text') 
        if request.GET.get('status') == 'worktime':
            if request.GET.get('text') == '-':
                school.worktime = 'По предварительной записи'
            else:
                school.worktime = request.GET.get('text') 
        if request.GET.get('status') == 'phones':
            phones = request.GET.get('text').split(',')
            if len(phones) > 0:
                school.phones = phones
        if request.GET.get('status') == 'social_networks':
            school.social_networks = request.GET.get('text') 
        if request.GET.get('status') == 'cities':
            cities = request.GET.get('text').split(',')
            old_cities = school.cities.all()
            school.cities.remove(*old_cities)
            for city_title in cities:
                city = City.objects.filter(title=city_title)

                similarity=TrigramSimilarity('title', city_title)
                city = City.objects.annotate(similarity=similarity,).filter(similarity__gt=0.9).order_by('-similarity')
                if len(city) > 0:
                    city = city[0]
                else:
                    city = City.objects.create(title=city_title)
                school.cities.add(city)
        school.save()
    data = {
    }
    return JsonResponse(data)

def delete_school_banner(request):
    profile = Profile.objects.get(user = request.user.id)
    if request.GET.get('id'):
        school = is_moderator_school(request, profile)
        banner = school.banners.filter(id=int(request.GET.get('id')))
        if len(banner) > 0:
            banner[0].delete()
    data = {
    }
    return JsonResponse(data)

def update_voronka(request):
    profile = Profile.objects.get(user = request.user.id)
    only_directors(profile)
    res = []
    is_ago = False
    if request.GET.get('status') and request.GET.get('first_vrnk') and request.GET.get('second_vrnk'):
        school = is_moderator_school(request, profile)
        timefuture = timezone.now().date()
        today = timefuture
        weekago = timezone.now().date() - timedelta(7)
        monthago = timezone.now().date() - relativedelta(months=1)
        yearago = timezone.now().date() - relativedelta(years=1)
        if request.GET.get('status') == 'get_here':
            if request.GET.get('value') == 'week':
                timeago = weekago
            if request.GET.get('value') == 'month':
                timeago = monthago
            if request.GET.get('value') == 'year':
                timeago = yearago
        if request.GET.get('status') == 'get_input':
            timeago = datetime.datetime.strptime(request.GET.get('first_vrnk'), "%Y-%m-%d").date()
            timefuture = datetime.datetime.strptime(request.GET.get('second_vrnk'), "%Y-%m-%d").date()
            if timefuture == today:
                if timeago == weekago:
                    is_ago = 'week_vrnk'
                elif timeago == monthago:
                    is_ago = 'month_vrnk'
                elif timeago == yearago:
                    is_ago = 'year_vrnk'
        number = 0
        manager = False
        timeago = timeago - timedelta(1)
        timefuture = timefuture + timedelta(1)
        if request.GET.get('manager_id') != '-1':
            manager = school.people.get(id=int(request.GET.get('manager_id')))
        all_cards = school.crm_cards.filter(timestamp__gt=timeago, timestamp__lt=timefuture)
        number_of_all = len(all_cards)
        if manager:
            all_cards = all_cards.filter(author_profile=manager)
        for column in school.crm_columns.all().order_by('-id'):
            if column.id != 6:
                x = len(all_cards.filter(column=column))
                number += x
                if number_of_all == 0:
                    percent = 0
                else:
                    percent = round((number/number_of_all)*100, 2)
                res.append([column.title, number, percent])
    data = {
        "res":res,
        "timeago":timeago.strftime('%Y-%m-%d'),
        "is_ago":is_ago,
        "number":number,
    }
    return JsonResponse(data)

def get_manager_actions(request):
    profile = Profile.objects.get(user = request.user.id)
    ok = False
    profession = Profession.objects.get(title = 'Director')
    if profession in profile.profession.all():
        ok = True
    res = []
    if request.GET.get('id'):
        manager = Profile.objects.get(id=int(request.GET.get('id')))
        if manager == profile:
            ok = True
        if ok:
            school = is_moderator_school(request, profile)
            check_school_version(school, 'business')
            history = sorted(
                chain(
                    PaymentHistory.objects.filter(action_author=manager), 
                    CRMCardHistory.objects.filter(action_author=manager), 
                    SquadHistory.objects.filter(action_author=manager), 
                    SubjectHistory.objects.filter(action_author=manager)),
                key=lambda item: item.timestamp, reverse=False)
            for h in history:
                edit = ''
                classname = h.__class__.__name__
                if classname == 'PaymentHistory':
                    if h.amount < 0:
                        edit += 'Отмена оплаты у '
                    else:
                        edit+='Принята оплата у '
                    edit += h.user.first_name+', сумма '+str(h.amount)+'тг '
                    if h.squad:
                        edit+='за группу '+h.squad.title
                elif classname == 'CRMCardHistory':
                    edit += h.card.name
                    if h.oldcolumn != '' or h.newcolumn != '':
                        edit += ' <br>"' + h.oldcolumn+ '" -> "' + h.newcolumn+'"'
                    elif h.edit != '':
                        edit += h.edit
                    else:
                        edit += ' изменения данных'
                else:
                    edit += h.edit

                res.append([manager.first_name, h.timestamp.strftime('%d.%m.%Y %H:%M'), edit])
    data = {
        "res":res,
    }
    return JsonResponse(data)

def get_student_actions(request):
    profile = Profile.objects.get(user = request.user.id)
    only_managers(profile)
    res = []
    if request.GET.get('id'):
        school = is_moderator_school(request, profile)
        student = Profile.objects.get(id=int(request.GET.get('id')))
        card = school.crm_cards.get(card_user=student)
        history = sorted(
            chain(
                school.payment_history.filter(user=student), 
                card.history.all(),
                student.hisgrades.filter(school=school, present='present')),
            key=lambda item: item.timestamp, reverse=False)
        for h in history:
            edit = ''
            classname = h.__class__.__name__
            if classname == 'PaymentHistory':
                edit+='Принята оплата у '+h.user.first_name+', сумма '+str(h.amount)+'тг '
                if h.squad:
                    edit+='за группу '+h.squad.title
            elif classname == 'CRMCardHistory':
                edit += 'Карточка '+ h.card.name
                if h.oldcolumn != '' or h.newcolumn != '':
                    edit += ' <br>"' + h.oldcolumn+ '" -> "' + h.newcolumn+'"'
                elif h.edit != '':
                    edit += h.edit
                else:
                    edit += ' изменения данных'
            elif classname == 'Attendance':
                edit = 'Посетил урок курса '+ h.subject.title+'<br>Дата: '+get_date(h.subject_materials, h.squad)[0].strftime('%d.%m.%Y')

            res.append([student.first_name, h.timestamp.strftime('%d.%m.%Y %H:%M'), edit])
    data = {
        "res":res,
        'student':True,
    }
    return JsonResponse(data)

def get_teacher_actions(request):
    profile = Profile.objects.get(user = request.user.id)
    only_managers(profile)
    res = []
    if request.GET.get('id'):
        school = is_moderator_school(request, profile)
        check_school_version(school, 'business')
        teacher = Profile.objects.get(id=int(request.GET.get('id')))
        materials = teacher.done_subject_materials.filter(school=school).select_related('subject')
        squads = teacher.hissquads.all().prefetch_related('subjects')
        for mat in materials:
            subject = mat.subject
            sq = squads.filter(subjects=subject)[0]
            date = get_date(mat, sq)[0].strftime('%d.%m.%Y')
            edit = 'Провел урок курса '+ subject.title
            edit+='<br>Дата: '+date
            edit+='<br>Заработок: '+str(teacher.salary)+'тг'
            res.append([teacher.first_name, date,edit])
    data = {
        "res":res,
        'teacher':True,
    }
    return JsonResponse(data)

def group_finance(request):
    profile = Profile.objects.get(user = request.user.id)
    only_managers(profile)
    school = is_moderator_school(request, profile)
    res = []
    res_squad = []
    if request.GET.get('id'):
        squad = school.groups.get(id=int(request.GET.get('id')))
        teacher = squad.teacher
        if teacher:
            teacher_name = teacher.first_name
            teacher_url = teacher.get_absolute_url()
        else:
            teacher_name = ''
            teacher_url = ''
        sq_cost = ''
        if squad.lesson_bill > 0:
            sq_cost = str(squad.lesson_bill)+' за урок | '
        if squad.bill > 0:
            sq_cost += str(squad.bill)+' в месяц | '
        if squad.course_bill > 0:
            sq_cost += str(squad.course_bill)+' за курс'
        res_squad = [squad.title,
            teacher_name,
            teacher_url,
            sq_cost]
        res_subjects = []
        for subject in squad.subjects.all():
            cost = str(subject.cost)
            if subject.cost_period == 'month':
                cost += " в месяц"
            elif subject.cost_period == 'lesson':
                cost += " за урок"
            elif subject.cost_period == 'course':
                cost += " за курс"
            color_back = subject.color_back
            if color_back == '':
                color_back = 'rgb(49, 58, 87)'
            res_subjects.append([subject.title, cost, color_back])
        for nm in squad.bill_data.all():
            name = nm.card.name
            url = nm.card.card_user.get_absolute_url()
            fcs = nm.finance_closed.all()
            closed_months = 0
            first_present = '<i>Еще не было посещения</i>'
            if len(fcs) > 0:
                fc = fcs[0]
                closed_months = fc.closed_months
                first_present = 'Первое занятие: '
                first_present += fc.first_present.strftime('%d.%m.%Y')
            res.append([name,url,first_present,closed_months])

    data = {
        "res":res,
        "res_subjects":res_subjects,
        "res_squad":res_squad,
    }
    return JsonResponse(data)

def show_finance_update(request):
    profile = Profile.objects.get(user = request.user.id)
    only_managers(profile)
    school = is_moderator_school(request, profile)    
    data = {
        "author":school.money_update_person,
        "date":school.money_update_date.strftime('%d %B'),
    }
    return JsonResponse(data)

def update_finance(request):
    ok = False
    profile = Profile.objects.get(user = request.user.id)
    only_managers(profile)
    school = is_moderator_school(request, profile)    
    school.money_update_person = profile.first_name
    school.money_update_date = timezone.now()
    school.money = 0
    school.save()
    data = {
        "ok":True,
        "author":profile.first_name,
        "date":timezone.now().strftime('%d %B'),
    }
    return JsonResponse(data)

def get_payment_list(request):
    profile = Profile.objects.get(user = request.user.id)
    only_managers(profile)
    res = []
    today = timezone.now().date()
    if request.GET.get('page'):
        page = int(request.GET.get('page'))
        school = is_moderator_school(request, profile)
        cards = school.crm_cards.select_related('card_user')
        students, squads = payment_get_students_list(profile, school)
        all_students_len = len(school.people.filter(is_student=True, squads__in=squads).exclude(card=None).exclude(squads=None).distinct())
        crnt_students_len = len(students)
        if len(students) <= (page-1)*16:
            return JsonResponse({"ended":True})
        p = Paginator(students, 16)
        page1 = p.page(page)
        res = []
        bill_day_diff = school.bill_day_diff
        squad = profile.filter_data.squad
        for student in page1.object_list:
            card = cards.filter(card_user=student)[0]
            if squad == None:
                squads2 = squads.filter(students=student)
            else:
                squads2 = squads
            sq_res, notices = payment_student_collect(squads2, card, today, bill_day_diff)
            res.append([
                student.id,
                student.first_name,
                student.get_absolute_url(),
                sq_res,
                notices,
                ])
    data = {
        "res":res,
        "crnt_students_len":crnt_students_len,
        "all_students_len":all_students_len,
        "today":today,
    }
    return JsonResponse(data)

def payment_get_students_list(profile, school):
    squad = profile.filter_data.squad
    squads = school.groups.filter(shown=True).prefetch_related('students')
    if squad != None:
        squads = school.groups.filter(id = squad.id)
    # else:
    #     if profile.filter_data.office:
    #         squads = school.groups.filter(shown=True,office=profile.filter_data.office).prefetch_related('students')
    # if profile.filter_data.subject_category:
    #     subjects = school.school_subjects.filter(category=profile.filter_data.subject_category)
    #     squads = squads.filter(subjects__in=subjects).distinct()
    print(school.people.filter(is_student=True))
    students = school.people.filter(is_student=True, squads__in=squads).exclude(card=None).exclude(squads=None).distinct()
    print(students)
    if profile.filter_data.payment != 'all':
        firstofmonth = first_day_of_month(timezone.now().date())
        lastofmonth = last_day_of_month(firstofmonth)
        payments = school.payment_history.filter(squad__in=squads,timestamp__gte=firstofmonth, timestamp__lte=lastofmonth)
        if profile.filter_data.payment == 'paid':
            students = students.filter(payment_history__in=payments).distinct()
        if profile.filter_data.payment == 'not_paid':
            students = students.exclude(payment_history__in=payments).distinct()
    return students, squads

def payment_student_collect(squads2, card, today, bill_day_diff):
    notices = 0
    sq_res = []
    for sq in squads2:
        nm = sq.bill_data.filter(card=card)
        pay_date = '-'
        pay_date_input = '-'
        pd = ''
        lesson_pay_notice = False
        month_pay_notice = False
        discount_res = ''
        if len(nm) > 0:
            nm = nm.last()
            pay_date_input = nm.pay_date.strftime("%Y-%m-%d")
            pay_date = nm.pay_date.strftime("%d %B %Y")
            if nm.pay_date <= today + timedelta(bill_day_diff):
                month_pay_notice = True
                notices += 1
            if len(sq.subjects.filter(cost_period='lesson')) > 0:
                if nm.money < 2 * sq.lesson_bill:
                    lesson_pay_notice = True
            if len(nm.discount_school.all()) > 0:
                discount = nm.discount_school.first()
                discount_res = str(discount.amount)
                if discount.discount_type == 'percent':
                    discount_res += '%'
                else:
                    discount_res += 'тг'
        lectures = sq.squad_lectures.all()
        days = Day.objects.filter(lectures__in=lectures).distinct()
        days_res = ''
        for day in days:
            days_res += str(day.number) + ','
        sq_res.append([
            sq.id,              #0
            sq.title,           #1
            sq.color_back,      #2
            pay_date_input,     #3
            pay_date,           #4
            month_pay_notice,   #5
            lesson_pay_notice,  #6
            days_res,           #7
            discount_res,       #8
            sq.get_update_url(),
            ])
    return sq_res, notices

def get_payment_student(request):
    profile = Profile.objects.get(user = request.user.id)
    only_managers(profile)
    res = []
    ok = False
    if request.GET.get('id'):
        school = is_moderator_school(request, profile)
        student = school.people.filter(is_student=True, id=int(request.GET.get('id')))
        if len(student) == 0:
            return JsonResponse({'ok':ok})
        student = student[0]
        if len(student.squads.all()) == 0:
            return JsonResponse({'ok':True, 'nosquad':True})
        card = school.crm_cards.filter(card_user=student)
        if len(card) == 0:
            return JsonResponse({'ok':ok})
        card = card[0]
        squads2 = school.groups.filter(students=student,shown=True)
        today = timezone.now().date()
        sq_res, notices = payment_student_collect(squads2, card, today, school.bill_day_diff)
        res.append([
            student.id,
            student.first_name,
            student.get_absolute_url(),
            sq_res,
            notices,
            ])
        ok = True
        students = payment_get_students_list(profile, school)[0]
        number = len(students.filter(id__lt=student.id)) + 1
    data = {
        "ok":ok,
        "res":res,
        "number":number,
    }
    return JsonResponse(data)

def last_day_of_month(any_day):
    next_month = any_day.replace(day=28) + timedelta(days=4)
    return next_month - timedelta(days=next_month.day)
def first_day_of_month(day):
    crnt_mnth = day.strftime('%m')
    crnt_year = day.strftime('%Y')
    firstofmonth = datetime.datetime.strptime('01-'+crnt_mnth+'-'+crnt_year,'%d-%m-%Y').date()
    return firstofmonth

def register_user_work(name, mail, password, request):
    if len(Profile.objects.filter(mail=mail)) == 0 or password == False:
        new_name = search_free_name(name.replace(' ', ''))
        user = User.objects.create(username=new_name, password=password)
        if password:
            user.set_password(password)
        user.save()
        if password:
            user2 = authenticate(username = str(user.username), password=str(password))
            try:
                login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            except Exception as e:
                res = 'er'
        profile = Profile.objects.create(user = user)
        profile.first_name = name
        profile.mail = mail
        profile.confirmation_time = timezone.now()
        profile.confirmed = False
        profile.save()
    else:
        profile = False
    return profile

def search_free_name(name):
    if len(User.objects.filter(username=name)) > 0:
        name += '1'
        return search_free_name(name)        
    else:
        return name

def show_manager_data(request):
    name = ''
    phone = ''
    mail = ''
    profile = Profile.objects.get(user = request.user.id)
    only_managers(profile)
    school = is_moderator_school(request, profile)
    if request.GET.get('id'):
        manager_prof = Profession.objects.get(title='Manager')
        manager = school.people.filter(profession=manager_prof).get(id = int(request.GET.get('id')))
        name = manager.first_name
        phone = manager.phone
        mail = manager.mail
    data = {
        'name':name,
        'phone':phone,
        'mail':mail,
    }
    return JsonResponse(data)

def save_manager_data(request):
    profile = Profile.objects.get(user = request.user.id)
    only_directors(profile)
    school = is_moderator_school(request, profile)
    if request.GET.get('id') and request.GET.get('name') and request.GET.get('phone'):
        manager_prof = Profession.objects.get(title='Manager')
        manager = school.people.filter(profession=manager_prof).get(id = int(request.GET.get('id')))
        manager.first_name = request.GET.get('name')
        manager.phone = request.GET.get('phone')
        manager.mail = request.GET.get('mail')
        manager.save()
    data = {
    }
    return JsonResponse(data)

def delete_manager(request):
    profile = Profile.objects.get(user = request.user.id)
    only_directors(profile)
    school = is_moderator_school(request, profile)
    end_work = 'Ошибка'
    active_managers = 0
    if request.GET.get('id'):
        manager_prof = Profession.objects.get(title='Manager')
        managers = school.people.filter(profession=manager_prof) 
        manager = managers.get(id = int(request.GET.get('id')))
        manager.end_work = school.version_date
        manager.check_end_work = True
        manager.save()
        end_work = school.version_date.strftime('%d.%m.%Y')
        active_managers = len(managers.filter(check_end_work=False))
    data = {
        'end_work':end_work,
        'active_managers':active_managers,
    }
    return JsonResponse(data)

def change_schooler_password(request):
    new_password = 'Ошибка'
    profile = Profile.objects.get(user = request.user.id)
    only_directors(profile)
    school = is_moderator_school(request, profile)
    if request.GET.get('id'):
        manager_prof = Profession.objects.get(title='Manager')
        schooler = school.people.get(id = int(request.GET.get('id')))
        user = schooler.user
        new_password = random_password()
        user.set_password(new_password)
        user.save()
    data = {
        'password':new_password,
    }
    return JsonResponse(data)

def get_course_list(request):
    if request.GET.get('page'):
        page = int(request.GET.get('page'))
        courses = LessonFolder.objects.filter(shown=True)
        p = Paginator(courses, 16)
        page1 = p.page(page)
        res = []
        for course in page1.object_list:
            img = ''
            if course.img:
                img = course.img.url
            res.append([course.id, course.title, img, course.slogan])
    print(res)
    data = {
        "res":res,
    }
    return JsonResponse(data)
