from django.db import models


class UploadSession(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Lead(models.Model):
    session = models.ForeignKey(
        UploadSession,
        on_delete=models.CASCADE,
        related_name="leads"
    )

    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    name = models.CharField(max_length=255)

    source = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    investment_range = models.CharField(max_length=100, blank=True, null=True)

    classification = models.CharField(
        max_length=20,
        default="Unprocessed"
    )

    pqs_score = models.IntegerField(default=0)

    objection = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    summary = models.TextField(blank=True, null=True)
    intent = models.CharField(
    max_length=255,
    blank=True,
    null=True
    )

    recommended_action = models.TextField(
        blank=True,
        null=True
    )

    conversation = models.JSONField(
        default=list,
        blank=True
    )

    processed_at = models.DateTimeField(
        blank=True,
        null=True
    )

    processed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class CallLog(models.Model):
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE)

    transcript = models.TextField()

    summary = models.TextField(blank=True)

    classification = models.CharField(max_length=20)

    objections = models.JSONField(default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)