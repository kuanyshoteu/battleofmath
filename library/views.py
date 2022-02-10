from urllib.parse import quote_plus

from django.contrib import messages
from django.contrib.contenttypes.models import ContentType
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render, get_object_or_404, redirect
from django.utils import timezone
from django.views.generic import RedirectView

from accounts.models import *
from papers.models import *
from .models import *
from django.contrib.auth.models import User
from constants import *
from django.http import JsonResponse

def course_details(request, course_id=None):
    profile = get_profile(request)
    only_teachers(profile)
    course = Course.objects.get(id=course_id)
    context = {
        "profile": profile,
        'course':course,
        'cache':Cache.objects.get_or_create(author_profile = profile)[0],
        'modules':course.modules.all(),
        "page":'library',        
    }
    return render(request, 'library/library.html', context=context)

def file_action(request):
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    cache = Cache.objects.get_or_create(author_profile = profile)
    cache = cache[0]
    cache.object_type = request.GET.get('object_type')
    cache.object_id = int(request.GET.get('object_id'))
    cache.action = request.GET.get('action')
    cache.previous_parent = int(request.GET.get('parent'))
    cache.full = True
    cache.save()
    data = {'status':'ok'}
    return JsonResponse(data)

def paste(request):
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    cache = Cache.objects.get_or_create(author_profile = profile)[0]
    module_res = []
    course_res = []
    if request.GET.get('new_course') == '-1':
        new_course = None
    else:
        new_course = Course.objects.filter(id=int(request.GET.get('new_course')))
        if len(new_course) == 0:
            return JsonResponse({})
        new_course = new_course[0]
    if cache.object_type == 'course':
        course = Course.objects.get(id = cache.object_id)
        if cache.action == 'cut':
            if cache.previous_parent == -1:
                course.parent = None
            else:
                course.parent = new_course
        else:
            copy_course = Course.objects.create(
                author_profile = profile, 
                title=course.title,
                parent = new_course,
                )
            copy_course.save()
            for module in course.modules.all():
                new_module = copy_module(module, copy_course, 'copy', profile)
            new_id = copy_course.id
        course_res = [
            copy_course.id, 
            copy_course.title, 
            False, 
            len(copy_course.modules.all()),
            ]
    if cache.object_type == 'module':
        module = Module.objects.get(id = cache.object_id)
        modules_q = [copy_module(module, new_course, cache.action, profile)]
        module_res = fill_modules(modules_q)[0]
    data = {
        'module_res':module_res,
        'course_res':course_res,
    }
    return JsonResponse(data)

def copy_module(module, new_course, action, profile):
    if action == 'cut':
        module.course = new_course
        module.save()
        return module
    else:
        new_module = Module.objects.create(
            author_profile = profile, 
            title = module.title + ' - копия',
            course = new_course,
            )
        new_module.save()
        for topic in module.topics.all():
            new_topic = new_module.topics.create(
                title=topic.title,
                order = topic.order, 
                )
            new_topic.save()
            for unit in topic.units.all():
                new_unit = new_topic.units.create(
                    task = unit.task,
                    content=unit.content,
                    video=unit.video,
                    youtube_video_link=unit.youtube_video_link,
                    file = unit.file,
                    order = unit.order,
                    )
        return new_module

def create_course(request):
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    if request.GET.get('title') and request.GET.get('parent_id'):
        course = Course.objects.create(
            title = request.GET.get('title'),
            author_profile = profile,
            )
        if request.GET.get('parent_id') != '-1':
            parent = Course.objects.get(id = int(request.GET.get('parent_id')))
            course.parent = parent
        course.save()
        course_id = course.id
    data = {
        "id":course_id
    }
    return JsonResponse(data)

def rename_course(request):
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    ok = False
    file_url = ''
    if request.GET.get('id') and request.GET.get('title'):
        course = Course.objects.get(id = int(request.GET.get('id')))
        course.title = request.GET.get('title')
        course.slogan = request.GET.get('slogan')
        file = request.FILES.get('file')
        if file:
            course.img = file
            file_url = course.img.url
        course.save()
        ok = True
    data = {
        "ok":ok,
        "file_url":file_url,
    }
    return JsonResponse(data)

def delete_course(request):
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    ok = False
    if request.GET.get('id'):
        course = Course.objects.get(id = int(request.GET.get('id')))
        course.childs.all().delete()
        course.modules.all().delete()
        course.delete()
        ok = True
    data = {
        "ok":ok,
    }
    return JsonResponse(data)

