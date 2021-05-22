from django.conf.urls import url
from django.contrib import admin
from .views import *

app_name = 'library'
urlpatterns = [
    url(r'^api/create_module/$', create_module, name='create_module'),
    url(r'^api/get_library/$', get_library_teacher, name = 'get_library'),
    url(r'^api/show_module/$', show_module, name = 'show_module'),
    url(r'^api/get_course_files/$', get_course_files, name = 'get_course_files'),
    url(r'^api/create_course/$', create_course, name = 'create_course_url'),
    url(r'^api/rename_course/$', rename_course, name = 'rename_course'),
    url(r'^api/delete_course_url/$', delete_course, name = 'delete_course_url'),
    url(r'^api/file_action_url/$', file_action, name = 'file_action_url'),
    url(r'^api/paste_to_course/$', paste, name = 'paste_to_course'),
    url(r'^api/save_task/$', save_task, name = 'save_task'),
    url(r'^api/get_all_tasks/$', get_all_tasks, name = 'get_all_tasks'),
    url(r'^api/delete_unit/$', delete_unit, name = 'delete_unit'),
    url(r'^api/add_task_to_unit/$', add_task_to_unit, name = 'add_task_to_unit'),
    url(r'^api/save_topic_title/$', save_topic_title, name = 'save_topic_title'),
    url(r'^api/move_unit_url/$', move_unit, name = 'move_unit_url'),
    url(r'^api/move_topic/$', move_topic, name = 'move_topic'),
    url(r'^api/course_shown/$', course_shown, name = 'course_shown'),
    url(r'^api/module_shown/$', module_shown, name = 'module_shown'),
    url(r'^course/(?P<course_id>\d+)/$', course_details, name='get_absolute_url'),
]