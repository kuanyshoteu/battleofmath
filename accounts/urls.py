from django.conf.urls import url
from django.contrib import admin

from .views import *
from django.contrib.auth.models import User

app_name = 'accounts'
urlpatterns = [
    url(r'^change_url/$', change_profile, name='change_url'),
    url(r'^api/change_att_url/$', ChangeAttendance, name='change_att_url'),
    url(r'^api/miss_lecture/$', miss_lecture, name='miss_lecture_url'),
    url(r'^api/present_url/$', att_present, name='present_url'),
    url(r'^check_confirmation/$', check_confirmation, name='check_confirmation'),
    url(r'^(?P<user>[\w-]+)/$', account_view, name='profile'),    
    url(r'^api/save_profile/$', save_profile, name='save_profile'),
]