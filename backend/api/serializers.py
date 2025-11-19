from rest_framework import serializers
from .models import Category, Task

class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ['id', 'name']
        extra_kwargs = {
            "name": {"validators": []}  # désactive le UniqueValidator par défaut et permet de mettre un message d'erreur en français
        }

    def validate_name(self, value):
        if Category.objects.filter(name=value).exists():
            raise serializers.ValidationError("Une catégorie portant ce nom existe déjà.")
        return value


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'description', 'is_completed', 'created_at', 'category']