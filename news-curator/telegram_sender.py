import os
import asyncio
from datetime import datetime
import requests
import telegram
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
CHANNEL_ID = os.getenv("TELEGRAM_CHANNEL_ID")


def escape(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def shorten_url(url: str) -> str:
    try:
        resp = requests.get(
            "https://is.gd/create.php",
            params={"format": "simple", "url": url},
            timeout=5,
        )
        if resp.status_code == 200 and resp.text.startswith("https://is.gd/"):
            return resp.text.strip()
    except Exception:
        pass
    return url  # fallback: URL original


def format_message(items: list) -> str:
    hoje = datetime.now().strftime("%d/%m/%Y")

    lines = [
        f"<b>novidades de hoje · {hoje}</b>",
        "",
    ]

    for i, item in enumerate(items, 1):
        emoji = item.get("emoji", "").strip()
        prefix = f"{emoji} " if emoji else ""
        short_url = shorten_url(item["url"])

        lines.append(f"{prefix}<b>{escape(item['titulo'])}</b>")
        lines.append(escape(item["contexto"]))
        lines.append(f"<i>→ {escape(item['por_que_importa'])}</i>")
        lines.append(short_url)

        if i < len(items):
            lines.append("")
            lines.append("")

    lines += [
        "",
        "<i>discussão no grupo → @novosconstrutores</i>",
    ]

    return "\n".join(lines)


async def send_to_channel(message: str):
    bot = telegram.Bot(token=BOT_TOKEN)
    await bot.send_message(
        chat_id=CHANNEL_ID,
        text=message,
        parse_mode="HTML",
        disable_web_page_preview=True,
    )
    print("Mensagem enviada com sucesso!")


def send(items: list):
    message = format_message(items)
    print("\n--- PRÉVIA DA MENSAGEM ---")
    print(message)
    print("--- FIM DA PRÉVIA ---\n")
    asyncio.run(send_to_channel(message))
