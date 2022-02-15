from urllib.parse import quote_plus
from django.contrib import messages
from django.contrib.contenttypes.models import ContentType
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render, get_object_or_404, redirect
from django.utils import timezone
from django.views.generic import RedirectView

from .models import *
from tasks.models import Task, ProblemTag
from papers.models import Comment
from accounts.models import *
from constants import *

def module_details(request, module_id = None):
    profile = get_profile(request)
    module = Module.objects.get(id=module_id)
    if len(module.topics.all()) == 0:
        return redirect(module.estimate_module_page())
    else:
        for topic in module.topics.all():
            if not profile in topic.done_by.all():
                return redirect(topic.get_absolute_url())

def estimate_module_page(request, module_id = None):
    profile = get_profile(request)
    module = Module.objects.get(id=module_id)           
    context = {
        "profile": profile,
        'module':module,
        'is_trener':is_profi(profile, 'Teacher'),
        "is_manager":is_profi(profile, 'Manager'),
        "is_director":is_profi(profile, 'Director'),
    }
    return render(request, template_name='library/module_details.html', context=context)

def topic_details(request, topic_id = None):
    profile = get_profile(request)
    topic = Topic.objects.get(id=topic_id)
    module = topic.modules.first()           
 
    context = {
        "profile": profile,
        'topic_id':topic.id,
        "page":'library',
    }
    return render(request, "library/module_details.html", context)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.http import JsonResponse

def get_topic_units(request):
    profile = Profile.objects.get(user = request.user.id)
    data = []
    if request.GET.get('topic_id'):
        topic = Topic.objects.get(id = int(request.GET.get('topic_id')))
        module = topic.modules.first()
        other_topics = module.topics.all()
        done_by = []
        for student in topic.done_by.all():
            img = ''
            if student.image:
                img = student.image.url
            done_by.append([student.first_name, img])
        units = []
        for unit in topic.units.all():
            units.append([unit.content])
            tasks = []
            if unit.task:
                task = unit.task
                solutions = task.solver_checks.filter(author_profile=profile)
                solved_number = solutions.filter(solver_correctness=True)
                is_solved = False
                if len(solved_number) > 0:
                    is_solved = True
                tasks = [task.task_problem_ru, task.cost, is_solved]
            file = ''
            if unit.file:
                file = unit.file.url
            units.append([unit.content, file, tasks])
        data = [topic.title, done_by, units]
    data = {
        'data':data,
    }
    return JsonResponse(data)


def AddTopic(request):
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    topic_id = -1
    if request.GET.get('module_id') and request.GET.get('status'):
        module = Module.objects.get(id = int(request.GET.get('module_id')))
        if request.GET.get('status') == 'task':
            tasks_topic = module.topics.filter(is_task=True)
            if len(tasks_topic) > 0:
                if len(tasks_topic.last().units.all()) == 0:
                    topic_id = tasks_topic.last().id
                    data = {
                        'topic_id':topic_id,
                    }
                    return JsonResponse(data)
            topics_num = len(tasks_topic) + 1
            title = 'Задача'
            is_task = True
        else:
            topics_num = len(module.topics.filter(is_task=False)) + 1
            title = 'Страница' + str(topics_num)
            is_task = False
        topic = Topic.objects.create(
            title = title,
            order = topics_num,
            is_task = is_task,
            )
        topic.save()
        module.topics.add(topic)
        topic_id = topic.id
    data = {
        'topic_id':topic_id,
    }
    return JsonResponse(data)

def AddUnit(request):
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    if request.GET.get('topic_id'):
        topic = Topic.objects.filter(id = int(request.GET.get('topic_id')))
        if len(topic) == 0:
            return JsonResponse({})
        topic = topic[0]
        content = request.GET.get('content')
        file = request.FILES.get('file')
        video = request.FILES.get('video')
        if content or request.GET.get('youtube_link') or file or video:
            if request.GET.get('is_new') == 'yes':
                order = len(topic.units.all()) + 1
                unit = topic.units.create(
                    order = order,
                    )
                if content:
                    unit.content = content
            else:
                unit = topic.units.get(id=int(request.GET.get('unit_id')))
                if request.GET.get('is_several') == 'yes':
                    unit.content += content
                else:
                    unit.content = content
            if request.GET.get('youtube_link'):
                unit.youtube_video_link = request.GET.get('youtube_link').replace('watch?v=', 'embed/')
            elif file:
                unit.file = file
            elif video:
                unit.video = video
            file_url = ''
            file = ''
            video = ''
            if unit.file:
                file = str(unit.file)
                file_url = unit.file.url
            if unit.video:
                video = unit.video.url
            unit.save()
            unit_res = [
                unit.id,                    #0
                unit.content,               #1
                file_url,                       #2
                file,                           #3
                unit.youtube_video_link,    #4
                video,                          #5
                [],                             #6
                ]
    data = {
        'id':unit.id,
        'unit_res':unit_res,
    }
    return JsonResponse(data)

