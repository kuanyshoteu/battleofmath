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

def lesson_details(request, lesson_id = None):
    profile = get_profile(request)
    lesson = Lesson.objects.get(id=lesson_id)
    if len(lesson.pages.all()) == 0:
        return redirect(lesson.estimate_lesson_page())
    else:
        for page in lesson.pages.all():
            if not profile in page.done_by.all():
                return redirect(page.get_absolute_url())

def estimate_lesson_page(request, lesson_id = None):
    profile = get_profile(request)
    lesson = Lesson.objects.get(id=lesson_id)           
    context = {
        "profile": profile,
        'lesson':lesson,
        'is_trener':is_profi(profile, 'Teacher'),
        "is_manager":is_profi(profile, 'Manager'),
        "is_director":is_profi(profile, 'Director'),
    }
    return render(request, template_name='library/lesson_details.html', context=context)

def page_details(request, page_id = None):
    profile = get_profile(request)
    page = Page.objects.get(id=page_id)
    lesson = page.lessons.first()           
    print(page.title)
    context = {
        "profile": profile,
        'page':page,
        "w":'library',
    }
    return render(request, "library/lesson_details.html", context)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.http import JsonResponse

def get_page_sections(request):
    profile = Profile.objects.get(user = request.user.id)
    data = []
    if request.GET.get('page_id'):
        page = Page.objects.get(id = int(request.GET.get('page_id')))
        section = Section.objects.first()
        lesson = page.lessons.first()
        other_pages = lesson.pages.all()
        other_pages_links = []
        for opage in other_pages:
            other_pages_links.append([opage.id, opage.get_page_sections(), opage.title])
        done_by = []
        for student in page.done_by.all():
            img = ''
            if student.image:
                img = student.image.url
            done_by.append([student.first_name, img])
        sections = []
        for section in page.sections.all():
            tasks = []
            if section.task:
                task = section.task
                solutions = task.solver_checks.filter(author_profile=profile)
                solved_number = solutions.filter(solver_correctness=True)
                is_solved = False
                if len(solved_number) > 0:
                    is_solved = True
                tasks = [task.task_problem_ru, task.cost, is_solved]
            file = ''
            # if section.file:
            #     file = section.file.url
            sections.append([section.content, file, tasks])
        data = [page.title, done_by, sections, other_pages_links]
    data = {
        'data':data,
    }
    return JsonResponse(data)


def AddPage(request):
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    page_id = -1
    if request.GET.get('lesson_id') and request.GET.get('status'):
        lesson = Lesson.objects.get(id = int(request.GET.get('lesson_id')))
        if request.GET.get('status') == 'task':
            tasks_page = lesson.pages.filter(is_task=True)
            if len(tasks_page) > 0:
                if len(tasks_page.last().sections.all()) == 0:
                    page_id = tasks_page.last().id
                    data = {
                        'page_id':page_id,
                    }
                    return JsonResponse(data)
            pages_num = len(tasks_page) + 1
            title = 'Задача'
            is_task = True
        else:
            pages_num = len(lesson.pages.filter(is_task=False)) + 1
            title = 'Страница' + str(pages_num)
            is_task = False
        page = Page.objects.create(
            title = title,
            order = pages_num,
            is_task = is_task,
            )
        page.save()
        lesson.pages.add(page)
        page_id = page.id
    data = {
        'page_id':page_id,
    }
    return JsonResponse(data)

def AddSection(request):
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    if request.GET.get('page_id'):
        page = Page.objects.filter(id = int(request.GET.get('page_id')))
        if len(page) == 0:
            return JsonResponse({})
        page = page[0]
        content = request.GET.get('content')
        file = request.FILES.get('file')
        video = request.FILES.get('video')
        if content or request.GET.get('youtube_link') or file or video:
            if request.GET.get('is_new') == 'yes':
                order = len(page.sections.all()) + 1
                section = page.sections.create(
                    order = order,
                    )
                if content:
                    section.content = content
            else:
                section = page.sections.get(id=int(request.GET.get('section_id')))
                if request.GET.get('is_several') == 'yes':
                    section.content += content
                else:
                    section.content = content
            if request.GET.get('youtube_link'):
                section.youtube_video_link = request.GET.get('youtube_link').replace('watch?v=', 'embed/')
            elif file:
                section.file = file
            elif video:
                section.video = video
            file_url = ''
            file = ''
            video = ''
            if section.file:
                file = str(section.file)
                file_url = section.file.url
            if section.video:
                video = section.video.url
            section.save()
            section_res = [
                section.id,                    #0
                section.content,               #1
                file_url,                       #2
                file,                           #3
                section.youtube_video_link,    #4
                video,                          #5
                [],                             #6
                ]
    data = {
        'id':section.id,
        'section_res':section_res,
    }
    return JsonResponse(data)

