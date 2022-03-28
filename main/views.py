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
from papers.models import Course, Lesson
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

def landing(request):
    profile = None
    if request.user.is_authenticated:
        profile = get_profile(request)
        return redirect(profile.get_absolute_url())
    context = {
        "profile":profile,
        "land_type":"land_form",
    }
    return render(request, "landing/landing.html", context)

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
    return render(request, "landing/login_page.html", context)
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
    return render(request, "landing/sign_up.html", context)

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


def search_free_name(name):
    if len(User.objects.filter(username=name)) > 0:
        name += '1'
        return search_free_name(name)        
    else:
        return name

def register_user_work(name, mail, password, request):
    if len(mail) > 0:
        if len(Profile.objects.filter(mail=mail)) > 0:
            return False
    print('xxx', request)
    if request:
        print('2xxx', name)
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
    print(name, mail, password1, password2)
    if name and mail and password1 and password2:
        print(555)
        if password1 == password2:
            print(666)
            res = 'ok'
            profile = register_user_work(name, mail, password1, request)
            print(777)
            if profile == False:
                return JsonResponse({'res':'second_user'})
            profile.is_student = True
            profile.save()
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
        lessons = Lesson.objects.annotate(similarity=similarity,).filter(similarity__gt=0.05*kef).order_by('-similarity')
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

