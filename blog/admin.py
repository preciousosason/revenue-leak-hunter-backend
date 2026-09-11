from django.contrib import admin
from .models import BlogPost


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "published",
        "featured",
        "published_at",
        "updated_at",
    )

    list_filter = (
        "published",
        "featured",
        "created_at",
    )

    search_fields = (
        "title",
        "excerpt",
        "content",
    )

    prepopulated_fields = {
        "slug": ("title",)
    }

    readonly_fields = (
        "created_at",
        "updated_at",
    )