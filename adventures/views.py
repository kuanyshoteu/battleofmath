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
from io import BytesIO
from django.contrib.postgres.search import TrigramSimilarity
from dateutil.relativedelta import relativedelta


def adventures_page(request):
    profile = None
    if request.user.is_authenticated:
        profile = get_profile(request)
        return redirect(profile.get_absolute_url())
    context = {
        "profile":profile,
        "land_type":"land_form",
    }
    return render(request, "landing/landing.html", context)
