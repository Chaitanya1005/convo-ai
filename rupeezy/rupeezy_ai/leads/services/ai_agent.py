import os
import json
import re
import time
from openai import OpenAI
import random 

PROCESS_STATUS = {
    "processed": 0,
    "total": 0,
    "running": False
}

def process_leads(leads):
    results = []

    PROCESS_STATUS["processed"] = 0
    PROCESS_STATUS["total"] = len(leads)
    PROCESS_STATUS["running"] = True

    objections = [
        "Market is too risky right now",
        "I already have a broker",
        "Will think about it later",
        "Need to discuss with family",
        "Not interested currently"
    ]

    intents = [
        "SIP Investment",
        "IPO Access",
        "Mutual Funds",
        "Wealth Management"
    ]

    for index, lead in enumerate(leads):

        time.sleep(1)

        classification = random.choice(["Hot", "Warm", "Cold"])
        objection = random.choice(objections)
        intent = random.choice(intents)

        conversation = [
            {
                "sender": "AI",
                "message": f"Hi {lead.name}, I am calling from Rupeezy regarding your investment interest."
            },
            {
                "sender": "USER",
                "message": objection
            },
            {
                "sender": "AI",
                "message": "Understood. Let me explain how Rupeezy can help you invest safely."
            }
        ]

        result = {
            "id": lead.id,
            "name": lead.name,
            "phone": lead.phone,
            "email": lead.email,

            "classification": classification,
            "intent": intent,
            "objection": objection,

            "summary": f"{lead.name} showed {classification.lower()} interest in {intent}.",

            "pqs_score": random.randint(1, 10),

            "recommendedAction": (
                "Immediate RM follow-up"
                if classification == "Hot"
                else "Send educational content"
            ),

            "conversation": conversation
        }

        results.append(result)

        PROCESS_STATUS["processed"] = index + 1

        print(f"Processed {index+1}/{len(leads)}")

    PROCESS_STATUS["running"] = False

    return results


OBJECTIONS = [
    "already with broker",
    "no clients",
    "trust issue",
    "support issue",
    "call later"
]

def run_ai_call(lead):

    classification = random.choice(["Hot", "Warm", "Cold"])

    objection = random.choice([
        "Market is too risky right now",
        "I already have a broker",
        "Need to discuss with family"
    ])

    conversation = [
        {
            "sender": "AI",
            "message": f"Hi {lead.name}, I am calling from Rupeezy regarding your investment interest."
        },
        {
            "sender": "USER",
            "message": objection
        },
        {
            "sender": "AI",
            "message": "Understood. Let me explain how Rupeezy can help you invest safely."
        }
    ]

    return {
        "transcript": conversation,
        "summary": f"{lead.name} is a {classification} lead.",
        "classification": classification,
        "objections": [objection]
    }