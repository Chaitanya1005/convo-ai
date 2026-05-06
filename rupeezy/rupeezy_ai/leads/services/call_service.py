import requests

VAPI_API_KEY = "e750f2c7-02ad-49d1-ba32-3ca816b63f35"
ASSISTANT_ID = "aaaa40b4-ce42-4eec-b471-311920a86251"


def start_real_call(phone_number):
    url = "https://api.vapi.ai/call"

    payload = {
    "assistantId": ASSISTANT_ID,
    "phoneNumberId": "04bf8310-4905-4225-8d6e-6d6066fa0701",   # 🔥 ADD THIS
    "customer": {
        "number": phone_number
    }
}

    headers = {
        "Authorization": f"Bearer {VAPI_API_KEY}",
        "Content-Type": "application/json"
    }

    response = requests.post(url, json=payload, headers=headers)

    return response.json()