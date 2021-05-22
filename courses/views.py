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
from papers.models import *
from django.contrib.auth.forms import PasswordChangeForm
from constants import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.http import JsonResponse

def get_courses(request):
    print(request, 'dddddddddddddddd')
    ok = ['yo', [[0, 'yo1', 'yo2', 'yo3', 'yo4'], [1, 'yo1', 'yo2', 'yo3', 'yo4']]]
    data = {
        'ok':ok
    }
    return JsonResponse(data)
