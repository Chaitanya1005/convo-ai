from django.urls import path
from .views import (
    LeadListCreateView,
    StartCallView,
    ProcessLeadsView,
    RealCallView,
    UploadCSVView,
    ProgressView,
    DashboardView,
    SessionListView,
    ExportSessionCSVView,
    test_agent
)

urlpatterns = [
    path('leads/', LeadListCreateView.as_view()),
    path('start-call/', StartCallView.as_view()),
    path("upload-csv/", UploadCSVView.as_view()),
    path("process-leads/", ProcessLeadsView.as_view()),
    path("real-call/", RealCallView.as_view()),
    path("progress/", ProgressView.as_view()),
    path("dashboard/<int:session_id>/", DashboardView.as_view()),
    path("sessions/", SessionListView.as_view()),
    path(
    "dashboard/<int:session_id>/export/",
    ExportSessionCSVView.as_view()
),
path("test-agent/", test_agent),
]