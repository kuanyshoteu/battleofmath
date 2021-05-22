from __future__ import unicode_literals

from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.urls import reverse
from django.db import models
from django.db.models.signals import pre_save
from django.utils import timezone

from django.utils.text import slugify
from markdown_deux import markdown

from django.utils.safestring import mark_safe
from transliterate import translit, get_available_language_codes
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save

from pagedown.widgets import PagedownWidget
from django.contrib.postgres.fields import ArrayField
import datetime

def upload_location(instance, filename):
    ProfileModel = instance.__class__
    if ProfileModel.objects.order_by("id").last():
        new_id = ProfileModel.objects.order_by("id").last().id + 1
    return "%s" %(filename)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE,related_name='profile')
    first_name = models.TextField(blank = True,null = True,default='name')
    money = models.IntegerField(default=0)
    is_student = models.BooleanField(default=True)
    coins = models.IntegerField(default=0)
    mail = models.TextField(blank = True,default = '',null = True)
    image = models.ImageField(upload_to=upload_location, 
            null=True,
            blank=True,
            )
    confirmed = models.BooleanField(default=True)
    confirmation_code = models.CharField(default='', max_length=250)
    confirmation_time = models.DateTimeField(auto_now_add=False, default=datetime.datetime.strptime('2000-01-01', "%Y-%m-%d"))
    language = models.CharField(default='ru', max_length=5)
    class Meta:
        ordering = ['is_student', 'id']

    def get_absolute_url(self):
        self.user.username = self.user.username.replace(' ', '_')
        self.user.username = self.user.username.replace('Қ', 'К')
        self.user.username = self.user.username.replace('қ', 'к')
        return reverse("accounts:profile", kwargs={"user": self.user})

class Notification(models.Model):
    text = models.TextField(default='')
    author_profile = models.ForeignKey(Profile, null=True, on_delete = models.CASCADE, related_name='made_notifications')
    itstype = models.CharField(max_length=25)
    url = models.TextField(default='', null=True)
    image_url = models.TextField(default='')
    timestamp = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['-timestamp']
