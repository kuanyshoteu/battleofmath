from django.conf.urls import url
from django.contrib import admin

from .views import *

app_name = 'pages'
urlpatterns = [
    url(r'^api/get_page_sections/$', get_page_sections, name='get_page_sections'),
    url(r'^api/addgroup/$', AddGroup, name='add-group-toggle'),
    url(r'^api/rename_lesson/$', rename_lesson, name = 'rename_lesson'),
    url(r'^api/delete_page_url/$', delete_page, name = 'delete_page_url'),
    url(r'^api/delete_lesson_url/$', delete_lesson, name = 'delete_lesson_url'),
    url(r'^api/new_task_url/$', NewTask, name='new_task_url'),
    url(r'^api/add_task_url/$', AddTask, name='add_task_url'),
    url(r'^api/add_section_url/$', AddSection, name='add_section_url'),
    url(r'^api/add_page_url/$', AddPage, name='add_page_url'),
    url(r'^api/new_comment/$', new_comment, name='new_comment_url'),
    url(r'^api/comment_like/$', like_comment, name='like_url'),
    url(r'^api/comment_dislike/$', dislike_comment, name='dislike_url'),
    url(r'^api/estimate_lesson/$', estimate_lesson, name='estimate_lesson_url'),
    url(r'^lesson(?P<lesson_id>\d+)/$', lesson_details, name='lesson_absolute_url'),
    url(r'^estimate_lesson(?P<lesson_id>\d+)/$', estimate_lesson_page, name='estimate_lesson_page'),
    url(r'^(?P<page_id>\d+)/$', page_details, name='page_absolute_url'),
    url(r'^api/check_page_url/$', check_page, name = 'check_page_url'),
]