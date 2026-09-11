from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from .models import BlogPost


def serialize_post(post):
    return {
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


def blog_post_detail(request, slug):

    post = get_object_or_404(
        BlogPost,
        slug=slug,
        published=True
    )

    return JsonResponse({
        "post": serialize_post(post)
    })