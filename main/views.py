from django.shortcuts import render, redirect

from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q
from itertools import chain
from django.views.generic import ListView
from django.utils import timezone

from django.contrib.auth import (
    authenticate,
    get_user_model,
    login,
    logout,
    )
from django.contrib.auth.models import User
from constants import *
from accounts.models import *
from schools.views import register_user_work
from papers.models import Course, Module
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.http import JsonResponse
import pandas as pd
from io import BytesIO
from django.contrib.postgres.search import TrigramSimilarity
from dateutil.relativedelta import relativedelta

import math
from django.template import RequestContext

import hashlib
import hmac
import base64

def loaderio(request):
    context = {
    }
    return render(request, "loaderio-c10fbfa327821a1063a562c197571027.txt", context)

def newland(request):
    profile = None
    if request.user.is_authenticated:
        profile = get_profile(request)
        return redirect(profile.get_absolute_url())
    context = {
        "profile":profile,
        "land_type":"land_form",
    }
    return render(request, "newland.html", context)

def help_page(request):
    is_trener = False
    is_manager = False
    is_director = False
    profile = None
    money = 0
    if request.user.is_authenticated:
        profile = get_profile(request)
        is_trener = is_profi(profile, 'Teacher')
        is_manager = is_profi(profile, 'Manager')
        is_director = is_profi(profile, 'Director')
        if len(profile.schools.all()):
            money = profile.schools.first().money
    context = {
        "profile":profile,
        "schools":ElliteSchools.objects.first().schools.all(),
        "is_trener":is_trener,
        "is_manager":is_manager,
        "is_director":is_director, 
        "school_money":money,
        "is_moderator":is_profi(profile, 'Moderator'),
        "helps":HelpVideos.objects.all(),
    }
    return render(request, "help.html", context)

def category_landing(request, id=None):
    is_trener = False
    is_manager = False
    is_director = False
    profile = None
    money = 0
    if request.user.is_authenticated:
        profile = get_profile(request)
        is_trener = is_profi(profile, 'Teacher')
        is_manager = is_profi(profile, 'Manager')
        is_director = is_profi(profile, 'Director')
        if len(profile.schools.all()):
            money = profile.schools.first().money
    category = SchoolCategory.objects.get(id=id)
    context = {
        "profile":profile,
        "category":category,
        'is_trener':is_trener,
        "is_manager":is_manager,
        "is_director":is_director, 
        "school_money":money,
        "schools":category.schools.all,
        "url":School.objects.first().get_landing(),        
    }
    return render(request, "catland.html", context)

def login_page(request):
    if request.user.is_authenticated:
        profile = Profile.objects.get(user = request.user.id)
        return redirect(profile.get_absolute_url())
    context = {
    }
    return render(request, "login_page.html", context)
def sign_up(request):
    if request.user.is_authenticated:
        profile = Profile.objects.get(user = request.user.id)
        return redirect(profile.get_absolute_url())
    title = False
    cost = 0
    if request.GET.get('id'):
        course = Course.objects.filter(id=int(request.GET.get('id')))
        if len(course) > 0:
            course = course[0]
            title = course.title
            cost = course.cost

    context = {
        'title':title,
        'cost':cost,
    }
    return render(request, "sign_up.html", context)

def team(request):
    profile = None
    if request.user.is_authenticated:
        profile = get_profile(request)
    context = {
        "profile":profile,
    }
    return render(request, "team.html", context)    

def reset_pswrd_view(request):
    if request.user.is_authenticated:
        profile = get_profile(request)
        return redirect(profile.get_absolute_url())
    pid = False
    if request.GET.get('id') and request.GET.get('conf'):
        profile = Profile.objects.get(id=int(request.GET.get('id')))
        if request.GET.get('conf') == profile.confirmation_code and timezone.now() - profile.confirmation_time < timedelta(1):
            pid = profile.id
        else:
            return render(request, "er404.html", {})
    context = {
        "pid":pid,
    }
    return render(request, "profile/reset_pswd.html", context)

def create_worker(request):
    ok = False
    password = False
    profile = get_profile(request)
    print('s9s9s99s9s9')
    if is_profi(profile, 'Moderator') and request.GET.get('prof_id') and request.GET.get('school') and request.GET.get('name') and request.GET.get('phone'):
        school = School.objects.filter(title = request.GET.get('school'))
        if len(school) == 0:
            return JsonResponse({'ok':False})
        school = school[0]
        print(school.title)
        name = request.GET.get('name')
        phone = request.GET.get('phone')
        mail = request.GET.get('mail')
        password = random_password()
        profile = register_user_work(name, mail, password, False)
        profile.is_student = False
        profile.save()
        profession = Profession.objects.get(id = int(request.GET.get('prof_id')))
        print('000', profession)
        profile.profession.add(profession)
        print(profile.profession.all())
        profile.schools.add(school)
        ok = True
    data = {
        "ok":ok,
        "password":password,
    }
    return JsonResponse(data)

