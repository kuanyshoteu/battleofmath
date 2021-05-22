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
from django.contrib.postgres.fields import ArrayField

from accounts.models import Profile
from tasks.models import Task

def upload_location(instance, filename):
    TopicModel = instance.__class__
    new_id = TopicModel.objects.order_by("id").last().id + 1
    return "%s" %(filename)

class Subject(models.Model):
    title = models.TextField()
    slogan = models.TextField(null = True)
    shown = models.BooleanField(default=False)    
    img = models.ImageField(upload_to=upload_location, 
            null=True,
            blank=True,
            )

class Course(models.Model):
    subject = models.ForeignKey(Subject, null = True, on_delete = models.CASCADE, related_name='courses')
    author_profile = models.ForeignKey(Profile, null = True, on_delete = models.CASCADE, related_name='module_folders')
    title = models.TextField()
    slogan = models.TextField(null = True)
    shown = models.BooleanField(default=False)    
    img = models.ImageField(upload_to=upload_location, 
            null=True,
            blank=True,
            )
    class Meta:
        ordering = ['id']
    def get_absolute_url(self):
        return reverse("library:get_absolute_url", kwargs={"course_id": self.id})
    def delete_folder_url(self):
        return reverse("library:delete_folder_url")
    def change_name_url(self):
        return reverse("library:change_name_url")

class Cache(models.Model):
    author_profile = models.ForeignKey(Profile, null = True, on_delete = models.CASCADE, related_name='module_cache')
    object_type = models.TextField(default='module')
    object_id = models.IntegerField(null = True)
    action = models.TextField(default='copy')
    previous_parent = models.IntegerField(null = True)
    timestamp = models.DateTimeField(auto_now_add=True)
    full = models.BooleanField(default = False)

class Topic(models.Model):
    title = models.CharField(max_length=250)
    timestamp = models.DateTimeField(auto_now_add=True)
    done_by = models.ManyToManyField(Profile, related_name='done_topics')
    order = models.IntegerField(null = True)
    is_task = models.BooleanField(default = False)
    class Meta:
        ordering = ['order', 'id']
    def __unicode__(self):
        return self.title
    def get_absolute_url(self):
        return reverse("topics:topic_absolute_url", kwargs={"topic_id": self.id})
    def api_url_add_group(self):
        return reverse("topics:add-group-toggle")
    def delete_topic_url(self):
        return reverse("topics:delete_topic_url")
    def add_unit_url(self):
        return reverse("topics:add_unit_url")
    def rename_topic_url(self):
        return reverse("topics:rename_topic_url")
    @property
    def get_content_type(self):
        instance = self
        content_type = ContentType.objects.get_for_model(instance.__class__)
        return content_type

class Unit(models.Model):
    task = models.ForeignKey(Task, null = True, on_delete = models.CASCADE, related_name='units')
    content = models.TextField(default='', null = True)
    video = models.FileField(default='')
    file = models.FileField(default='')
    youtube_video_link = models.TextField(default='')
    order = models.IntegerField(default=0)
    topic = models.ForeignKey(Topic, null = True, on_delete = models.CASCADE, related_name='units')
    class Meta:
        ordering = ['order', 'id']    
    
class Module(models.Model):
    title = models.CharField(max_length=250)
    author_profile = models.ForeignKey(Profile, null=True, on_delete = models.CASCADE, related_name='module_author')
    topics = models.ManyToManyField(Topic, related_name='modules')
    timestamp = models.DateTimeField(auto_now_add=True)
    rating = models.IntegerField(default = 0)
    cost = models.IntegerField(default = 0)
    done_by = models.ManyToManyField(Profile, related_name='done_modules')
    try_by = models.ManyToManyField(Profile, related_name='try_modules')
    access_to_everyone = models.BooleanField(default=False)
    course = models.ForeignKey(Course, null=True, on_delete=models.CASCADE, related_name='modules')
    img = models.ImageField(upload_to=upload_location, 
            null=True,
            blank=True,
            )    
    def add_topic_url(self):
        return reverse("topics:add_topic_url")
    def change_name_url(self):
        return reverse("topics:change_name_url")
    def get_absolute_url(self):
        return reverse("topics:module_absolute_url", kwargs={"module_id": self.id})
    def delete_module_url(self):
        return reverse("topics:delete_module_url")
    def check_topic_url(self):
        return reverse("topics:check_topic_url")
    def new_comment_url(self):
        return reverse("topics:new_comment_url")
    def estimate_module_url(self):
        return reverse("topics:estimate_module_url")
    def estimate_module_page(self):
        return reverse("topics:estimate_module_page", kwargs={"module_id": self.id})
    class Meta:
        ordering = ['timestamp']

class Comment(models.Model):
    module = models.ForeignKey(Module, null=True, on_delete = models.CASCADE, related_name='comments')
    level = models.IntegerField(default=1)
    timestamp = models.DateTimeField(auto_now_add=True)
    author_profile = models.ForeignKey(Profile, null=True, on_delete = models.CASCADE, related_name='hiscomments')
    content = models.TextField(default='')
    parent = models.ForeignKey('self', null=True, on_delete = models.CASCADE, related_name='children')
    likes = models.ManyToManyField(Profile, related_name='liked_comments')
    dislikes = models.ManyToManyField(Profile, related_name='disliked_comments')
    class Meta:
        ordering = ['timestamp']
    def like_url(self):
        return reverse("topics:like_url")
    def dislike_url(self):
        return reverse("topics:dislike_url")

class SubscribePay(models.Model):
    module = models.ForeignKey(Module, null=True, on_delete = models.CASCADE, related_name='subscribe_payments')
    author = models.CharField(max_length=250)
    phone = models.CharField(max_length=250)
    transactionId = models.IntegerField(default=0)
    amount = models.FloatField(default=0)
    currency = models.CharField(max_length=10)
    timestamp = models.DateTimeField(auto_now_add=False)
    class Meta:
        ordering = ['-timestamp']
        
class Skill(models.Model):
    author = models.OneToOneField(Profile, null=True, on_delete = models.CASCADE, related_name='skill')
    tag_ids = ArrayField(models.IntegerField(), default = list)
    easy_skills = ArrayField(models.IntegerField(), default = list)
    middle_skills = ArrayField(models.IntegerField(), default = list)
    hard_skills = ArrayField(models.IntegerField(), default = list)
    pro_skills = ArrayField(models.IntegerField(), default = list)
    interested_subjects = models.ManyToManyField(Module, default=1, related_name='interested_students')