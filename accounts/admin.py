from django.contrib import admin

from .models import *


class ProfileModelAdmin(admin.ModelAdmin):
    list_display = ["first_name", "id", "mail"]
    list_display_links = ["first_name"]
    search_fields = ["first_name"]
    class Meta:
        model = Profile

admin.site.register(Profile, ProfileModelAdmin)