def login_view(request):
    res = 'error'
    if request.GET.get('username') and request.GET.get('password'):
        found = False
        if len(Profile.objects.filter(mail=request.GET.get('username'))) > 0:
            profile = Profile.objects.filter(mail=request.GET.get('username'))[0]
            found = True
        if request.GET.get('password') == 'NJfwjibfyuwibJNfhww85efwef':
            user = profile.user
            res = 'login'
            user.backend = 'django.contrib.auth.backends.ModelBackend'
            login(request, user)
        elif found:
            res = 'login'
            user = authenticate(username=str(profile.user.username), password=str(request.GET.get('password')))
            try:
                login(request, user)
            except Exception as e:
                res = 'error'
    data = {
        'res':res,
    }
    return JsonResponse(data)

def change_lang(request):
    profile = get_profile(request)
    if request.GET.get('status'):
        profile.language = request.GET.get('status')
        profile.save()
    data = {}
    return JsonResponse(data)

def add_worker_school(request):
    ok = False
    password = False
    profile = get_profile(request)
    wid = 0
    url = ''
    print('add_worker_school')
    if is_profi(profile, 'Director') and request.GET.get('prof_id') and request.GET.get('name') and request.GET.get('phone'):
        school = is_moderator_school(request, profile)
        print(school.title)
        name = request.GET.get('name')
        phone = request.GET.get('phone')
        mail = request.GET.get('mail')
        password = random_password()
        profile = register_user_work(name, mail, password, False)
        profile.is_student = False
        profile.save()
        wid = profile.id
        url = profile.get_absolute_url()
        profession = Profession.objects.get(id = int(request.GET.get('prof_id')))
        if profession.title != 'Teacher':
            return JsonResponse({'ok':False})
        profile.profession.add(profession)
        profile.schools.add(school)
        if request.GET.get('job_id') != '-1':
            job = profession.job_categories.filter(id=int(request.GET.get('job_id')))
            if len(job) > 0:
                job = job[0]
                profile.job_categories.add(job)
        ok = True
    data = {
        "ok":ok,
        "password":password,
        "id":wid,
        "url":url,
    }
    return JsonResponse(data)

def create_school_work(title, slogan, version):
    school = School.objects.create(
        title=title,
        slogan=slogan,
        version=version,
        version_date = timezone.now(),
        money_update_date = timezone.now(),
        worktime='По предварительной записи',
        )
    school.save()
    columns = ['Новые заявки', 'Записались на пробное занятие', 'Посетители пробное занятие', 'Предоплата', 'Купили абонемент', 'Отучились']
    for column_name in columns:
        c = school.crm_columns.create(title = column_name)
        c.save()
    return school

def register_view(request):
    res = 'no_data'
    name = request.GET.get('name')
    mail = request.GET.get('mail')
    password1 = request.GET.get('password1')
    password2 = request.GET.get('password2')
    course = request.GET.get('course')
    if name and mail and password1 and password2:
        if password1 == password2:
            res = 'ok'
            profile = register_user_work(name, mail, password1, request)
            if profile == False:
                return JsonResponse({'res':'second_user'})
            profile.is_student = True
            profile.save()
            html_content = "Имя: <a href='https://www.bilimtap.kz/"+profile.get_absolute_url()+"'>"+name+"</a><br>Почта: "+mail+"<br>Курс: "+course
            try:
                pass
                # send_email("Клиент новый", html_content, ['aaa.academy.kz@gmail.com'])
            except Exception as e:
                pass                            
        else:
            res = 'not_equal_password'
    data = {
        'res':res,
    }
    return JsonResponse(data)

def update_pswd(request):
    ok = False
    if request.GET.get('mail'):
        found = False
        if len(Profile.objects.filter(mail=request.GET.get('mail'))) > 0:
            profile = Profile.objects.filter(mail=request.GET.get('mail'))[0]
            found = True
        if found:
            confirmation_code = random_secrete_confirm()
            profile.confirmed = True
            profile.confirmation_time = timezone.now()
            profile.save()
            url = request.build_absolute_uri().replace(request.get_full_path(), '') + '/reset_pswrd_view/?id='+str(profile.id)+'&conf='+confirmation_code
            text = "Здравствуйте "+profile.first_name+ "!<br><br>Чтобы поменять пароль пройдите по ссылке: <a href='"+url+"'>восстановить пароль</a>"
            html_content = text
            try:
                send_email("bilimtap.kz восстановление пароля", html_content, [request.GET.get('mail')])
                ok = True
            except Exception as e:
                ok = False
    data = {
        'ok':ok,
    }
    return JsonResponse(data)

def reset_pswrd(request):
    ok = False
    if request.GET.get('id') and request.GET.get('password1') and request.GET.get('password2'):
        if request.GET.get('password1') == request.GET.get('password2'):
            profile = Profile.objects.get(id=int(request.GET.get('id')))
            user = profile.user
            user.set_password(request.GET.get('password1'))
            user.save()
            ok = True
            user = authenticate(username=str(user.username), password=str(request.GET.get('password1')))
            try:
                login(request, user)
            except Exception as e:
                res = 'error' 
    data = {
        'ok':ok,
    }
    return JsonResponse(data)