def file_changer(request):
    if 'file' in request.FILES:
        file = request.FILES['file']
        first = ['Call-центр', 'АО СК НОМАД ИНШУРАНС', 'Брокеры УКП АО СК НОМАД ИНШУРАНС', 'Дирекция Корпоративных Продаж (ДКП 2)', 'Дирекция Корпоративных Продаж (ДКП)', 'Дирекция продаж №1 АФ АО СК Номад Иншуранс', 'Дирекция продаж №2 АФ АО СК Номад Иншуранс', 'Дирекция продаж №3 АФ АО СК Номад Иншуранс', 'Дирекция продаж №4 АФ АО СК Номад Иншуранс', 'Дирекция продаж №5 АФ АО СК Номад Иншуранс', 'Дирекция продаж №8 АФ АО СК Номад Иншуранс', 'Дирекция продаж №9 АФ АО СК Номад Иншуранс', 'ДКС АО СК НОМАД ИНШУРАНС', 'ДРКБ АО СК НОМАД ИНШУРАНС ', 'ДРКБ г.Нур-Султан АО СК НОМАД ИНШУРАНС ', 'ДРНКП АО СК НОМАД Иншуранс', 'Отдел по работе с клиентами АО СК «Номад Иншуранс»', 'Отдел продаж в г.Нур-Султан «АО СК «Номад Иншуранс»', 'Проект Дос Полис АО СК Номад Иншуранс', 'Проектный офис АО СК «Номад Иншуранс»', 'СД АО СК НОМАД ИНШУРАНС (ШАКИРХАНОВ А. Б.)', 'УКП АО СК НОМАД ИНШУРАНС', 'УКП Отдел корпоративного страхования АО СК НОМАД ИНШУРАНС', 'Упр. продаж 2 Нур-Султан АО СК Номад Иншуранс', 'Упр. продаж 2 Уральск АО СК Номад Иншуранс', 'Упр. продаж Уральск АО СК Номад Иншуранс', 'Упр. продаж Усть-К АО СК Номад Иншуранс', 'Упр. страхования Усть-Каменогорск АО СК Номад Иншуранс', 'Упр.продаж Костанай АО СК Номад Иншуранс', 'Упр.продаж Нур-Султан АО СК Номад Иншуранс', 'Упр.продаж Шымкент АО СК НОМАД Иншуранс', 'Управление продаж в г.Актобе АО СК «Номад Иншуранс»', 'Управление продаж в г.Кызылорда АО СК «Номад Иншуранс»', 'Управление продаж в г.Петропавловск АО СК «Номад Иншуранс»', 'Управление продаж г.Павлодар АО СК Номад Иншуранс', 'Управление продаж медицинского страхования', 'Управление прямых продаж АО СК «Номад Иншуранс»', 'ф-л АКТАУ 2 АО СК Номад Иншуранс', 'ф-л АКТАУ АО СК Номад Иншуранс', 'ф-л АКТОБЕ АО СК Номад Иншуранс', 'ф-л АЛМАТЫ АО СК Номад Иншуранс', 'ф-л АТЫРАУ АО СК Номад Иншуранс', 'ф-л КАРАГАНДА АО СК Номад Иншуранс', 'ф-л КОКШЕТАУ АО СК НОМАД Иншуранс', 'ф-л КОСТАНАЙ АО СК Номад Иншуранс', 'ф-л КЫЗЫЛОРДА АО СК Номад Иншуранс', 'ф-л Нур-Султан АО СК Номад Иншуранс', 'Ф-Л ПАВЛОДАР АО СК НОМАД ИНШУРАНС', 'ф-л ПЕТРОПАВЛОВСК АО СК Номад Иншуранс', 'ф-л СЕМЕЙ АО СК Номад Иншуранс', 'ф-л ТАЛДЫКОРГАН АО СК Номад Иншуранс (бывш. УПГО Талдыкорган)', 'ф-л ТАРАЗ АО СК Номад Иншуранс', 'ф-л УРАЛЬСК АО СК Номад Иншуранс', 'ф-л Усть-Каменогорск АО СК Номад Иншуранс', 'ф-л ШЫМКЕНТ-2 АО СК НОМАД Иншуранс', 'Центр страхования №2 УКП АО СК НОМАД ИНШУРАНС', 'Центр страхования №4 УКП АО СК НОМАД ИНШУРАНС',]
        second = ['АО СК НОМАД ИНШУРАНС', 'АО СК НОМАД ИНШУРАНС', 'УКП', 'ф-л Алматы', 'ф-л Алматы', 'ф-л Алматы', 'ф-л Алматы', 'ф-л Алматы', 'ф-л Алматы', 'ф-л Алматы', 'ф-л Алматы', 'ф-л Алматы', 'ДКС', 'ДРКБ', 'ДРКБ', 'АО СК НОМАД ИНШУРАНС', 'АО СК НОМАД ИНШУРАНС', 'УП Нур-Султан', 'Проект Дос Полис', 'АО СК НОМАД ИНШУРАНС', 'СД', 'УКП', 'УКП', 'УП Нур-Султан', 'УП Уральск', 'УП Уральск', 'УП Усть-Каменогорск', 'УС Усть-Каменогорск', 'УП Костанай', 'УП Нур-Султан', 'УП Шымкент', 'УП Актобе', 'УП Кызылорда', 'УП Петропавловск', 'УП Павлодар', 'УП медицинского страхования', 'АО СК НОМАД ИНШУРАНС', 'ф-л Актау', 'ф-л Актау', 'ф-л Актобе', 'ф-л Алматы', 'ф-л Атырау', 'ф-л Караганда', 'ф-л Кокшетау', 'ф-л Костанай', 'ф-л Кызылорда', 'ф-л Нур-Султан', 'ф-л Павлодар', 'ф-л Петропавловск', 'ф-л Семей', 'ф-л Талдыкорган', 'ф-л Тараз', 'ф-л Уральск', 'ф-л Усть-Каменогорск', 'ф-л Шымкент', 'УКП', 'УКП',]

        first += ['Агентство по страхованию УКП АО СК "НОМАД ИНШУРАНС" в г.Нур-Султан', 'АО СК "НОМАД ИНШУРАНС"', 'Брокеры УКП АО СК "НОМАД ИНШУРАНС"', 'Дирекция Корпоративных Продаж (ДКП 2)', 'Дирекция Корпоративных Продаж (ДКП 4)', 'Дирекция Корпоративных Продаж (ДКП)', 'Дирекция продаж №1 АФ АО СК "Номад Иншуранс"', 'Дирекция продаж №2 АФ АО СК "Номад Иншуранс"', 'Дирекция продаж №3 АФ АО СК "Номад Иншуранс"', 'Дирекция продаж №4 АФ АО СК "Номад Иншуранс"', 'Дирекция продаж №5 АФ АО СК "Номад Иншуранс"', 'Дирекция продаж №6 АФ АО СК "Номад Иншуранс"', 'Дирекция продаж №8 АФ АО СК "Номад Иншуранс"', 'Дирекция продаж №9 АФ АО СК "Номад Иншуранс"', 'ДКП №3 (до 01.01.17г налоги по БИН Головного офиса )', 'ДКС АО СК "НОМАД ИНШУРАНС"', 'ДРКБ АО СК "НОМАД ИНШУРАНС" ', 'ДРКБ г.Нур-Султан АО СК "НОМАД ИНШУРАНС" ', 'ДРНКП АО СК "НОМАД Иншуранс"', 'Отдел по работе с клиентами АО СК «Номад Иншуранс»', 'Отдел продаж в г.Нур-Султан «АО СК «Номад Иншуранс»', 'Отделение продаж "Домиллион" АФАО СК "Номад Иншуранс" ', 'Проект Дос Полис АО СК "Номад Иншуранс"', 'Проектный офис АО СК «Номад Иншуранс»', 'СД АО СК "НОМАД ИНШУРАНС" (ШАКИРХАНОВ А. Б.)', 'УКП АО СК "НОМАД ИНШУРАНС"', 'УКП Отдел корпоративного страхования АО СК "НОМАД ИНШУРАНС"', 'УКС АО СК "НОМАД ИНШУРАНС"', 'УП РС 2 в г.Нур-Султан', 'УП РС в г.Актобе', 'УП РС в г.Костанай', 'УП РС в г.Кызылорда', 'УП РС в г.Талдыкорган', 'УП РС в г.Тараз', 'УП РС в г.Усть-Каменогорск', 'УП РС в г.Шымкент', 'УПГО 2 АО СК "НОМАД ИНШУРАНС"', 'УПГО Алматы АО СК "НОМАД ИНШУРАНС"', 'УПГО Регионы АО СК "НОМАД ИНШУРАНС"', 'Упр. продаж "На Абылай хана" АФАО СК "Номад Иншуранс"', 'Упр. продаж "На Жандосова" АФАО СК "Номад Иншуранс"', 'Упр. продаж "На Казыбек би" АФ АО СК "Номад Иншуранс"', 'Упр. продаж "На Майлина" АФАО СК "Номад Иншуранс"', 'Упр. продаж "На Масанчи" АФ АО СК "Номад Иншуранс"', 'Упр. продаж "На Сейфулина" АФАО СК "Номад Иншуранс"', 'Упр. продаж "На Фурманова" АФАО СК "Номад Иншуранс"', 'Упр. продаж "Тастак" АФАО СК "Номад Иншуранс"', 'Упр. продаж "Уральск" АО СК "Номад Иншуранс"', 'Упр. продаж "Усть-К" АО СК "Номад Иншуранс"', 'Упр. продаж 2 "Нур-Султан" АО СК "Номад Иншуранс"', 'Упр. продаж 2 "Уральск" АО СК "Номад Иншуранс"', 'Упр. продаж Мега Полис АО СК "Номад Иншуранс"', 'Упр. страхования "ТАРАЗ" АО СК "Номад Иншуранс"', 'Упр. страхования "Усть-К" АО СК "Номад Иншуранс"', 'Упр.продаж "Костанай" АО СК "Номад Иншуранс"', 'Упр.продаж "Нур-Султан" АО СК "Номад Иншуранс"', 'Упр.продаж "Шымкент" АО СК "НОМАД Иншуранс"', 'Управление продаж в г.Актобе АО СК «Номад Иншуранс»', 'Управление продаж в г.Кызылорда АО СК «Номад Иншуранс»', 'Управление продаж в г.Петропавловск АО СК «Номад Иншуранс»', 'Управление продаж г.Павлодар АО СК Номад Иншуранс', 'Управление продаж медицинского страхования', 'Управление прямых продаж АО СК «Номад Иншуранс»', 'Управление регионального страхования', 'ф-л АКТАУ 2 АО СК "Номад Иншуранс"', 'ф-л АКТАУ АО СК "Номад Иншуранс"', 'ф-л АКТОБЕ АО СК "Номад Иншуранс"', 'ф-л АЛМАТЫ АО СК "Номад Иншуранс"', 'ф-л АТЫРАУ АО СК "Номад Иншуранс"', 'ф-л КАРАГАНДА АО СК "Номад Иншуранс"', 'ф-л КОКШЕТАУ АО СК "НОМАД Иншуранс"', 'ф-л КОСТАНАЙ АО СК "Номад Иншуранс"', 'ф-л КЫЗЫЛОРДА АО СК "Номад Иншуранс"', 'ф-л Нур-Султан АО СК "Номад Иншуранс"', 'Ф-Л ПАВЛОДАР АО СК "НОМАД ИНШУРАНС"', 'ф-л ПЕТРОПАВЛОВСК АО СК "Номад Иншуранс"', 'ф-л СЕМЕЙ АО СК "Номад Иншуранс"', 'ф-л ТАЛДЫКОРГАН АО СК "Номад Иншуранс" (бывш. УПГО Талдыкорган)', 'ф-л ТАЛДЫКОРГАН-2 АО СК "НОМАД ИНШУРАНС"', 'ф-л ТАРАЗ АО СК "Номад Иншуранс"', 'ф-л УРАЛЬСК АО СК "Номад Иншуранс"', 'ф-л Усть-Каменогорск АО СК "Номад Иншуранс"', 'ф-л ШЫМКЕНТ-2 АО СК "НОМАД Иншуранс"', 'Центр обслуживания клиентов АО СК "НОМАД ИНШУРАНС"', 'Центр страхования №1 УКП АО СК "НОМАД ИНШУРАНС"', 'Центр страхования №2 УКП АО СК "НОМАД ИНШУРАНС"', 'Центр страхования №4 УКП АО СК "НОМАД ИНШУРАНС"', 'Центр страхования №7 УКП АО СК "НОМАД ИНШУРАНС"']
        second += ['УКП', 'АО СК НОМАД ИНШУРАНС', 'УКП', 'ф-л Алматы', 'ф-л Алматы', 'ф-л Алматы', 'ф-л Алматы', 'ф-л Алматы', 'ф-л Алматы', 'ф-л Алматы', 'ф-л Алматы', 'ф-л Алматы', 'ф-л Алматы', 'ф-л Алматы', 'ф-л Алматы', 'ДКС', 'ДРКБ', 'ДРКБ', 'АО СК НОМАД ИНШУРАНС', 'АО СК НОМАД ИНШУРАНС', 'УП Нур-Султан', 'ф-л Алматы', 'Проект Дос Полис', 'АО СК НОМАД ИНШУРАНС', 'СД', 'УКП', 'УКП', 'АО СК НОМАД ИНШУРАНС', 'УП РС 2 в г.Нур-Султан', 'УП РС в г.Актобе', 'УП РС в г.Костанай', 'УП РС в г.Кызылорда', 'УП РС в г.Талдыкорган', 'УП РС в г.Тараз', 'УП РС в г.Усть-Каменогорск', 'УП РС в г.Шымкент', 'АО СК НОМАД ИНШУРАНС', 'АО СК НОМАД ИНШУРАНС', 'АО СК НОМАД ИНШУРАНС', 'ф-л Алматы', 'ф-л Алматы', 'ф-л Алматы', 'ф-л Алматы', 'ф-л Алматы', 'ф-л Алматы', 'ф-л Алматы', 'ф-л Алматы', 'УП Уральск', 'УП Усть-Каменогорск', 'УП Нур-Султан', 'УП Уральск', 'АО СК НОМАД ИНШУРАНС', 'АО СК НОМАД ИНШУРАНС', 'УС Усть-Каменогорск', 'УП Костанай', 'УП Нур-Султан', 'УП Шымкент', 'УП Актобе', 'УП Кызылорда', 'УП Петропавловск', 'УП Павлодар', 'УП медицинского страхования', 'АО СК НОМАД ИНШУРАНС', 'Управление регионального страхования', 'ф-л Актау', 'ф-л Актау', 'ф-л Актобе', 'ф-л Алматы', 'ф-л Атырау', 'ф-л Караганда', 'ф-л Кокшетау', 'ф-л Костанай', 'ф-л Кызылорда', 'ф-л Нур-Султан', 'ф-л Павлодар', 'ф-л Петропавловск', 'ф-л Семей', 'ф-л Талдыкорган', 'ф-л Талдыкорган', 'ф-л Тараз', 'ф-л Уральск', 'ф-л Усть-Каменогорск', 'ф-л Шымкент', 'АО СК НОМАД ИНШУРАНС', 'УКП', 'УКП', 'УКП', 'УКП',]

        first += ['Центр страхования №4  УКП АО СК "НОМАД ИНШУРАНС"','Центр страхования №2  УКП АО СК "НОМАД ИНШУРАНС"', 'Центр страхования №2  УКП АО СК НОМАД ИНШУРАНС', 'Центр страхования №4  УКП АО СК НОМАД ИНШУРАНС', 'Упр. продаж "Уральск"  АО СК  "Номад Иншуранс"']
        second += ['УКП','УКП','УКП', 'УКП', 'УП Уральск']
        data2 = pd.ExcelFile(file)
        datas = pd.read_excel(data2, None)
        res = []
        output = BytesIO()
        writer = pd.ExcelWriter(output, engine='xlsxwriter')
        for key, value in datas.items():
            data = value
            for i in range(len(first)):
                data = data.replace(first[i], second[i])

            data.to_excel(writer, key)

        writer.save()
        output.seek(0)
        response = HttpResponse(output,content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename=%s.xlsx' % 'NomadFiles'
        return response
    context = {   
    }
    return render(request, "file_changer.html", context)