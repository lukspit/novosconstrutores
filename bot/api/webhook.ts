import { webhookCallback } from "grammy";
import bot from "../src/index.js";

// Vercel Serverless Function configuration
export const config = {
  maxDuration: 60, // Aumenta timeout para 60 segundos
};

export default webhookCallback(bot, "http");
