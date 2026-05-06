from django.shortcuts import render, get_object_or_404
from rest_framework.generics import ListCreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from .services.call_service import start_real_call
from .models import Lead, CallLog, UploadSession
from django.db.models import Count
from .serializers import LeadSerializer
from .services.ai_agent import run_ai_call
from .services.ai_agent import process_leads
from .services.ai_agent import PROCESS_STATUS

class ProgressView(APIView):
    def get(self, request):
        return Response(PROCESS_STATUS)
    
class RealCallView(APIView):
    def post(self, request):
        phone = request.data.get("phone")

        if not phone:
            return Response({"error": "Phone number required"}, status=400)

        result = start_real_call(phone)

        return Response({
            "status": "calling",
            "vapi_response": result
        })

class ProcessLeadsView(APIView):
    def post(self, request):
        leads = Lead.objects.all()

        results = process_leads(leads)

        return Response({
            "total": len(results),
            "results": results
        })

class LeadListCreateView(ListCreateAPIView):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer


class StartCallView(APIView):
    def post(self, request):
        lead_id = request.data.get("lead_id")

        lead = get_object_or_404(Lead, id=lead_id)

        ai_result = run_ai_call(lead)

        # ✅ SAFE DATA EXTRACTION
        transcript_data = ai_result.get("transcript", [])
        summary = ai_result.get("summary", "")
        classification = ai_result.get("classification", "Cold")
        objections = ai_result.get("objections", [])

        # ✅ CONVERT TRANSCRIPT LIST → STRING
        if isinstance(transcript_data, list):
            transcript_text = "\n".join([
                f"{t.get('speaker', '')}: {t.get('message', '')}"
                for t in transcript_data
            ])
        else:
            transcript_text = str(transcript_data)

        # ✅ SAVE TO DB
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
        
import csv
from rest_framework.parsers import MultiPartParser

class UploadCSVView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        file = request.FILES.get("file")

        if not file:
            return Response({"error": "No file uploaded"}, status=400)

        decoded_file = file.read().decode("utf-8").splitlines()
        reader = csv.DictReader(decoded_file)

        session = UploadSession.objects.create(
            name=file.name
        )
        for row in reader:
            name = row.get("name")
            phone = row.get("phone") or row.get("Phone")
            email = row.get("email")

            # 🔥 STRICT VALIDATION
            if not name or not phone or not email:
                continue  # skip bad rows

            lead = Lead.objects.create(
                session=session,
                name=name,
                phone=phone,
                email=email,
                source=row.get("source", ""),
                notes=row.get("notes", ""),
                investment_range=row.get("investment_range", ""),
            )
            created.append(lead.id)

        return Response({
            "message": "CSV uploaded successfully",
            "count": len(created)
        })
class DashboardView(APIView):

    def get(self, request):

        sessions = UploadSession.objects.order_by("-created_at")

        session_data = []

        for session in sessions:

            leads = Lead.objects.filter(session=session)

            total = leads.count()

            hot = leads.filter(classification="Hot").count()

            warm = leads.filter(classification="Warm").count()

            cold = leads.filter(classification="Cold").count()

            avg_pqs = 0

            if total > 0:
                avg_pqs = round(
                    sum([l.pqs_score for l in leads]) / total,
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
                        "investment_range": lead.investment_range,
                        "processed": lead.processed,
                    }
                    for lead in leads
                ]
            })

        return Response(session_data)