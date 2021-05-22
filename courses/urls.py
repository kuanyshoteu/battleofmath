from django.conf.urls import url
from django.contrib import admin

from .views import *
from django.contrib.auth.models import User

app_name = 'courses'
urlpatterns = [
    url(r'^get_courses/$', get_courses, name='get_courses'),
]