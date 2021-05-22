from django.contrib import admin

# Register your models here.
from .models import *

class SubjectModelAdmin(admin.ModelAdmin):
    list_display = ["title", "id"]
    list_display_links = ["title"]
    list_filter = ["title"]

    search_fields = ["content"]
    class Meta:
        model = Subject
admin.site.register(Subject, SubjectModelAdmin)


class CourseModelAdmin(admin.ModelAdmin):
    list_display = ["title", "id"]
    list_display_links = ["title"]
    list_filter = ["title"]

    search_fields = ["content"]
    class Meta:
        model = Course
admin.site.register(Course, CourseModelAdmin)

class TopicModelAdmin(admin.ModelAdmin):
    list_display = ["title", "id"]
    list_display_links = ["title"]
    list_filter = ["title"]

    search_fields = ["content"]
    class Meta:
        model = Topic
admin.site.register(Topic, TopicModelAdmin)

class ModuleModelAdmin(admin.ModelAdmin):
    list_display = ["title", "id"]
    list_display_links = ["title"]
    list_filter = ["title"]
    class Meta:
        model = Module
admin.site.register(Module, ModuleModelAdmin)

class CommentAdmin(admin.ModelAdmin):
    list_display = ["id", "module","level","author_profile","timestamp"]
    list_display_links = ["id"]
    list_filter = ["level"]
    class Meta:
        model = Comment
admin.site.register(Comment, CommentAdmin)

class UnitModelAdmin(admin.ModelAdmin):
    list_display = ["id"]
    list_display_links = ["id"]
    list_filter = ["id"] 
    class Meta:
        model = Unit
admin.site.register(Unit, UnitModelAdmin)