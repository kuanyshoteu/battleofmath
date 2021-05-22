from django.contrib import admin

# Register your models here.
from .models import *

class TaskModelAdmin(admin.ModelAdmin):
    list_display = ["id", 'task_problem_ru']
    list_display_links = ["id"]
    search_fields = ["task_problem_ru"]
    class Meta:
        model = Task
admin.site.register(Task, TaskModelAdmin)

class TagModelAdmin(admin.ModelAdmin):
    list_display = ["id", 'title']
    list_display_links = ["id"]
    class Meta:
        model = ProblemTag

admin.site.register(ProblemTag, TagModelAdmin)