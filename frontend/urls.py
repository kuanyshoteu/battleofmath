from django.conf.urls import url
from django.contrib import admin

from .views import *
from django.contrib.auth.models import User

app_name = 'frontend'
urlpatterns = [
    url(r'^$', index_view, name='index_view'),
]