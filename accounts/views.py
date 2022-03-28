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

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.http import JsonResponse

def account_view(request, user = None):
    profile = get_profile(request)
    user = user.replace('_', ' ')
    user = User.objects.get(username = user)
    hisprofile = Profile.objects.get(user = user)
    context = {
        "profile":profile,
        "hisprofile": hisprofile,
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

def profile_courses(request):
    profile = get_profile(request)
    course_list = []
    new_student = False
    if profile.is_student:
        courses = profile.courses.filter(shown=True)
        if len(courses) == 0:
            new_student = True
            courses = Course.objects.filter(shown=True)
    else:
        courses = Course.objects.all() 
    for course in courses:
        img = ''
        if course.img:
            img = course.img.url
        course_list.append([
            course.id,
            course.title,
            course.subject.title,
            course.slogan,
            img,
            ])
    print(profile.courses.filter(shown=True))
    data = {
        'course_list':course_list,
        'new_student':new_student,
    }
    return JsonResponse(data)

def mylessons(request):
    profile = get_profile(request)
    if request.GET.get('courseId'):
        course_id = request.GET.get('courseId')
        course = Course.objects.filter(id=int(course_id))
        if len(course) > 0:
            course = course[0]
    else:
        return JsonResponse({})
    lessons = course.lessons.all()
    lesson_list = []
    for lesson in lessons:
        img = ''
        if lesson.img:
            img = lesson.img.url
        lesson_list.append([
            lesson.title, 
            lesson.get_absolute_url(), 
            lesson.id, 
            lesson.description, 
            img,
            ])
    if (len(profile.try_lessons.filter(course = course)) == 0):
        last_lesson_id = course.lessons.first().id
    else:
        last_lesson_id = profile.try_lessons.filter(course = course).last().id
    data = {
        'lesson_list':lesson_list,
        'last_lesson_id':last_lesson_id,
    }
    return JsonResponse(data)

def start_course(request):
    profile = get_profile(request)
    ok = False
    print(1, request.GET.get('courseId'))
    if request.GET.get('courseId'):
        course_id = request.GET.get('courseId')
        course = Course.objects.filter(id=int(course_id))
        print(2, course)
        if len(course) > 0:
            course = course[0]
            course.students.add(profile)
            ok = True
    data = {
        'ok':ok,
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



def logout_view(request):
    logout(request)
    return redirect("/")
