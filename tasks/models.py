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
from django.contrib.postgres.fields import ArrayField, HStoreField

from accounts.models import Profile

def upload_location(instance, filename):
    TaskModel = instance.__class__
    new_id = TaskModel.objects.order_by("id").last().id + 1
    return "%s" %(filename)

class ProblemTag(models.Model):
    title = models.TextField(default='')

class Task(models.Model):
    author_profile = models.ForeignKey(Profile, default=1, on_delete = models.CASCADE)
    task_problem_ru = models.TextField(default='')
    task_problem_kz = models.TextField(default='')
    task_ans_ru = models.TextField(default='')
    task_ans_kz = models.TextField(default='')
    task_solve_ru = models.TextField(default='')
    task_solve_kz = models.TextField(default='')
    image = models.ImageField(upload_to=upload_location, 
            null=True, 
            blank=True, 
            )
    cost = models.IntegerField(default=1)
    tags = models.ManyToManyField(ProblemTag, related_name='tasks')
    def __unicode__(self):
        return self.id
    def get_delete_url(self):
        return reverse("tasks:delete")
    def get_markdown(self):
        return mark_safe(markdown(self.content))
    def children(self): #replies
        return Task.objects.filter(parent=self)
    def change_answer_url(self):
        return reverse("tasks:change_answer_url")
    def change_text_url(self):
        return reverse("tasks:change_text_url")
    @property
    def get_content_type(self):
        instance = self
        content_type = ContentType.objects.get_for_model(instance.__class__)
        return content_type

    class Meta:
        ordering = ['id']

class TaskPart(models.Model):
    post = models.ForeignKey(Task, null=True, on_delete = models.CASCADE, related_name='parts')
    image = models.ImageField(upload_to=upload_location, 
            null=True,
            blank=True, 
            )
    order = models.IntegerField(default=0)
    class Meta: 
        ordering = ['order']

class Solver(models.Model):
    solver_ans = ArrayField(models.TextField(), default = list)
    solve = models.TextField(default='')
    author_profile = models.ForeignKey(Profile, default=1, on_delete = models.CASCADE, related_name='check_tasks')
    solver_correctness = models.BooleanField(default=False)
    solver_try_number = models.IntegerField(default=0)
    task = models.ForeignKey(Task, default=1, on_delete = models.CASCADE, related_name='solver_checks')




