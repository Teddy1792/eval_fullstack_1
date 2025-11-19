from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Category, Task
from .serializers import CategorySerializer, TaskSerializer

@api_view(['GET', 'POST'])
def categories(request):
    if request.method == 'GET':
        cats = Category.objects.all()
        return Response(CategorySerializer(cats, many=True).data)

    if request.method == 'POST':
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=400)


@api_view(['GET', 'POST'])
def tasks(request):
    if request.method == 'GET':
        category_id = request.GET.get("category_id")
        qs = Task.objects.all()
        if category_id:
            qs = qs.filter(category_id=category_id)

        return Response(TaskSerializer(qs, many=True).data)

    if request.method == 'POST':
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(['PATCH', 'DELETE'])
def task_detail(request, pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    if request.method == 'PATCH':
        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    if request.method == 'DELETE':
        task.delete()
        return Response(status=204)