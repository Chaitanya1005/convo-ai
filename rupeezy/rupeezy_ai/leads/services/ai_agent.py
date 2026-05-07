import os
import json
import time
import re
import random
from django.utils import timezone
from openai import OpenAI
from dotenv import load_dotenv
from groq import Groq
import os
from ..prompts import SYSTEM_PROMPT
load_dotenv()

client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.getenv("GROQ_API_KEY")
)

PROCESS_STATUS = {
    "processed": 0,
    "total": 0,
    "running": False
}


def generate_ai_response(lead):

    prompt = """
Generate a realistic AP partner sales conversation.

LEAD DETAILS:
Name: {lead.name}
Phone: {lead.phone}
Email: {lead.email}
Investment Range: {lead.investment_range}

IMPORTANT:

- Generate realistic conversation.
- Use multilingual replies naturally.
- Simulate real sales flow.
- Include objections naturally.
- Keep responses concise.
- User and AI identities must remain consistent.

RETURN ONLY VALID JSON.
- Conversation must evolve naturally.
- AI should qualify the lead gradually.
- Include realistic hesitation and persuasion.
FORMAT:
{
    "classification": "Hot/Warm/Cold",
    "intent": "Lead intent",
    "objection": "Primary objection",
    "summary": "Short RM summary",
    "pqs_score": 7,
    "recommendedAction": "Next action",

    "call_duration": "4m 12s",
    "language": "Hindi/English/Hinglish",

    "handoff": {
        "type": "RM_TRANSFER/WHATSAPP/NURTURE",
        "priority": "HIGH/MEDIUM/LOW"
    },

    "conversation": [
        {
            "sender": "AI",
            "message": "..."
        },
        {
            "sender": "USER",
            "message": "..."
        }
    ]
}
Possible lead personalities:
- skeptical
- busy
- curious
- experienced trader
- confused beginner
- aggressive
- highly interested
- passive listener
"""

    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT
        },
        {
            "role": "user",
            "content": prompt
        }
    ]

    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=messages,
        temperature=0.8
    )

    raw_output = response.choices[0].message.content

    try:

        cleaned = raw_output.strip()

        # Remove markdown wrappers if model adds them
        cleaned = cleaned.replace("```json", "")
        cleaned = cleaned.replace("```", "")
        cleaned = cleaned.strip()

        start = cleaned.find("{")
        end = cleaned.rfind("}") + 1

        if start == -1 or end == -1:
            raise Exception("No valid JSON found")

        json_text = cleaned[start:end]

        parsed = json.loads(json_text)

        # SAFETY FALLBACKS
        parsed.setdefault("classification", "Warm")
        parsed.setdefault("intent", "AP Partnership Interest")
        parsed.setdefault("objection", "Needs follow-up")
        parsed.setdefault("summary", "Lead interacted with RM.")
        parsed.setdefault("pqs_score", 5)
        parsed.setdefault("recommendedAction", "RM follow-up")
        parsed.setdefault("conversation", [])

        return parsed

    except Exception as e:

        print("JSON PARSE ERROR:", e)
        print("RAW OUTPUT:")
        print(raw_output)

        return {
            "classification": "Warm",
            "intent": "AP Partnership Interest",
            "objection": "Needs follow-up",
            "summary": "Lead showed moderate interest.",
            "pqs_score": 5,
            "recommendedAction": "RM follow-up required",
            "conversation": [
                {
                    "sender": "USER",
                    "message": "Mujhe thoda aur details chahiye."
                },
                {
                    "sender": "AI",
                    "message": "Sure sir, RM aapse shortly connect karega."
                }
            ]
        }


