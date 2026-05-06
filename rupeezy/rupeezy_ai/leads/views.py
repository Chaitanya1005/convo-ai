from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser

from .services.call_service import start_real_call
from .services.ai_agent import (
    run_ai_call,
    process_leads,
    PROCESS_STATUS
)

from .models import Lead, CallLog, UploadSession
from .serializers import LeadSerializer

from django.db.models import Count

import csv


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

        leads = Lead.objects.all()

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

    def get(self, request):

        sessions = UploadSession.objects.order_by("-created_at")

        session_data = []

        for session in sessions:

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

            session_data.append({

                "id": session.id,
                "name": session.name,
                "created_at": session.created_at,

                "total": total,
                "hot": hot,
                "warm": warm,
                "cold": cold,

                "avg_pqs": avg_pqs,

                "leads": [

                    {
                        "id": lead.id,
                        "name": lead.name,
                        "phone": lead.phone,
                        "email": lead.email,

                        "classification": lead.classification,
                        "pqs_score": lead.pqs_score,
                        "objection": lead.objection,
                        "summary": lead.summary,
                        "intent": lead.intent,
                        "conversation": lead.conversation,
                        "recommended_action": lead.recommended_action,
                        "processed_at": lead.processed_at,
                        "investment_range": lead.investment_range,
                        "processed": lead.processed
                    }

                    for lead in leads
                ]
            })

        return Response(session_data)