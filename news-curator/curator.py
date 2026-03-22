import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

MODEL = "deepseek/deepseek-chat"

SYSTEM_PROMPT = """Você é o curador-chefe de conteúdo da comunidade "Novos Construtores - Vibe Coding".

Nossa comunidade é formada por pessoas do mercado digital brasileiro (empreendedores, criadores de conteúdo, gestores de tráfego, lançadores de infoprodutos) que NÃO são programadores, mas estão usando IA (Claude Code, Cursor, Lovable, etc.) para construir produtos e automações.

Você é EXTREMAMENTE seletivo. Sua reputação depende de só publicar o que realmente importa. Você vai receber dezenas de postagens de fontes diversas (Reddit, Hacker News, Google News, YouTube, Dev.to, GitHub) e deve garimpar apenas as joias do dia."""

USER_PROMPT_TEMPLATE = """Abaixo estão {count} itens coletados hoje de múltiplas fontes sobre IA e tecnologia.

ITENS COLETADOS:
{posts_json}

---

Sua tarefa: selecionar entre 3 e 5 itens — apenas os que realmente valem a atenção da comunidade. Menos é mais. Se só tiver 3 itens bons, coloque 3.

CRITÉRIOS OBRIGATÓRIOS (rejeite qualquer item que não passe):
- Novidade real das últimas 24-48h, não conteúdo genérico ou evergreen
- Relevância direta para quem quer construir com IA sem saber programar
- Preferência por: lançamentos, casos reais com resultados, hacks práticos, notícias de impacto

DESCARTE sem hesitação:
- Memes, reclamações, discussões filosóficas sem utilidade prática
- Conteúdo acadêmico ou muito técnico
- Notícias repetidas ou antigas
- Repositórios GitHub sem novidade clara

DIVERSIDADE: prefira fontes variadas. Não coloque 4 itens do Reddit e ignore o resto.

EMOJI: cada item deve ter UM emoji no campo "emoji". Use emojis específicos e relevantes ao conteúdo — nunca genéricos como 🚀💡🔥📰🛠️. Pense no que o item representa de verdade. Exemplos: para dinheiro/receita use 💰, para ferramenta nova use 🔧, para IA chinesa use 🇨🇳, para biologia/saúde use 🧬, para código use 💻. Se não tiver emoji específico bom, deixe o campo vazio ("").

Para cada item, retorne JSON com esta estrutura exata:
{{
  "items": [
    {{
      "emoji": "",
      "titulo": "Título direto e chamativo em português (máx 55 chars)",
      "contexto": "2 frases curtas: o que aconteceu + detalhe relevante. Tom de conversa, não jornalístico.",
      "por_que_importa": "1 frase do tipo 'Isso significa que...' ou 'Agora você pode...' — impacto prático real.",
      "url": "url original exata",
      "fonte": "nome da fonte"
    }}
  ]
}}

Responda APENAS com o JSON válido, sem texto antes ou depois."""


def curate(posts: list) -> list:
    posts_simplified = [
        {
            "fonte": p["source"],
            "titulo": p["title"],
            "url": p["url"],
            "score": p["score"],
            "descricao": p["body"][:200],
        }
        for p in posts
    ]

    prompt = USER_PROMPT_TEMPLATE.format(
        count=len(posts_simplified),
        posts_json=json.dumps(posts_simplified, ensure_ascii=False, indent=2),
    )

    print(f"Enviando {len(posts_simplified)} posts para o DeepSeek curar...")

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        temperature=0.4,
        max_tokens=4000,
    )

    raw = response.choices[0].message.content.strip()

    # remove markdown code block se vier com ```json
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        print(f"[Curator] Erro ao parsear JSON: {e}")
        print(f"[Curator] Resposta bruta (últimos 300 chars): ...{raw[-300:]}")
        raise

    return data["items"]