def process_leads(leads):

    results = []

    PROCESS_STATUS["processed"] = 0
    PROCESS_STATUS["total"] = len(leads)
    PROCESS_STATUS["running"] = True

    for index, lead in enumerate(leads):

        ai_result = generate_ai_response(lead)
        score = 0
        investment_text = str(lead.investment_range).lower()
        intent_text = ai_result.get("intent", "").lower()
        objection_text = ai_result.get("objection", "").lower()
        conversation = ai_result.get("conversation", [])
        conversation_text = " ".join(
            [msg.get("message", "").lower() for msg in conversation]
        )
        # POSITIVE AP SIGNALS

        if any(word in conversation_text for word in [
            "clients",
            "sub broker",
            "ap",
            "authorised person",
            "finance",
            "trading community",
            "network"
        ]):
            score += 3

        if any(word in conversation_text for word in [
            "brokerage",
            "payout",
            "commission",
            "earnings",
            "income"
        ]):
            score += 2

        if any(word in conversation_text for word in [
            "how to join",
            "onboarding",
            "registration",
            "process",
            "start"
        ]):
            score += 3

        if any(word in conversation_text for word in [
            "support",
            "backend support",
            "client handling"
        ]):
            score += 1

        # NEGATIVE SIGNALS

        if any(word in conversation_text for word in [
            "not interested",
            "don't want",
            "busy",
            "stop calling"
        ]):
            score -= 4

        if any(word in conversation_text for word in [
            "call later",
            "family",
            "think about it",
            "not sure"
        ]):
            score -= 2

        if any(word in conversation_text for word in [
            "already using another broker",
            "happy with current broker"
        ]):
            score -= 1

        if "risky" in conversation_text:
            score -= 1

        # AP onboarding readiness

        if any(word in intent_text for word in [
            "interested",
            "ready",
            "onboarding",
            "partnership",
            "join"
        ]):
            score += 2

        # Objection penalty
        if "not interested" in objection_text:
            score -= 4

        if "call later" in objection_text:
            score -= 2

        if "family" in objection_text:
            score -= 1


        # Final classification
        if score >= 8:
            final_classification = "Hot"
        elif score >= 5:
            final_classification = "Warm"
        else:
            final_classification = "Cold"
        model_classification = ai_result.get("classification", "Warm")
        # REALISTIC PQS CALCULATION

        if final_classification == "Hot":
            pqs_score = random.randint(8, 10)

        elif final_classification == "Warm":
            pqs_score = random.randint(5, 7)

        else:
            pqs_score = random.randint(2, 4)
        if model_classification == "Hot":
            score += 3

        elif model_classification == "Warm":
            score += 1

        elif model_classification == "Cold":
            score -= 2
        lead.classification = final_classification
        lead.intent = ai_result.get("intent", "Investment Discussion")
        lead.objection = ai_result.get("objection", "Needs follow-up")
        lead.summary = ai_result.get("summary", "")
        lead.pqs_score = pqs_score
        lead.recommended_action = ai_result.get(
            "recommendedAction",
            "RM follow-up required"
        )
        lead.conversation = ai_result.get("conversation", [])
        lead.call_duration = ai_result.get("call_duration", "2m 10s")
        lead.language = ai_result.get("language", "Hinglish")
        lead.handoff = ai_result.get("handoff", {})
        lead.processed = True
        lead.processed_at = timezone.now()
        lead.save()    
        result = {
            "id": lead.id,
            "name": lead.name,
            "phone": lead.phone,
            "email": lead.email,
            "lead_score": score,
            "classification": final_classification,
            "intent": ai_result.get("intent", "Investment Discussion"),
            "objection": ai_result.get("objection", "Needs follow-up"),
            "summary": ai_result.get("summary", ""),
            "pqs_score": pqs_score,
            "recommendedAction": ai_result.get(
                "recommendedAction",
                "RM follow-up required"
            ),
            "conversation": ai_result.get("conversation", [])
        }

        results.append(result)

        PROCESS_STATUS["processed"] = index + 1

        print(f"Processed {index+1}/{len(leads)}")

        time.sleep(1)

    PROCESS_STATUS["running"] = False

    return results


def run_ai_call(lead):
    return generate_ai_response(lead)
def chat_with_agent(user_message, history):

    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT
        }
    ]

    # STRICT HISTORY BUILDING
    for msg in history:

        role = msg.get("role", "user")

        if role not in ["user", "assistant"]:
            role = "user"

        messages.append({
            "role": role,
            "content": msg.get("content", "")
        })

    # ADD LATEST USER MESSAGE
    messages.append({
        "role": "user",
        "content": user_message
    })

    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=messages,
        temperature=0.6,
        max_tokens=300
    )

    ai_reply = response.choices[0].message.content.strip()

    return ai_reply