from django.conf.urls import url
from django.contrib import admin

from .views import *
from django.contrib.auth.models import User

app_name = 'accounts'
urlpatterns = [
    url(r'^change_url/$', change_profile, name='change_url'),
    url(r'^check_confirmation/$', check_confirmation, name='check_confirmation'),
    url(r'^(?P<user>[\w-]+)/$', account_view, name='profile'),    
    url(r'^api/save_profile/$', save_profile, name='save_profile'),
    url(r'^api/mycourses/$', profile_courses, name='profile_courses'),
]