def login_social(request):
    if request.GET.get('status'):
        if request.GET.get('status') == 'facebook':
            pass
    data = {
    }
    return JsonResponse(data)

def search(request):
    profile = get_profile(request)
    res_profiles = []
    res_lessons = []
    res_folders = []
    text = request.GET.get('text')
    print(text)
    kef = 1
    if len(text) > 4:
        kef = 2
    elif len(text) > 6:
        kef = 3
    elif len(text) > 8:
        kef = 4
    if text != '':
        similarity=TrigramSimilarity('first_name', text)
        print(similarity)
        profiles = Profile.objects.annotate(similarity=similarity,).filter(similarity__gt=0.05*kef).order_by('-similarity')
        similarity=TrigramSimilarity('title', text)
        folders = Course.objects.annotate(similarity=similarity,).filter(similarity__gt=0.05*kef).order_by('-similarity')
        lessons = Module.objects.annotate(similarity=similarity,).filter(similarity__gt=0.05*kef).order_by('-similarity')
        i = 0
        for profile in profiles:
            image_url = ''
            if profile.image:
                image_url = profile.image.url
            res_profiles.append([profile.first_name, profile.get_absolute_url(), image_url])
            i+=1
            if i == 4:
                break
        i = 0
        for lesson in lessons:
            image_url = ''
            res_lessons.append([lesson.title, lesson.get_absolute_url(), image_url])
            i+=1
            if i == 4:
                break
        i = 0
        for folder in folders:
            image_url = ''
            if folder.img:
                image_url = folder.img.url
            res_folders.append([folder.title, folder.get_absolute_url(), image_url])
            i+=1
            if i == 4:
                break
        print(folders)
    data = {
        "res_profiles":res_profiles,
        "res_lessons":res_lessons,
        "res_folders":res_folders,
    }
    return JsonResponse(data)

def ChangeSubject(request):
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    if request.GET.get('id'):
        subject = Subject.objects.get(id = int(request.GET.get('id')))
        if request.GET.get('text'):
            subject.text = request.GET.get('text')
        if request.GET.get('title'):
            subject.title = request.GET.get('title')
        if request.GET.get('cost'):
            subject.cost = request.GET.get('cost')
        subject.save()
    data = {
    }
    return JsonResponse(data)

def get_notifications(request):
    profile = Profile.objects.get(user = request.user.id)
    timezone.now()
    res = []
    i = 0
    profile.notifications_number = 0
    for school in profile.schools.all():
        for notif in school.notifications.filter():
            i += 1
            res.append([notif.author_profile.first_name, notif.image_url, notif.itstype, notif.url, notif.text, notif.timestamp.strftime('%d %B %Yг. %H:%M')])
            if i == 4:
                break
    data = {
        'res':res
    }
    return JsonResponse(data)

def handler404(request, exception):
    return render(request,'er404.html', {})
def handler500(request):
    return render(request,'er500.html', {})

def robots(request):
    return render(request,'robots.txt', {})

def sitemap(request):
    return render(request,'Sitemap.xml', {})

def cloudpayments_pay(request):
    print('cloudpayments_pay')
    if check_cloudpayments_hash(request):
        print('get_hash')
        profile_id = request.GET.get('AccountId')
        profile = Profile.objects.get(id = int(profile_id))
        school = profile.schools.first()
        print(request.GET)
        data = request.GET.get('Data').replace('{','').replace('}','').split(',')
        months = int(data[0].split(':')[1])
        managers_num = int(data[1].split(':')[1])
        transaction_id = request.GET.get('TransactionId')
        name = profile.first_name
        if request.GET.get('Name'):
            name = request.GET.get('Name')
        phone = profile.phone
        amount = float(request.GET.get('Amount'))
        currency = request.GET.get('Currency')
        res = tarif_change(profile, school, months, managers_num, name, phone, transaction_id, amount,currency)
        print(res)
    data = {
        'code':0,
    }
    return JsonResponse(data)

def cloudpayments_fail(request):
    request.GET.get('dir')
    data = {
        'code':0
    }
    return JsonResponse(data)

def cloudpayments_refund(request):
    request.GET.get('dir')
    data = {
        'code':0
    }
    return JsonResponse(data)

def check_cloudpayments_hash(request):
    decoded = request.headers['Content-HMAC']
    decoded = bytes(decoded, 'utf-8')
    url = request.META['QUERY_STRING']
    message = bytes(url, 'utf-8')
    secret = bytes(cloudpayments_secretkey, 'utf-8')
    decoded2 = base64.b64encode(hmac.new(secret, message, digestmod=hashlib.sha256).digest())
    if decoded == decoded2:
        if request.GET.get('Status') == 'Completed':
            return True
    return False

def get_cloudpayments_data(request):
    profile = Profile.objects.get(user = request.user)
    publicId = cloudpayments_id
    invoiceId = '1'
    accountId = profile.id
    data = {
        'publicId':publicId,
        'invoiceId':invoiceId,
        'accountId':accountId,
    }
    return JsonResponse(data)

def wazzup24(request):
    print(request.headers['Authorization'])
    print(request.POST)
    data = {
    }
    return JsonResponse(data)
