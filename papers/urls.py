from django.conf.urls import url
from django.contrib import admin

from .views import *

app_name = 'topics'
urlpatterns = [
    url(r'^api/addgroup/$', AddGroup, name='add-group-toggle'),
    url(r'^api/rename_module/$', rename_module, name = 'rename_module'),
    url(r'^api/delete_topic_url/$', delete_topic, name = 'delete_topic_url'),
    url(r'^api/delete_module_url/$', delete_module, name = 'delete_module_url'),
    url(r'^api/new_task_url/$', NewTask, name='new_task_url'),
    url(r'^api/add_task_url/$', AddTask, name='add_task_url'),
    url(r'^api/add_unit_url/$', AddUnit, name='add_unit_url'),
    url(r'^api/add_topic_url/$', AddTopic, name='add_topic_url'),
    url(r'^api/new_comment/$', new_comment, name='new_comment_url'),
    url(r'^api/comment_like/$', like_comment, name='like_url'),
    url(r'^api/comment_dislike/$', dislike_comment, name='dislike_url'),
    url(r'^api/estimate_module/$', estimate_module, name='estimate_module_url'),
    url(r'^module(?P<module_id>\d+)/$', module_details, name='module_absolute_url'),
    url(r'^estimate_module(?P<module_id>\d+)/$', estimate_module_page, name='estimate_module_page'),
    url(r'^(?P<topic_id>\d+)/$', topic_details, name='topic_absolute_url'),
    url(r'^api/check_topic_url/$', check_topic, name = 'check_topic_url'),
]