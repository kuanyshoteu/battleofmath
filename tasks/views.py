from urllib.parse import quote_plus

from django.contrib import messages
from django.contrib.contenttypes.models import ContentType
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render, get_object_or_404, redirect
from django.utils import timezone
from django.views.generic import RedirectView

from .forms import TaskForm
from .models import *
from papers.models import Page
from accounts.models import Profile
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.http import JsonResponse
from constants import *

class ChangeTimeAPIToggle(APIView):
    authentication_classes = (authentication.SessionAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    def get(self, request, slug=None, format=None):
        data = {
        }
        return Response(data)
                
def ChangeAnswer(request):
    profile = Profile.objects.get(user = request.user.id)
    solved = False
    was_solved = False
    parent = True
    action = ''
    value = 0
    if request.GET.get('id'):
        task = Task.objects.get(id = int(request.GET.get('id')))
        if request.GET.get('ans'):
            answer = request.GET.get('ans')
            solve = request.GET.get('solve')
            if profile.is_student:
                solver_checks = task.solver_checks.get(author_profile=profile)
                was_solved = solver_checks.solver_correctness
                solver_checks.solver_correctness = False
                solver_checks.solver_try_number += 1
                solver_checks.solve = solve
                solved = False
                if profile.language == 'kz':
                    task_ans = task.task_ans_kz
                if profile.language == 'ru' or task_ans == '':
                    task_ans = task.task_ans_ru
                print(task_ans, answer, task_ans == answer)
                if task_ans == answer:
                    solved = True
                    solver_checks.solver_correctness = True
                    subthemes = task.subthemes.all()
                    for p in Page.objects.filter(subthemes__in = subthemes):
                        p.done_by.add(profile)

                    if was_solved == False:
                        profile.coins += task.cost
                        action = 'plus'
                        value = task.cost
                else:
                    if was_solved:
                        profile.coins -= task.cost
                        action = 'minus'
                        value = task.cost
                solver_checks.solver_ans = [answer]
                solver_checks.save()
    profile.save()
    task.save()
    data = {
        'solved':solved,
        # 'parent':parent,
        'action':action,
        'hiscoins':profile.coins,
    }
    return JsonResponse(data)

def ChangeText(request):
    profile = Profile.objects.get(user = request.user.id)
    if request.GET.get('id') and is_profi(profile, 'Teacher'):
        task = Task.objects.get(id = int(request.GET.get('id')))
        if request.GET.get('text'):
            task.text = request.GET.get('text')
        if request.GET.get('cost'):
            task.cost = request.GET.get('cost')
        if request.GET.get('answer'):
            answer = request.GET.get('answer').split('&')
            del answer[-1]
            task.answer = answer
        task.save()
    data = {
    }
    return JsonResponse(data)


def task_delete(request):
    if request.GET.get('id'):
        task = Task.objects.get(id = int(request.GET.get('id')))
        task.delete()
                    
    data = {
        "like_num":0,
    }
    return JsonResponse(data)