def NewTask(request):
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    if request.GET.get('text') and request.GET.get('cost') and request.GET.get('section_id'):
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
        
        section = Section.objects.get(id=int(request.GET.get('section_id')))
        task.sections.add(section)                    
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
    if request.GET.get('section_id') and request.GET.get('task_id'):
        section = Section.objects.get(id = int(request.GET.get('section_id')))
        task = Task.objects.get(id = int(request.GET.get('task_id')))
        if task in section.task_list.all():
            section.task_list.remove(task)
            action = 'remove'
        else:
            section.task_list.add(task)
            action = 'add'
    data = {
        'action': action
    }
    return JsonResponse(data)

def rename_lesson(request):
    ok = False
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    if request.GET.get('id') and request.GET.get('title'):
        lesson = Lesson.objects.get(id = int(request.GET.get('id')))           
        lesson.title = request.GET.get('title')
        lesson.save()
        ok = True
    data = {
        'ok':ok,
    }
    return JsonResponse(data)

def delete_page(request):
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    if request.GET.get('page_id'):
        page = Page.objects.get(id = int(request.GET.get('page_id')))
        page.delete()
    data = {}
    return JsonResponse(data)

def delete_lesson(request):
    ok = False
    profile = Profile.objects.get(user = request.user.id)
    only_teachers(profile)
    if request.GET.get('id'):
        lesson = Lesson.objects.get(id = int(request.GET.get('id')))
        lesson.delete()
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
    if request.GET.get('page_id') and request.GET.get('squad_id') and request.GET.get('isin'):
        squad = Squad.objects.get(id = request.GET.get('squad_id')) 
        page = Page.objects.get(id = request.GET.get('page_id'))
        if request.GET.get('isin') == 'yes' and squad in page.squad_list.all():
            page.squad_list.remove(squad)
        if request.GET.get('isin') == 'no' and not squad in page.squad_list.all():
            page.squad_list.add(squad)
    data = {
    }
    return JsonResponse(data)

def new_comment(request):
    profile = Profile.objects.get(user = request.user.id)
    if request.GET.get('content') and request.GET.get('lesson_id') and request.GET.get('parent_id'):
        comment = Comment.objects.create(
            content = request.GET.get('content'),
            lesson = Lesson.objects.get(id=int(request.GET.get('lesson_id'))),
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

def estimate_lesson(request):
    profile = Profile.objects.get(user = request.user.id)
    if request.GET.get('new_rating') and request.GET.get('lesson_id'):
        lesson = Lesson.objects.get(id = int(request.GET.get('lesson_id')))
        if not profile.id in lesson.estimater_ids:
            lesson.estimater_ids.append(profile.id)
            lesson.grades.append(1)
        index = lesson.estimater_ids.index(profile.id)
        lesson.grades[index] = int(request.GET.get('new_rating'))
        grades_sum = 0
        for grade in lesson.grades:
            grades_sum += grade
        if len(lesson.grades) > 0:
            lesson.rating = int(grades_sum/len(lesson.grades))
        else:
            lesson.rating = 0
        lesson.save()
        
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

def check_page(request):
    if request.GET.get('current_page'):
        profile = Profile.objects.get(user = request.user.id)
        page = Page.objects.get(id = int(request.GET.get('current_page')))
        
        solver_correctness = True
        for section in page.sections.all():
            for task in section.task_list.all():
                solver = profile.check_tasks.get_or_create(task = task)[0]
                if solver.solver_correctness == False:
                    solver_correctness = False
                    break
        if solver_correctness:
            page.done_by.add(profile)
            lesson = page.lessons.first()
            lesson_is_done = True
            for ppr in lesson.pages.all():
                if not profile in ppr.done_by.all():
                    lesson_is_done = False
                    break
            if lesson_is_done:
                lesson.done_by.add(profile)
        else:
            page.done_by.remove(profile)
    data = {
        'is_solved': solver_correctness
    }
    return JsonResponse(data)
