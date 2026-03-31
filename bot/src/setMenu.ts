import { Bot } from "grammy";
import dotenv from "dotenv";

dotenv.config();

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

async function setup() {
  try {
    await bot.api.setChatMenuButton({
      menu_button: {
        type: "web_app",
        text: "🚀 Plataforma",
        web_app: { url: process.env.MINI_APP_URL! }
      }
    });
    console.log("Menu Button configured successfully!");
  } catch(e) {
    console.error("Error setting menu button", e);
  }
}

setup();
