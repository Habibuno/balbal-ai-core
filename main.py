from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import os

app = FastAPI()

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # autoriser tous les domaines (StackBlitz, etc.)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai.api_key = os.getenv("OPENAI_API_KEY")  # ta clé GPT-4

class Prompt(BaseModel):
    user_prompt: str

@app.post("/generate-structure")
async def generate_structure(prompt: Prompt):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {
                "role": "system",
                "content": "Tu es un architecte logiciel SaaS. À partir d’une idée, génère une structure complète : résumé, fonctionnalités principales, architecture, stack technique, API, base de données, auth."
            },
            {
                "role": "user",
                "content": prompt.user_prompt
            }
        ]
    )
    return {"result": response.choices[0].message.content}
