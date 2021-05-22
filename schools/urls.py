from django.conf.urls import url
from django.contrib import admin

from .views import *
from main.views import add_worker_school
from django.views.decorators.csrf import csrf_exempt

app_name = 'schools'
urlpatterns = [
    url(r'^api/show_manager_data/', show_manager_data, name='show_manager_data'),
    url(r'^api/save_manager_data/', save_manager_data, name='save_manager_data'),
    url(r'^api/delete_manager/', delete_manager, name='delete_manager'),
    url(r'^api/change_schooler_password/', change_schooler_password, name='change_schooler_password'),
    url(r'^api/get_course_list/', get_course_list, name='get_course_list'),
]