def NewTask(request):
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    if request.GET.get('text') and request.GET.get('cost') and request.GET.get('unit_id'):
        task = Task.objects.create(author_profile=profile, text=request.GET.get('text'))
        if request.GET.get('ans') != '&':
            task.answer = request.GET.get('ans').split('&')
            del task.answer[-1]
        elif request.GET.get('variants'):
            task.answer = request.GET.get('variant_ans').split('&')
            del task.answer[-1]
            task.variants = request.GET.get('variants').split('&')
            del task.variants[-1]
            if task.variants[0] != '':
                task.is_test = True
                if len(task.answer) > 1:
                    task.is_mult_ans = True
        if request.GET.get('tags') != '':
            tags = request.GET.get('tags').split('&')
            del tags[-1]
            # print(tags)
            for t in tags:
                tag = ProblemTag.objects.get_or_create(title=t)[0]
                task.tags.add(tag)
        
        unit = Unit.objects.get(id=int(request.GET.get('unit_id')))
        task.units.add(unit)                    
        task.cost = request.GET.get('cost')
        task.save()
    data = {
        "delete_url":task.get_delete_url(),
        'id':task.id,
        'change_text_url':task.change_text_url(),
        'change_answer_url':task.change_answer_url(),
    }
    return JsonResponse(data)

def AddTask(request):
    action = ''
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    if request.GET.get('unit_id') and request.GET.get('task_id'):
        unit = Unit.objects.get(id = int(request.GET.get('unit_id')))
        task = Task.objects.get(id = int(request.GET.get('task_id')))
        if task in unit.task_list.all():
            unit.task_list.remove(task)
            action = 'remove'
        else:
            unit.task_list.add(task)
            action = 'add'
    data = {
        'action': action
    }
    return JsonResponse(data)

def rename_module(request):
    ok = False
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    if request.GET.get('id') and request.GET.get('title'):
        module = Module.objects.get(id = int(request.GET.get('id')))           
        module.title = request.GET.get('title')
        module.save()
        ok = True
    data = {
        'ok':ok,
    }
    return JsonResponse(data)

def delete_topic(request):
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    if request.GET.get('topic_id'):
        topic = Topic.objects.get(id = int(request.GET.get('topic_id')))
        topic.delete()
    data = {}
    return JsonResponse(data)

def delete_module(request):
    ok = False
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    if request.GET.get('id'):
        module = Module.objects.get(id = int(request.GET.get('id')))
        module.delete()
        ok = True
    data = {
        'ok':ok,
    }
    return JsonResponse(data)

def delete_course(request):
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    if request.GET.get('id'):
        course = Course.objects.get(id = int(request.GET.get('id')))
        course.delete()
    data = {}
    return JsonResponse(data)

def AddGroup(request):
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    if request.GET.get('topic_id') and request.GET.get('squad_id') and request.GET.get('isin'):
        squad = Squad.objects.get(id = request.GET.get('squad_id')) 
        topic = Topic.objects.get(id = request.GET.get('topic_id'))
        if request.GET.get('isin') == 'yes' and squad in topic.squad_list.all():
            topic.squad_list.remove(squad)
        if request.GET.get('isin') == 'no' and not squad in topic.squad_list.all():
            topic.squad_list.add(squad)
    data = {
    }
    return JsonResponse(data)

