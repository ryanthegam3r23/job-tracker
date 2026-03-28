from rest_framework import viewsets
from .models import JobApplication
from .serializers import JobApplicationSerializer

class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all()   # ✅ REQUIRED (you were missing this)
    serializer_class = JobApplicationSerializer









