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
    PageModel = instance.__class__
    if PageModel.objects.order_by("id").last():
        new_id = PageModel.objects.order_by("id").last().id + 1
    else:
        new_id = 0
    return "%s" %(filename)

class Subject(models.Model):
    title = models.TextField()
    slogan = models.TextField(null = True)
    shown = models.BooleanField(default=False)    
    img = models.ImageField(upload_to=upload_location, 
            null=True,
            blank=True,
            )

class Game(models.Model):
    title = models.TextField()
    slogan = models.TextField(null = True)
    shown = models.BooleanField(default=False)    
    img = models.ImageField(upload_to=upload_location, 
            null=True,
            blank=True,
            )

class Course(models.Model):
    subject = models.ForeignKey(Subject, null = True, on_delete = models.CASCADE, related_name='courses')
    game = models.ForeignKey(Game, null = True, on_delete = models.CASCADE, related_name='courses')
    author_profile = models.ForeignKey(Profile, null = True, on_delete = models.CASCADE, related_name='lesson_folders')
    students = models.ManyToManyField(Profile, related_name='courses')
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
    author_profile = models.ForeignKey(Profile, null = True, on_delete = models.CASCADE, related_name='lesson_cache')
    object_type = models.TextField(default='lesson')
    object_id = models.IntegerField(null = True)
    action = models.TextField(default='copy')
    previous_parent = models.IntegerField(null = True)
    timestamp = models.DateTimeField(auto_now_add=True)
    full = models.BooleanField(default = False)

class Page(models.Model):
    title = models.CharField(max_length=250)
    timestamp = models.DateTimeField(auto_now_add=True)
    done_by = models.ManyToManyField(Profile, related_name='done_pages')
    order = models.IntegerField(null = True)
    is_task = models.BooleanField(default = False)
    class Meta:
        ordering = ['order', 'id']
    def __unicode__(self):
        return self.title
    def get_page_sections(self):
        return reverse("papers:get_page_sections")
    def get_absolute_url(self):
        return reverse("papers:page_absolute_url", kwargs={"page_id": self.id})
    def delete_page_url(self):
        return reverse("papers:delete_page_url")
    def add_section_url(self):
        return reverse("papers:add_section_url")
    def rename_page_url(self):
        return reverse("papers:rename_page_url")
    @property
    def get_content_type(self):
        instance = self
        content_type = ContentType.objects.get_for_model(instance.__class__)
        return content_type

class Section(models.Model):
    task = models.ForeignKey(Task, null = True, on_delete = models.CASCADE, related_name='sections')
    content = models.TextField(default='', null = True)
    # video = models.FileField(default='', null=True)
    # file = models.FileField(default='', null=True)
    youtube_video_link = models.TextField(default='')
    order = models.IntegerField(default=0)
    pages = models.ForeignKey(Page, null = True, on_delete = models.CASCADE, related_name='sections')
    class Meta:
        ordering = ['order', 'id']    

class Island(models.Model):
    title = models.CharField(max_length=250)
    img = models.ImageField(upload_to=upload_location, 
            null=True,
            blank=True,
            )    
    order = models.IntegerField(default=0)
    course = models.ForeignKey(Course, null=True, on_delete=models.CASCADE, related_name='islands')

class Lesson(models.Model):
    title = models.CharField(max_length=250)
    description = models.TextField(default='', null = True)
    author_profile = models.ForeignKey(Profile, null=True, on_delete = models.CASCADE, related_name='lesson_author')
    pages = models.ManyToManyField(Page, related_name='lessons')
    rating = models.IntegerField(default = 0)
    cost = models.IntegerField(default = 0)
    order = models.IntegerField(default=0)
    done_by = models.ManyToManyField(Profile, related_name='done_lessons')
    try_by = models.ManyToManyField(Profile, related_name='try_lessons')
    access_to_everyone = models.BooleanField(default=False)
    course = models.ForeignKey(Course, null=True, on_delete=models.CASCADE, related_name='lessons')
    island = models.ForeignKey(Island, null=True, on_delete=models.CASCADE, related_name='lessons')
    img = models.ImageField(upload_to=upload_location, 
            null=True,
            blank=True,
            )    
    def add_page_url(self):
        return reverse("papers:add_page_url")
    def change_name_url(self):
        return reverse("papers:change_name_url")
    def get_absolute_url(self):
        return reverse("papers:lesson_absolute_url", kwargs={"lesson_id": self.id})
    def delete_lesson_url(self):
        return reverse("papers:delete_lesson_url")
    def check_page_url(self):
        return reverse("papers:check_page_url")
    def new_comment_url(self):
        return reverse("papers:new_comment_url")
    def estimate_lesson_url(self):
        return reverse("papers:estimate_lesson_url")
    def estimate_lesson_page(self):
        return reverse("papers:estimate_lesson_page", kwargs={"lesson_id": self.id})
    class Meta:
        ordering = ['id']

class Comment(models.Model):
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
        return reverse("papers:like_url")
    def dislike_url(self):
        return reverse("papers:dislike_url")

class SubscribePay(models.Model):
    lesson = models.ForeignKey(Lesson, null=True, on_delete = models.CASCADE, related_name='subscribe_payments')
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
    interested_subjects = models.ManyToManyField(Lesson, default=1, related_name='interested_students')