def new_comment(request):
    profile = Profile.objects.get(user = request.user.id)
    if request.GET.get('content') and request.GET.get('module_id') and request.GET.get('parent_id'):
        comment = Comment.objects.create(
            content = request.GET.get('content'),
            module = Module.objects.get(id=int(request.GET.get('module_id'))),
            author_profile = profile,
            )
        parent_id = int(request.GET.get('parent_id'))
        if parent_id > 0:
            parent = Comment.objects.get(id=parent_id)
            comment.parent = parent
            comment.level = parent.level + 1
            comment.save()

    data = {}
    return JsonResponse(data)

def like_comment(request):
    profile = Profile.objects.get(user = request.user.id)
    like = False
    if request.GET.get('id'):
        comment = Comment.objects.get(id=int(request.GET.get('id')))
        if profile in comment.dislikes.all():
            comment.dislikes.remove(profile) 
        else:
            comment.likes.add(profile)
            like = True
    res = len(comment.likes.all()) - len(comment.dislikes.all())
    if res > 0:
        res = "+" + str(res)
    data = {
        "like_num":res,
        "like":like,
    }
    return JsonResponse(data)

def dislike_comment(request):
    profile = Profile.objects.get(user = request.user.id)
    dislike = False
    if request.GET.get('id'):
        comment = Comment.objects.get(id=int(request.GET.get('id')))
        if profile in comment.likes.all():
            comment.likes.remove(profile)
        else:
            comment.dislikes.add(profile)
            dislike = True
    res = len(comment.likes.all()) - len(comment.dislikes.all())
    data = {
        "like_num":res,
        "dislike":dislike,
    }
    return JsonResponse(data)

def estimate_module(request):
    profile = Profile.objects.get(user = request.user.id)
    if request.GET.get('new_rating') and request.GET.get('module_id'):
        module = Module.objects.get(id = int(request.GET.get('module_id')))
        if not profile.id in module.estimater_ids:
            module.estimater_ids.append(profile.id)
            module.grades.append(1)
        index = module.estimater_ids.index(profile.id)
        module.grades[index] = int(request.GET.get('new_rating'))
        grades_sum = 0
        for grade in module.grades:
            grades_sum += grade
        if len(module.grades) > 0:
            module.rating = int(grades_sum/len(module.grades))
        else:
            module.rating = 0
        module.save()
        
    data = {
    }
    return JsonResponse(data)

def courses(request):
    profile = ''
    is_trener = ''
    is_manager = ''
    is_director = ''
    if request.user.is_authenticated:
        profile = get_profile(request)
        is_trener = is_profi(profile, 'Teacher')
        is_manager = is_profi(profile, 'Manager')
        is_director = is_profi(profile, 'Director')
    context = {
        "profile": profile,
        "course_sets":course_sets(),
        'is_trener':is_trener,
        "is_manager":is_manager,
        "is_director":is_director,
    }
    return render(request, 'courses/course_list.html', context=context)

def course_sets():
    course_sets = []
    tops = ['Курсы с лучшими рейтингами']
    tops.append(package_courses('rating'))
    news = ['Свежие курсы']
    news.append(package_courses('-id'))
    course_sets.append(tops)
    course_sets.append(news)
    return course_sets

def package_courses(order_item):
    index = 0
    sets = []
    temp_set = []
    for course in Course.objects.all().order_by(order_item):
        index += 1
        temp_set.append(course)
        if index % 4 == 0:
            sets.append(temp_set)
            temp_set = []
        if index == 12:
            break
    if index < 12:
        sets.append(temp_set)
    return sets

def check_topic(request):
    if request.GET.get('current_topic'):
        profile = Profile.objects.get(user = request.user.id)
        topic = Topic.objects.get(id = int(request.GET.get('current_topic')))
        
        solver_correctness = True
        for unit in topic.units.all():
            for task in unit.task_list.all():
                solver = profile.check_tasks.get_or_create(task = task)[0]
                if solver.solver_correctness == False:
                    solver_correctness = False
                    break
        if solver_correctness:
            topic.done_by.add(profile)
            module = topic.modules.first()
            module_is_done = True
            for ppr in module.topics.all():
                if not profile in ppr.done_by.all():
                    module_is_done = False
                    break
            if module_is_done:
                module.done_by.add(profile)
        else:
            topic.done_by.remove(profile)
    data = {
        'is_solved': solver_correctness
    }
    return JsonResponse(data)
