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
from django.contrib.auth.forms import PasswordChangeForm
from constants import *


def index_view(request):
    return render(request,'frontend/index.html', context=None)


