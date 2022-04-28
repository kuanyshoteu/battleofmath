from django.conf.urls import url
from django.contrib import admin

from .views import *
app_name = 'adventures'
urlpatterns = [
    # url(r'^api/build_castle/$', build_castle, name='build_castle'),
    # url(r'^api/get_warrior/$', get_warrior, name='get_warrior'),
    # url(r'^api/move_warrior/$', move_warrior, name='move_warrior'),
    # url(r'^api/attack/$', attack, name='attack'),
    # url(r'^api/upgrade_warrior/$', upgrade_warrior, name='upgrade_warrior'),
    # url(r'^api/upgrade_castle/$', upgrade_castle, name='upgrade_castle'),
    url(r'^$', adventures_page, name='page'),
]