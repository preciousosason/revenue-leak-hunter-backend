from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from .models import BlogPost


def legacy_content_to_blocks(content):
    """
    Convert an old article's plain-text content
    into paragraph blocks.

    This keeps existing articles working while
    newer articles use the block editor.
    """

    if not content:
        return []

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


def get_post_blocks(post):
    """
    Return the block-based content.

    New articles use `blocks`.
    Older articles fall back to `content`.
    """

    if post.blocks:
        return post.blocks

    return legacy_content_to_blocks(
        post.content
    )


def serialize_post(
    post,
    include_blocks=False
):
    data = {
        "title": post.title,
        "slug": post.slug,
        "excerpt": post.excerpt,
        "content": post.content,
        "featured_image": post.featured_image,
        "featured": post.featured,
        "published_at": (
            post.published_at.isoformat()
            if post.published_at
            else None
        ),
    }

    if include_blocks:
        data["blocks"] = get_post_blocks(
            post
        )

    return data


def blog_posts(request):

    posts = BlogPost.objects.filter(
        published=True
    ).order_by(
        "-published_at",
        "-created_at"
    )

    data = [
        serialize_post(post)
        for post in posts
    ]

    return JsonResponse({
        "posts": data
    })


def blog_post_detail(
    request,
    slug
):

    post = get_object_or_404(
        BlogPost,
        slug=slug,
        published=True
    )

    return JsonResponse({
        "post": serialize_post(
            post,
            include_blocks=True
        )
    })