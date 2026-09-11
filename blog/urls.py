from django.urls import path

from .views import (
    blog_posts,
    blog_post_detail,
)


urlpatterns = [

    path(
        "",
        blog_posts,
        name="blog_posts"
    ),

    path(
        "<slug:slug>/",
        blog_post_detail,
        name="blog_post_detail"
    ),

]