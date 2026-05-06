import os
import json
import time
import re
from django.utils import timezone
from openai import OpenAI
from dotenv import load_dotenv
from groq import Groq
import os
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

    prompt = f"""
You are an AI Relationship Manager from Rupeezy for onboarding AP partners.

Talk like a REAL Indian RM.
Use natural Hinglish.
Do NOT sound robotic.

Your goals:
- Simulate a real AP partner onboarding sales call
- Explain Rupeezy's partner program naturally
- Handle objections conversationally
- Qualify whether the lead can become a Rupeezy partner
- Classify lead as Hot, Warm, or Cold
- Generate a short summary
- Give a Partner Quality Score (PQS) from 1-10

Possible objections:
- Market risky hai
- Already using another broker
- Family se discuss karna hai
- Call later
- Not interested
Program Benefits:
- Zero joining fee
- 100% brokerage share
- Daily payouts via RISE portal
- Full backend support
- Rupeezy handles operations and support

Lead Details:
Name: {lead.name}
Phone: {lead.phone}
Email: {lead.email}
Investment Range: {lead.investment_range}

Return ONLY valid JSON.

Format:
{{
    "classification": "Hot/Warm/Cold",
    "intent": "Investment intent",
    "objection": "Main objection",
    "summary": "Short summary",
    "pqs_score": 7,
    "recommendedAction": "Suggested RM action",
    "conversation": [
        {{
            "sender": "USER",
            "message": "..."
        }},
        {{
            "sender": "AI",
            "message": "..."
        }},
        {{
            "sender": "USER",
            "message": "..."
        }},
        {{
            "sender": "AI",
            "message": "..."
        }}
    ]
}}

IMPORTANT:
- Responses should feel like real Indian conversations.
- Mix Hindi and English naturally.
- Keep replies concise.
- Sound persuasive but human.
- DO NOT include markdown.
- DO NOT include ```json blocks.
- ONLY return raw JSON.
- Keep every message under 25 words.
- Sound like an Indian sales caller, not a financial advisor article.
- Avoid long explanations.
- Use casual Indian phrasing.
- Sometimes classify as Hot or Cold realistically.
- Hot leads should sound excited.
- Cold leads should resist strongly.
- Never ask dumb or awkward questions.
- Speak professionally like a trained Indian relationship manager.
- Never ask "aapke paas paise hai?"
- Use natural financial sales language.
- Sound confident and concise.
- USER is always the customer.
- AI is always the Rupeezy RM.
- Never switch identities.
- Cold leads should strongly resist or reject.
- Warm leads show curiosity but hesitation.
- Hot leads actively ask investment questions.
- Maintain conversation consistency.
- Every reply must sound like a WhatsApp/chat sales conversation.
- Maximum 2 short sentences per message.
- Avoid formal financial jargon.
- Sound conversational and direct.
- Do not use overly dramatic Hindi.
- Avoid phrases like "shubhkaamnayein".
- Speak modern urban Indian Hinglish.
- Sound like a startup RM, not a TV serial character.
- Cold users should sometimes refuse politely or ask not to continue.
- Do not make every lead cooperative.
- At least 4-6 total conversation messages.
- Hot leads should be rare.
- Most leads should become Warm.
- Cold leads should resist clearly.
- RM opening should sound confident and contextual.
- Conversations must feel realistic and continuous.
- Customer responses should vary in personality.
- Avoid generic greetings.
- Customers should have different personalities:
  - busy
  - curious
  - skeptical
  - confident
  - confused
- Leads are potential AP partners, not retail investors.
- AI should pitch Rupeezy partnership benefits.
- AI can ask about existing clients or finance business experience.
- Hot leads should ask onboarding or earning related questions.
- Warm leads should hesitate but stay interested.
- Cold leads should reject partnership opportunity clearly.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.8
    )

    raw_output = response.choices[0].message.content

    try:

        cleaned = raw_output.strip()

        # Remove markdown wrappers if model adds them
        cleaned = cleaned.replace("```json", "")
        cleaned = cleaned.replace("```", "")
        cleaned = cleaned.strip()

        # Extract JSON safely
        match = re.search(r"\{.*\}", cleaned, re.DOTALL)

        if not match:
            raise Exception("No valid JSON found")

        json_text = match.group()

        parsed = json.loads(json_text)

        # SAFETY FALLBACKS
        parsed.setdefault("classification", "Warm")
        parsed.setdefault("intent", "Investment Discussion")
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
            "intent": "Investment Discussion",
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
        ai_pqs = ai_result.get("pqs_score", 5)
        score += int(ai_pqs / 2)

        investment_text = str(lead.investment_range).lower()
        intent_text = ai_result.get("intent", "").lower()
        objection_text = ai_result.get("objection", "").lower()
        conversation = ai_result.get("conversation", [])
        conversation_text = " ".join(
            [msg.get("message", "").lower() for msg in conversation]
        )
        # Strong buying intent
        if "how" in conversation_text:
            score += 1

        if "returns" in conversation_text:
            score += 1

        if "mutual fund" in conversation_text:
            score += 1

        if "sip" in conversation_text:
            score += 1

        if "invest" in conversation_text:
            score += 1

        # Hesitation signals
        if "not sure" in conversation_text:
            score -= 1

        if "call later" in conversation_text:
            score -= 2

        if "family" in conversation_text:
            score -= 1

        if "risky" in conversation_text:
            score -= 1
        # Investment range scoring
        if "2 lakh" in investment_text or "200000" in investment_text:
            score += 4
        elif "1 lakh" in investment_text or "100000" in investment_text:
            score += 3
        elif "50000" in investment_text:
            score += 2

        # Intent scoring
        if "ready" in intent_text or "invest" in intent_text:
            score += 2

        # Objection penalty
        if "not interested" in objection_text:
            score -= 4

        if "call later" in objection_text:
            score -= 2

        if "family" in objection_text:
            score -= 1

        # Final classification
        # Final classification
        if score >= 8:
            final_classification = "Hot"
        elif score >= 4:
            final_classification = "Warm"
        else:
            final_classification = "Cold"
        lead.classification = final_classification
        lead.intent = ai_result.get("intent", "Investment Discussion")
        lead.objection = ai_result.get("objection", "Needs follow-up")
        lead.summary = ai_result.get("summary", "")
        lead.pqs_score = ai_result.get("pqs_score", 5)
        lead.recommended_action = ai_result.get(
            "recommendedAction",
            "RM follow-up required"
        )
        lead.conversation = ai_result.get("conversation", [])
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
            "pqs_score": ai_result.get("pqs_score", 5),
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