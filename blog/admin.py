from django import forms
from django.contrib import admin
import json

from .models import BlogPost


class BlogPostAdminForm(forms.ModelForm):
    blocks = forms.CharField(
        required=False,
        widget=forms.HiddenInput()
    )

    class Meta:
        model = BlogPost
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        if not self.is_bound:

            blocks = self.instance.blocks

            if not blocks and self.instance.content:
                blocks = self.legacy_content_to_blocks(
                    self.instance.content
                )

            self.initial["blocks"] = json.dumps(
                blocks or []
            )

    @staticmethod
    def legacy_content_to_blocks(content):
        paragraphs = (
            content
            .split("\n\n")
        )

        return [
            {
                "type": "paragraph",
                "text": paragraph.strip()
            }
            for paragraph in paragraphs
            if paragraph.strip()
        ]

    def clean_blocks(self):
        value = self.cleaned_data.get("blocks")

        if not value:
            return []

        try:
            blocks = json.loads(value)
        except (TypeError, json.JSONDecodeError):
            raise forms.ValidationError(
                "Invalid blog block data."
            )

        if not isinstance(blocks, list):
            raise forms.ValidationError(
                "Blog blocks must be a list."
            )

        return blocks


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):

    form = BlogPostAdminForm

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

    fieldsets = (
        (
            "Article Information",
            {
                "fields": (
                    "title",
                    "slug",
                    "excerpt",
                    "featured_image",
                )
            }
        ),
        (
            "Publishing",
            {
                "fields": (
                    "published",
                    "featured",
                    "published_at",
                )
            }
        ),
        (
            "Article Content",
            {
                "fields": (
                    "blocks",
                    "content",
                )
            }
        ),
        (
            "System Information",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                )
            }
        ),
    )