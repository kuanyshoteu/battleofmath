from django.conf.urls import url
from django.contrib import admin

from .views import *
app_name = 'Enigmath'
urlpatterns = [
    url(r'^login/$', login_page, name='login_page'),
    url(r'^sign_up/$', sign_up, name='sign_up'),
    url(r'^api/login/$', login_view, name='login'),
    url(r'^api/update_pswd/$', update_pswd, name='update_pswd'),
    url(r'^api/reset_pswrd/$', reset_pswrd, name='reset_pswrd'),
    url(r'^api/register/$', register_view, name='register'),
    url(r'^api/change_lang/$', change_lang, name='change_lang'),
    url(r'^reset_pswrd_view/$', reset_pswrd_view, name='reset_pswrd_view'),
    url(r'^search/$', search, name='search'),
    url(r'^robots.txt', robots, name="robots"),
    url(r'^sitemap', sitemap, name="sitemap"),
    url(r'^file_changer/$', file_changer, name='file_changer'),
    url(r'^$', newland, name='home'),
]