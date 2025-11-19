from django.contrib import admin
from django.urls import path
from api import views

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/categories/', views.categories),
    path('api/tasks/', views.tasks),
    path('api/tasks/<int:pk>/', views.task_detail),
]