def get_library_teacher(request):
    profile = Profile.objects.get(user = request.user.id)
    folders = []
    lessons = []
    if profile.is_student:
        folders_q = Course.objects.filter(shown=True)
    else:
        folders_q = Course.objects.all()
    for folder in folders_q:
        img = ''
        if folder.img:
            img = folder.img.url
        folders.append([
            folder.id,                  #0
            folder.title,               #1
            '-1',                       #2
            len(folder.modules.all()),  #3
            folder.shown,               #4
            folder.slogan,              #5
            img,                        #6
            ])
    cache = Cache.objects.get_or_create(author_profile = profile)[0]
    cache_title = ''
    if cache.object_type == 'folder':
        folder = Course.objects.filter(id=cache.object_id)
        if len(folder) > 0:
            cache_title = folder[0].title
    else:
        lesson = Module.objects.filter(id=cache.object_id)
        if len(lesson) > 0:
            cache_title = lesson[0].title
    cache_res = [cache.object_type, cache_title]
    data = {
        'courses':folders,
        'cache':cache_res,
    }
    return JsonResponse(data)

def get_library(request):
    profile = Profile.objects.get(user = request.user.id)
    subjects = []
    print('xxxx')
    for subject in Subject.objects.filter(shown = True):
        if profile.is_student:
            courses_q = subject.courses.filter(shown=True)
        else:
            courses_q = subject.courses.all()
        courses = []
        for course in courses_q:
            img = ''
            if course.img:
                img = course.img.url
            courses.append([
                course.id,                  #0
                course.title,               #1
                len(course.modules.all()),  #2
                course.shown,               #3
                course.slogan,              #4
                img,                        #5
                course.get_absolute_url(),  #6
                ])
        subjects.append([subject.title, [courses]])
    cache = Cache.objects.get_or_create(author_profile = profile)[0]
    cache_title = ''
    if cache.object_type == 'course':
        course = Course.objects.filter(id=cache.object_id)
        if len(course) > 0:
            cache_title = course[0].title
    else:
        module = Module.objects.filter(id=cache.object_id)
        if len(module) > 0:
            cache_title = module[0].title
    print(subjects)
    cache_res = [cache.object_type, cache_title]
    data = {
        'subjects':subjects,
        'cache':cache_res,
    }
    return JsonResponse(data)

def get_course_files(request):
    profile = Profile.objects.get(user = request.user.id)
    modules = []
    if request.GET.get('id'):
        course = Course.objects.filter(id = int(request.GET.get('id')))
        if len(course) == 0:
            return JsonResponse({})
        course = course[0]
        if profile.is_student:
            modules_q = course.modules.filter(access_to_everyone=True)
        else:
            modules_q = course.modules.all()
        modules = fill_modules(modules_q) 
    data = {
        'modules':modules,
    }
    return JsonResponse(data)

def fill_modules(modules_q):
    modules = []
    for module in modules_q:
        modules.append([
            module.id,                          #0
            module.title,                       #1
            module.author_profile.first_name,   #2
            module.author_profile.get_absolute_url(),   #3
            module.rating,                      #4
            len(module.try_by.all()),           #5
            len(module.done_by.all()),          #6
            module.access_to_everyone,          #7
            module.get_absolute_url(),          #8
            ])    
    return modules

def create_module(request):
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    ok = False
    if request.GET.get('parent') and request.GET.get('title'):
        module = Module.objects.create(
            title = request.GET.get('title'), 
            author_profile = profile,
            )
        if request.GET.get('parent') != '-1':
            course = Course.objects.get(id = int(request.GET.get('parent')))
            module.course = course
        module.save()
        topic = module.topics.create(
            title="Введение",
            order = 1,
            )
        topic.save()
        modules = fill_modules([module]) 
        ok = True
    data = {
        'modules':modules,
    }
    return JsonResponse(data)        

def collect_task(task, is_main, profile):
    task_res = []
    if task.image:
        image = task.image.url
    else:
        image = ''
    if not profile.is_student:
        answer = [task.task_ans_ru,task.task_ans_kz]
        solve = [task.task_solve_ru, task.task_solve_kz]
        problem = [task.task_problem_ru, task.task_problem_kz]
        solver_correctness = False
    else:
        if profile.language == 'kaz':
            problem = task.task_problem_kz
        if profile.language == 'ru' or len(problem) == 0:
            problem = task.task_problem_ru
        solver_checks = task.solver_checks.get_or_create(author_profile=profile)[0]
        answer = solver_checks.solver_ans
        solve = solver_checks.solve
        solver_correctness = solver_checks.solver_correctness
    right_answers = []
    cnt = 0
    for solver in task.solver_checks.all().order_by('-solver_correctness').distinct():
        solver_profile = solver.author_profile
        solver_res = [
            solver_profile.first_name, 
            solver.solver_correctness,
        ]
        if not profile.is_student:
            solver_res.append(solver.solve)
        right_answers.append(solver_res)
    task_res = [
        task.id,                #0
        problem,                #1
        answer,                 #2
        solve,                  #3
        image,                  #4
        task.cost,              #5
        solver_correctness,     #6
        right_answers,          #7
        ]
    return task_res

