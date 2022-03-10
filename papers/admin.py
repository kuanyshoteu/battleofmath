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

class PageModelAdmin(admin.ModelAdmin):
    list_display = ["title", "id"]
    list_display_links = ["title"]
    list_filter = ["title"]

    search_fields = ["content"]
    class Meta:
        model = Page
admin.site.register(Page, PageModelAdmin)

class LessonModelAdmin(admin.ModelAdmin):
    list_display = ["title", "id"]
    list_display_links = ["title"]
    list_filter = ["title"]
    class Meta:
        model = Lesson
admin.site.register(Lesson, LessonModelAdmin)

class CommentAdmin(admin.ModelAdmin):
    list_display = ["id", "lesson","level","author_profile","timestamp"]
    list_display_links = ["id"]
    list_filter = ["level"]
    class Meta:
        model = Comment
admin.site.register(Comment, CommentAdmin)

class SectionModelAdmin(admin.ModelAdmin):
    list_display = ["id"]
    list_display_links = ["id"]
    list_filter = ["id"] 
    class Meta:
        model = Section
admin.site.register(Section, SectionModelAdmin)