from django.urls import path
from .views import (
    LeadListCreateView,
    StartCallView,
    ProcessLeadsView,
    RealCallView,
    UploadCSVView,
    ProgressView,
    DashboardView
)

urlpatterns = [
    path('leads/', LeadListCreateView.as_view()),
    path('start-call/', StartCallView.as_view()),
    path("upload-csv/", UploadCSVView.as_view()),
    path("process-leads/", ProcessLeadsView.as_view()),
    path("real-call/", RealCallView.as_view()),
    path("progress/", ProgressView.as_view()),
    path("dashboard/", DashboardView.as_view()),
]