def collect_topic(topic, profile):
    units = []
    for unit in topic.units.all():
        task_list = []
        if unit.task:
            task_list.append(collect_task(unit.task, True, profile))
        if unit.video:
            video = unit.video.url
        else:
            video = ''
        if unit.file:
            file = str(unit.file)
            file_url = unit.file.url
        else:
            file = ''
            file_url = ''
        units.append([
            unit.id,                    #0
            unit.content,               #1
            file_url,                       #2
            file,                           #3
            unit.youtube_video_link,    #4
            video,                          #5
            task_list,                      #6
            ])
    if profile.is_student and not topic.is_task:
        topic.done_by.add(profile)        
    res = [
        topic.id,
        topic.title,
        units,
        topic.is_task,
        ]    
    return res

def show_module(request):
    profile = Profile.objects.get(user = request.user.id)
    if request.GET.get('module_id') and request.GET.get('topic_id'):
        module = Module.objects.filter(id=int(request.GET.get('module_id')))
        if len(module) == 0:
            return JsonResponse({})
        module = module[0]
        topic_res = []
        if request.GET.get('topic_id') == '-1':
            topic = module.topics.exclude(done_by=profile)
            if len(topic) > 0:
                topic = topic.first()
            else:
                topic = module.topics.first()
        else:
            topic = module.topics.filter(id=int(request.GET.get('topic_id')))
            if len(topic) > 0:
                topic = topic[0]
        if topic:
            topic_res = collect_topic(topic, profile)
        else:
            topic_res = []
        all_topics = []
        for topic in module.topics.all():
            is_done = False
            if profile.is_student:
                is_done = profile in topic.done_by.all()
            all_topics.append([topic.id, topic.title, topic.is_task, is_done])
        data = {
            'topic_res':topic_res,
            'title':module.title,
            'author_profile':module.author_profile.first_name,
            'author_profile_link':module.author_profile.get_absolute_url(),
            'done_by':len(module.done_by.all()),
            'try_by':len(module.try_by.all()),
            'all_topics':all_topics,
        }
        return JsonResponse(data)        
    else:
        return JsonResponse({})

def save_task(request):
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    tid = -1
    print('________________')
    if request.GET.get('id'):
        print('yoyoyoyoyo')
        if request.GET.get('id') == '-1':
            print('create task')
            task = Task.objects.create()
            task.save()
            topic = Topic.objects.filter(id = int(request.GET.get('topic_id')))
            if len(topic) == 0:
                return JsonResponse({})
            topic = topic[0]
            unit = topic.units.create()
            unit.task = task
            unit.save()
        else:
            print('get task')
            task = Task.objects.filter(id=int(request.GET.get('id')))
            if len(task) == 0:
                return JsonResponse({})
            task = task[0]
        task = hard_task_fill(task, request)
        print('fill task')
        print(' ')
        print(' ')
        print(' ')
        print(' ')
        task.save()
        tid = task.id
    data = {
        'tid':tid,
    }
    return JsonResponse(data)

def hard_task_fill(task, request):
    text = request.GET.get('text')
    lengths = [
        int(request.GET.get('lengths0')),
        int(request.GET.get('lengths1')),
        int(request.GET.get('lengths2')),
        int(request.GET.get('lengths3')),
        int(request.GET.get('lengths4')),
        int(request.GET.get('lengths5')),
    ]
    sum_prev = 0
    for x in range(0, len(lengths)):
        sum_prev += lengths[x]
        lengths[x] = sum_prev
    print(lengths) 
    i = int(request.GET.get('i'))
    if i == 0:
        task.task_problem_ru = ''
        task.task_problem_kz = ''
        task.task_ans_ru = ''
        task.task_ans_kz = ''
        task.task_solve_ru = ''
        task.task_solve_kz = ''
    cnt = 0
    start_index = 0
    end_index_crnt = 0
    for l in lengths:
        print(' ')
        print(' ')
        end_index = l 
        print(i, start_index, end_index, cnt)
        if end_index >=  i * 500:
            end_index_crnt = min(end_index - i*500, 500)
            crnt_text = text[start_index:end_index_crnt]
            print('end_index_crnt', end_index_crnt, crnt_text)
            if cnt == 0:
                task.task_problem_ru += crnt_text
            if cnt == 1:
                task.task_problem_kz += crnt_text
            if cnt == 2:
                task.task_ans_ru += crnt_text
            if cnt == 3:
                task.task_ans_kz += crnt_text
            if cnt == 4:
                task.task_solve_ru += crnt_text
            if cnt == 5:
                task.task_solve_kz += crnt_text
        cnt += 1
        start_index = end_index_crnt 
        if start_index > 500:
            break
    return task

