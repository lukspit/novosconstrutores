import { Bot, Context, InlineKeyboard } from "grammy";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Configurações
const token = process.env.TELEGRAM_BOT_TOKEN;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const miniAppUrl = process.env.MINI_APP_URL || "https://seu-miniapp-aqui.vercel.app";

if (!token || !supabaseUrl || !supabaseKey) {
  throw new Error("Variáveis de ambiente incompletas (.env)");
}

const bot = new Bot(token);
const supabase = createClient(supabaseUrl, supabaseKey);

// ==========================
// ONBOARDING FLOW
// ==========================

// 1. Comando /start - Pede a área de atuação
bot.command("start", async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text("📈 Mkt / Copy", "area_mkt")
    .text("⚙️ Automação (n8n)", "area_auto")
    .row()
    .text("💻 Tech / Dev", "area_tech")
    .text("🎨 Design / Vídeo", "area_design")
    .row()
    .text("💼 Gestão / Estratégia", "area_gestao");

  await ctx.reply(
    `Olá, ${ctx.from?.first_name} 👋🏽 Bem-vindo à <b>Novos Construtores</b>.\n\n` +
      `Para personalizarmos sua experiência, me conta: <b>Qual é a sua área principal no mercado?</b>`,
    {
      parse_mode: "HTML",
      reply_markup: keyboard,
    }
  );
});

// 2. Respondeu Área - Pede Nível de Experiência
// Regex pega tudo que começa com "area_"
bot.callbackQuery(/^area_(.+)$/, async (ctx) => {
  const area = ctx.match[1]; // trafego, conteudo, etc.
  
  // O callback data das próximas opções vai guardar a área escolhida + a experiência
  const keyboard = new InlineKeyboard()
    .text("🐣 Curioso (Uso básico)", `exp_cur_${area}`)
    .row()
    .text("🛠️ Integrador (Processos/Tarefas)", `exp_int_${area}`)
    .row()
    .text("🚀 Vibe Coder (Sistemas/Apps)", `exp_vib_${area}`);

  await ctx.editMessageText(
    `Bacana. E qual o seu <b>nível de experiência</b> construindo projetos com IAs (Claude, Cursor, etc)?`,
    {
      parse_mode: "HTML",
      reply_markup: keyboard,
    }
  );
  await ctx.answerCallbackQuery();
});

// 3. Respondeu Experiência - Salva no Supabase e finaliza
bot.callbackQuery(/^exp_(cur|int|vib)_(.+)$/, async (ctx) => {
  const nivelCode = ctx.match[1]; // cur, int, vib
  const areaCode = ctx.match[2]; // mkt, auto, etc.

  // Traduzindo os códigos pra salvar bonitinho no banco
  const niveis: Record<string, string> = { cur: "Curioso", int: "Integrador", vib: "Vibe Coder" };
  const areas: Record<string, string> = { mkt: "Marketing e Copy", auto: "Automação", tech: "Tecnologia", design: "Design e Áudio", gestao: "Gestão e Estratégia" };

  const nivel = niveis[nivelCode] || "Não informado";
  const area = areas[areaCode] || "Não informado";

  // Salvar/Atualizar no Supabase
  try {
    const { error } = await supabase
      .from("nc_users")
      .upsert({
        telegram_id: ctx.from.id,
        username: ctx.from.username || null,
        first_name: ctx.from.first_name,
        area_atuacao: area,
        experiencia_ia: nivel,
      });

    if (error) {
      console.error("Erro ao salvar no Supabase:", error);
    }
  } catch (err) {
    console.error("Falha no banco:", err);
  }

  // Gera o menu principal final
    const finalMenu = new InlineKeyboard()
      .url("📢 Canal Oficial", "https://t.me/construtoresdebrasil")
      .row()
      .url("💬 Acessar a Comunidade", "https://t.me/novosconstrutores");

  await ctx.editMessageText(
    `<b>Perfil salvo com sucesso.</b>\n\n` +
    `Sua área principal é ${area} e seu nível de experiência é ${nivel}. O tagueamento foi concluído.\n\n` +
    `Agora você faz parte da <b>Novos Construtores</b>!\n\n` +
    `📢 <b>Primeiro, entre no Canal Oficial</b> — lá ficam os conteúdos e atualizações mais importantes.\n` +
    `💬 Depois acesse a comunidade para trocar ideia com os outros membros.`,
    {
      parse_mode: "HTML",
      reply_markup: finalMenu,
    }
  );
  await ctx.answerCallbackQuery();
});

// ==========================
// REPOST AUTOMÁTICO DO CANAL
// ==========================
bot.on("channel_post", async (ctx) => {
  const channelId = String(ctx.channelPost.chat.id);
  const myChannelId = process.env.CHANNEL_ID;
  const groupId = process.env.GROUP_ID;

  if (channelId === myChannelId && groupId) {
    try {
      // O Tópico de "Notícias & Tendências" tem ID 12
      const topicId = 12; 
      const textPreview = ctx.channelPost.text 
        ? ctx.channelPost.text.substring(0, 50) + "..." 
        : "Nova atualização no canal.";

      await bot.api.sendMessage(
        groupId,
        `<b>Novo conteúdo no canal</b>\n\n<i>"${textPreview}"</i>\n\nVeja o post completo em @construtoresdebrasil`,
        { 
          message_thread_id: topicId,
          parse_mode: "HTML" 
        }
      );
    } catch (error) {
        console.error("Erro ao repostar mensagem do canal:", error);
    }
  }
});

bot.catch((err) => {
  console.error(`Erro no update ${err.ctx.update.update_id}:`, err.error);
});

// Comando para abrir o Mini App direto (TEMPORARIAMENTE DESATIVADO)
// bot.command("app", async (ctx) => {
//   const appMenu = new InlineKeyboard()
//     .webApp("Abrir Plataforma", miniAppUrl);
//   
//   await ctx.reply("Acesse nossa Plataforma Completa e Vibe Coding clicando no botão abaixo:", {
//     reply_markup: appMenu,
//   });
// });

// Inicialização
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  console.log("🚀 Bot da Novos Construtores iniciando em modo local (Polling)...");
  bot.start({
    onStart: (botInfo) => {
      console.log(`✅ Conectado com sucesso! @${botInfo.username} rodando com Supabase.`);
    }
  });
}

export default bot;
