import os
from dotenv import load_dotenv
from openai import OpenAI
from sentence_transformers import SentenceTransformer
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import psycopg2
import json

# Орчны хувьсагчийг ачаалах
load_dotenv()
API_KEY = os.getenv("OPENAI_API_KEY")

if not API_KEY:
    raise ValueError("API түлхүүр олдсонгүй. .env файлд OPENAI_API_KEY тохируулагдсан эсэхийг шалгана уу.")

OpenAI.api_key = API_KEY

# Загваруудын тохиргоо
embedding_model = SentenceTransformer("nomic-ai/nomic-embed-text-v1.5")
tokenizer = AutoTokenizer.from_pretrained("facebook/opt-350m")

offload_folder = r"C:\\Users\\abuyn\\offload"
model = AutoModelForCausalLM.from_pretrained(
    r"C:\\Users\\abuyn\\.cache\\huggingface\\hub\\models--facebook--opt-350m\\snapshots\\08ab08cc4b72ff5593870b5d527cf4230323703c",
    torch_dtype=torch.float16,
    device_map="auto",
    offload_folder=offload_folder,
)

# Өгөгдлийн сантай холбогдох
conn = psycopg2.connect(
    dbname="odoo_db",
    user="odoo18",
    password="odoo",
    host="localhost",
    port="5432"
)
cursor = conn.cursor()


# 📌 **Хамгийн их борлуулалттай бүтээгдэхүүн авах**
def get_sales_data():
    cursor.execute("""
        SELECT product_name, SUM(amount) AS total_sales
        FROM sales
        GROUP BY product_name
        ORDER BY total_sales DESC
        LIMIT 10;
    """)
    rows = cursor.fetchall()
    return [{"product_name": row[0], "total_sales": row[1]} for row in rows]


# 📌 **Хамгийн хямд бүтээгдэхүүн авах**
def get_cheapest_product():
    try:
        cursor.execute("""
            SELECT product_name, price
            FROM product_sales
            ORDER BY price ASC
            LIMIT 1;
        """)
        row = cursor.fetchone()
        if row:
            return f"Хамгийн хямд бүтээгдэхүүн: '{row[0]}' нь ${row[1]:.2f}-ийн үнэтэй."
        else:
            return "Бүтээгдэхүүний мэдээлэл олдсонгүй."
    except Exception as e:
        print(f"Алдаа: {e}")
        return "Хамгийн хямд бүтээгдэхүүний мэдээллийг авахад алдаа гарлаа."


# 📌 **Санхүүгийн тайлан гаргах**
def get_financial_report():
    try:
        cursor.execute("""
            SELECT product_name, SUM(quantity) AS total_sold, SUM(quantity * price) AS total_revenue
            FROM product_sales
            GROUP BY product_name
            ORDER BY total_revenue DESC;
        """)
        rows = cursor.fetchall()Санхүүгийн бүх тайланг гаргаж өгөөч.

        if not rows:
            return "Борлуулалтын мэдээлэл олдсонгүй."

        report = "📊 **Санхүүгийн тайлан** 📊\n"
        total_earnings = 0

        for row in rows:
            product_name, total_sold, total_revenue = row
            total_earnings += total_revenue
            report += f"- {product_name}: {total_sold} ширхэг, нийт үнэ: ${total_revenue:.2f}\n"

        report += f"\n💰 **Нийт орлого:** ${total_earnings:.2f}"
        return report

    except Exception as e:
        print(f"Алдаа гарлаа: {e}")
        return "Санхүүгийн тайлан гаргахад алдаа гарлаа."


# 📌 **Өгөгдлийн сангийн асуултуудыг ойлгох**
def analyze_context(sentence):
    topics = "Бусад"
    summary = ""
    sentence = sentence.lower()

    if any(keyword in sentence for keyword in ["хамгийн их борлуулалт", "шилдэг бүтээгдэхүүн"]):
        sales_data = get_sales_data()
        summary = "Хамгийн их борлуулалттай бүтээгдэхүүнүүд:\n" + "\n".join(
            [f"{product['product_name']} - ${product['total_sales']:.2f}" for product in sales_data])
        topics = "Борлуулалт"
    elif "хамгийн хямд" in sentence:
        summary = get_cheapest_product()
        topics = "Бүтээгдэхүүн"
    elif "санхүүгийн бүх тайлан" in sentence:
        summary = get_financial_report()
        topics = "Санхүү"
    else:
        summary = "Тохирох мэдээлэл олдсонгүй."

    cursor.execute("INSERT INTO context_analysis (sentence, topics) VALUES (%s, %s)", (sentence, topics))
    conn.commit()

    return {"summary": summary}


# 📌 **Чат ботын үндсэн функц**
def interactive_conversation():
    print("Сайн байна уу! Танд юугаар туслах вэ? ('гарах' гэж бичиж дуусгана уу.)")
    while True:
        user_input = input("Та: ").strip()
        if user_input.lower() == 'гарах':
            print("Баяртай!")
            break
        result = analyze_context(user_input)
        print(f"Бот: {result['summary']}")


# Програмыг ажиллуулах
if __name__ == "__main__":
    interactive_conversation()

cursor.close()
conn.close()