def delete_unit(request):
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    if request.GET.get('id') and request.GET.get('topic_id'):
        topic = Topic.objects.filter(id = int(request.GET.get('topic_id')))
        if len(topic) == 0: 
            return JsonResponse({})
        topic = topic[0]
        unit = topic.units.get(id=int(request.GET.get('id')))
        unit.delete()
        i = 1
        for unit in topic.units.all():
            unit.order = i
            i += 1
            unit.save()
    data = {
    }
    return JsonResponse(data)

def add_task_to_unit(request):
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    unit_id = -1
    if request.GET.get('id') and request.GET.get('topic_id'):
        task = Task.objects.filter(id=int(request.GET.get('id')))
        if len(task) == 0:
            return JsonResponse({})
        task = task[0]
        topic = Topic.objects.filter(id = int(request.GET.get('topic_id')))
        if len(topic) == 0:
            return JsonResponse({})
        topic = topic[0]
        unit = topic.units.create(
            order = len(topic.units.all())+1
            )
        unit.task = task
        unit.save()
        unit_id = unit.id
    data = {
        'unit_id':unit_id,
    }
    return JsonResponse(data)

def get_all_tasks(request):
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    res = []
    tasks = Task.objects.all()
    for task in tasks:
        res.append(collect_task(task, False, profile))
    data = {
        "res":res,
    }
    return JsonResponse(data)

def save_topic_title(request):
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    if request.GET.get('topic_id') and request.GET.get('title'):
        topic = Topic.objects.filter(id = int(request.GET.get('topic_id')))
        if len(topic) == 0:
            return JsonResponse({})
        topic = topic[0]
        topic.title = request.GET.get('title')
        topic.save()
    data = {
    }
    return JsonResponse(data)

def course_shown(request):
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    shown = False
    if request.GET.get('id'):
        course = Course.objects.filter(id = int(request.GET.get('id')))
        if len(course) == 0:
            return JsonResponse({})
        course = course[0]
        if course.shown:
            course.shown = False
        else:
            course.shown = True            
        course.save()
        shown = course.shown
    data = {
        "shown":shown,
    }
    return JsonResponse(data)

def module_shown(request):
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    shown = False
    if request.GET.get('id'):
        module = Module.objects.filter(id = int(request.GET.get('id')))
        if len(module) == 0:
            return JsonResponse({})
        module = module[0]
        if module.access_to_everyone:
            module.access_to_everyone = False
        else:
            module.access_to_everyone = True            
        module.save()
        shown = module.access_to_everyone
    data = {
        "shown":shown,
    }
    return JsonResponse(data)

def move_unit(request):
    ok = False
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    status = request.GET.get('status')
    if request.GET.get('id') and status and request.GET.get('topic_id'):
        topic = Topic.objects.filter(id = int(request.GET.get('topic_id')))
        if len(topic) == 0:
            return JsonResponse({})
        topic = topic[0]
        sid = int(request.GET.get('id'))
        unit = topic.units.filter(id=sid)
        if len(unit) == 0:
            return JsonResponse({})
        unit = unit[0]
        order = unit.order
        if status == 'up':
            order2 = order - 1
        else:
            order2 = order + 1
        for s in topic.units.all():
            print(s.order)
        unit2 = topic.units.filter(order=order2)
        if len(unit2) == 0:
            return JsonResponse({})
        unit2 = unit2[0]
        unit2.order = order
        unit2.save()
        unit.order = order2
        unit.save()
        ok = True
    data = {
        'ok':ok,
    }
    return JsonResponse(data)

def move_topic(request):
    ok = False
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    status = request.GET.get('status')
    if request.GET.get('topic_id') and status and request.GET.get('module_id'):
        module = Module.objects.filter(id = int(request.GET.get('module_id')))
        if len(module) == 0:
            return JsonResponse({})
        module = module[0]
        topic = module.topics.filter(id = int(request.GET.get('topic_id')))
        if len(topic) == 0:
            return JsonResponse({})
        topic = topic[0]
        order = topic.order
        if status == 'up':
            order2 = order - 1
        else:
            order2 = order + 1
        topic2 = module.topics.filter(is_task=topic.is_task, order=order2)
        if len(topic2) == 0:
            return JsonResponse({})
        topic2 = topic2[0]
        topic2.order = order
        topic2.save()
        topic.order = order2
        topic.save()
        print(order, order2)        
        ok = True
    data = {
        'ok':ok,
    }
    return JsonResponse(data)
