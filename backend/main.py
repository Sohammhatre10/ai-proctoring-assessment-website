import os
import random
import requests
from dotenv import load_dotenv
from pymongo import MongoClient
from langchain_together import ChatTogether
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from langchain.prompts import PromptTemplate

load_dotenv()
TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")
MONGO_URI = os.getenv("MONGODB_URI")

client = MongoClient(MONGO_URI)
db = client["codeforces"]
collection = db["questions"]

class PartialProblemSchema(BaseModel):
    description: str
    test_cases: dict
    rating: int

llm = ChatTogether(
    model="meta-llama/Llama-3-70b-chat-hf",
    temperature=0.3,
    max_retries=2
).with_structured_output(schema=PartialProblemSchema)

prompt = PromptTemplate.from_template("""
You are given partial information about a competitive programming problem:

Title: {title}
Tags: {tags}
URL: {url}

Your task is to:
- Guess what the problem is about (description)
- Generate realistic sample input-output test cases (test_cases)
- Estimate the difficulty rating (rating between 800 and 3500)

Only return the fields: `description`, `test_cases`, and `rating`.
""")

def get_problems():
    url = "https://codeforces.com/api/problemset.problems"
    resp = requests.get(url)
    data = resp.json()
    return data["result"]["problems"]

def save_to_db(problem_json):
    collection.insert_one(problem_json)
    print(f"🟢 Saved to DB: {problem_json['question_name']}")

def process_problem(p):
    title = p["name"]

    if collection.find_one({"question_name": title}):
        print(f"🟡 Skipping (already in DB): {title}")
        return

    tags = p.get("tags", [])
    link = f"https://codeforces.com/problemset/problem/{p['contestId']}/{p['index']}"
    true_rating = p.get("rating", -1)

    print(f"\n🔍 Processing: {title} | {link}")

    try:
        chain = prompt | llm
        result = chain.invoke({
            "title": title,
            "tags": ", ".join(tags),
            "url": link
        })

        final_result = {
            "question_name": title,
            "description": result.description,
            "test_cases": result.test_cases,
            "rating": true_rating if true_rating != -1 else result.rating,
            "tags": tags,
            "link": link
        }

        save_to_db(final_result)
    except Exception as e:
        print(f"LLM failed: {e}")

def main():
    problems = get_problems()
    random.shuffle(problems)
    count = 0
    for p in problems:
        if "contestId" in p and "index" in p:
            if not collection.find_one({"question_name": p["name"]}):
                process_problem(p)
                count += 1
            if count >= 20:
                break

if __name__ == "__main__":
    main()
