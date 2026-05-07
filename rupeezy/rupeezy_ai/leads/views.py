from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
import csv
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse
from .services.call_service import start_real_call
from .services.ai_agent import (
    run_ai_call,
    process_leads,
    PROCESS_STATUS
)

from .models import Lead, CallLog, UploadSession
from .serializers import LeadSerializer

from django.db.models import Count

class ProgressView(APIView):

    def get(self, request):
        return Response(PROCESS_STATUS)


class RealCallView(APIView):

    def post(self, request):

        phone = request.data.get("phone")

        if not phone:
            return Response(
                {"error": "Phone number required"},
                status=400
            )

        result = start_real_call(phone)

        return Response({
            "status": "calling",
            "vapi_response": result
        })


class ProcessLeadsView(APIView):

    def post(self, request):

        latest_session = UploadSession.objects.order_by("-created_at").first()

        if not latest_session:
            return Response(
                {"error": "No upload session found"},
                status=400
            )

        leads = Lead.objects.filter(session=latest_session)

        results = process_leads(leads)
        hot = len([r for r in results if r["classification"] == "Hot"])
        warm = len([r for r in results if r["classification"] == "Warm"])
        cold = len([r for r in results if r["classification"] == "Cold"])

        avg_pqs = round(
            sum(r["pqs_score"] for r in results) / len(results),
            1
        )

        top_objection = max(
            [r["objection"] for r in results],
            key=lambda x: [r["objection"] for r in results].count(x)
        )
        return Response({
            "session_id": latest_session.id,
            "results": results,
            "analytics": {
                "total": len(results),
                "hot": hot,
                "warm": warm,
                "cold": cold,
                "avg_pqs": avg_pqs,
                "top_objection": top_objection
            }
        })


class LeadListCreateView(ListCreateAPIView):

    queryset = Lead.objects.all()
    serializer_class = LeadSerializer


class StartCallView(APIView):

    def post(self, request):

        lead_id = request.data.get("lead_id")

        lead = get_object_or_404(Lead, id=lead_id)

        ai_result = run_ai_call(lead)

        transcript_data = ai_result.get("transcript", [])
        summary = ai_result.get("summary", "")
        classification = ai_result.get("classification", "Cold")
        objections = ai_result.get("objections", [])

        if isinstance(transcript_data, list):

            transcript_text = "\n".join([
                f"{t.get('speaker', '')}: {t.get('message', '')}"
                for t in transcript_data
            ])

        else:
            transcript_text = str(transcript_data)

        CallLog.objects.create(
            lead=lead,
            transcript=transcript_text,
            summary=summary,
            classification=classification,
            objections=objections
        )

        return Response({
            "message": "Call completed",
            "data": {
                "transcript_text": transcript_text,
                "classification": classification,
                "summary": summary,
                "objections": objections
            }
        })


class UploadCSVView(APIView):

    parser_classes = [MultiPartParser]

    def post(self, request):

        file = request.FILES.get("file")

        if not file:
            return Response(
                {"error": "No file uploaded"},
                status=400
            )

        decoded_file = file.read().decode("utf-8").splitlines()

        reader = csv.DictReader(decoded_file)

        # DELETE OLD LEADS
        Lead.objects.all().delete()

        # CREATE NEW SESSION
        session = UploadSession.objects.create(
            name=file.name
        )

        count = 0

        for row in reader:

            name = row.get("name")
            phone = row.get("phone") or row.get("Phone")
            email = row.get("email")

            if not name or not phone:
                continue

            Lead.objects.create(
                session=session,
                name=name,
                phone=phone,
                email=email if email else "",
                source=row.get("source", ""),
                notes=row.get("notes", ""),
                investment_range=row.get("investment_range", "")
            )

            count += 1

        return Response({
            "message": "CSV uploaded successfully",
            "count": count
        })


class DashboardView(APIView):

    def get(self, request, session_id):

        session = get_object_or_404(
            UploadSession,
            id=session_id
        )

        leads = Lead.objects.filter(session=session)

        total = leads.count()

        hot = leads.filter(
            classification="Hot"
        ).count()

        warm = leads.filter(
            classification="Warm"
        ).count()

        cold = leads.filter(
            classification="Cold"
        ).count()

        avg_pqs = 0

        if total > 0:

            avg_pqs = round(
                sum([lead.pqs_score for lead in leads]) / total,
                1
            )

        return Response({

            "session": {
                "id": session.id,
                "name": session.name,
                "created_at": session.created_at,
            },

            "analytics": {
                "total": total,
                "hot": hot,
                "warm": warm,
                "cold": cold,
                "avg_pqs": avg_pqs
            },

"leads": [

    {
        "id": lead.id,
        "displayId": f"L{index:03}",
        "name": lead.name,
        "phone": lead.phone,
        "classification": lead.classification,
        "pqs_score": lead.pqs_score,
        "objection": lead.objection,
        "summary": lead.summary,
        "recommended_action": lead.recommended_action,
        "investment_range": lead.investment_range,
        "intent": lead.intent,
        "conversation": lead.conversation,
    }

    for index, lead in enumerate(leads, start=1)
]
        })
class ExportSessionCSVView(APIView):

    def get(self, request, session_id):

        session = UploadSession.objects.get(id=session_id)

        leads = Lead.objects.filter(session=session)

        response = HttpResponse(content_type='text/csv')

        response['Content-Disposition'] = (
            f'attachment; filename="{session.name}_report.csv"'
        )

        writer = csv.writer(response)

        writer.writerow([
            "Lead ID",
            "Name",
            "Phone",
            "Classification",
            "PQI",
            "Objection",
            "Intent",
            "Recommended Action"
        ])

        for i, lead in enumerate(leads, start=1):

            writer.writerow([
                f"L{i:03}",
                lead.name,
                lead.phone,
                lead.classification,
                lead.pqs_score,
                lead.objection,
                lead.intent,
                lead.recommended_action
            ])

        return response
class SessionListView(APIView):

    def get(self, request):

        sessions = UploadSession.objects.order_by(
            "-created_at"
        )

        data = [

            {
                "id": session.id,
                "name": session.name,
                "created_at": session.created_at,
                "lead_count": session.leads.count()
            }

            for session in sessions
        ]

        return Response(data)


@api_view(["POST"])
def test_agent(request):

    message = request.data.get("message", "").lower()

    reply = (
        "Thank you for your interest. Could you please tell me more about your onboarding requirements?"
    )

    if "brokerage" in message:

        reply = (
            "Rupeezy partners can receive up to 100% brokerage sharing along with dedicated RM support, faster onboarding workflows, and scalable client management assistance."
        )

    elif "hindi" in message:

        reply = (
            "Bilkul. Rupeezy partner program mein aapko zero joining fee, dedicated RM support, aur attractive brokerage structure milta hai."
        )

    elif "family" in message:

        reply = (
            "Understood. Aap family se discuss kar lijiye. Main aapko onboarding benefits aur brokerage details WhatsApp par bhi share kar sakta hoon."
        )

    elif "document" in message:

        reply = (
            "Generally PAN card, Aadhaar card, bank proof, and basic KYC documents are required for onboarding."
        )

    elif "onboarding" in message:

        reply = (
            "The onboarding process is fully digital and typically completed within a few working hours after document verification."
        )

    elif "benefits" in message:

        reply = (
            "Rupeezy partners receive brokerage sharing, onboarding assistance, client management support, faster payouts, and dedicated RM guidance."
        )

    return Response({
        "reply": reply
    })
