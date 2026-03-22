# 📋 Tutorial — Setup Manual do Telegram

> Faça na ordem. Tempo estimado: 10-15 minutos.

---

## ✅ Passo 1: Canal Principal (Broadcast)
**Já feito!** Você já criou o canal.

**Ajustes pra fazer nele:**
1. Abra o canal → clique no nome lá em cima → **Editar**
2. **Tipo do canal**: deixe como **Público**
3. **Link**: defina um @ bonito (ex: `@vibecoding` ou o nome que vocês escolherem)
4. **Descrição**: coloque algo tipo: "🚀 Comunidade de Vibe Coding | IA + Negócios | Conteúdo diário sobre Claude Code, Cursor, automações"
5. **Foto**: coloque o logo (o que tiver pronto do branding)

---

## 🔧 Passo 2: Criar o Grupo Comunidade (Gratuito)

1. No Telegram, toque no **ícone de lápis** (ou "Nova mensagem") → **Novo Grupo**
2. Adicione pelo menos 1 pessoa (pode ser o Vini ou sua outra conta)
3. Dê o nome do grupo (ex: "Comunidade Vibe Coding 💬")
4. Após criar, clique no **nome do grupo** lá em cima → **Editar**
5. **Tipo do grupo**: mude para **Público**
6. **Defina um @** (ex: `@vibecoding_chat`)

### Ativar Forum Mode (Tópicos) 👈 Importante!
7. Ainda em editar, procure **"Tópicos"** ou **"Topics"**
8. **Ative** essa opção
9. Pronto! Agora o grupo vira um "fórum" com tópicos separados

> **Nota**: Quando ativar Topics, o grupo vira automaticamente um Supergrupo. Isso é normal e irreversível.

### Vincular o Canal ao Grupo
10. Volte pro **Canal** → Editar → procure **"Discussão"** ou **"Discussion"**
11. Selecione o **grupo comunidade** que você acabou de criar
12. Agora cada post do canal abre automaticamente uma discussão no grupo!

---

## 🔒 Passo 3: Criar o Grupo Premium (Pago)

1. **Nova mensagem** → **Novo Grupo**
2. Adicione o Vini
3. Nome: "VIP Vibe Coding 🔒" (ou o nome premium que escolherem)
4. Clique no nome → **Editar**
5. **Tipo**: deixe como **Privado** ⚠️ (importante! só entra quem tem link)
6. Opcionalmente, ative **Topics** aqui também
7. Copie e guarde o **link de convite** (vamos usar depois no bot)

---

## 🤖 Passo 4: Criar o Bot (via BotFather)

1. No Telegram, pesquise por **@BotFather** (tem o check azul ✓)
2. Abra o chat com ele e digite: `/newbot`
3. Ele vai perguntar o **nome** do bot → digite o nome (ex: "Vibe Coding Bot")
4. Ele vai perguntar o **username** do bot → tem que terminar com `bot` (ex: `vibecoding_bot` ou `vibecodingbot`)
5. 🎉 Ele vai te dar um **token** tipo assim:
   ```
   7123456789:AAHxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
6. **COPIE E GUARDE ESSE TOKEN** — é isso que você vai me passar depois

### Configurar o bot (ainda no BotFather):
7. Digite `/mybots` → selecione o bot que criou
8. **Bot Settings** → **Group Privacy** → **Turn OFF**
   (isso permite o bot ler mensagens no grupo, necessário pro onboarding)
9. **Edit Bot** → **Edit Description** → coloque uma descrição bonita
10. **Edit Bot** → **Edit About** → mesma coisa
11. **Edit Bot** → **Edit Botpic** → coloque o logo

---

## 👑 Passo 5: Adicionar o Bot como Admin

### No Canal:
1. Abra o **canal** → nome → **Administradores** → **Adicionar Admin**
2. Pesquise pelo @ do bot (ex: `vibecoding_bot`)
3. Dê essas permissões:
   - ✅ Postar mensagens
   - ✅ Editar mensagens
   - ✅ Apagar mensagens
4. Salve

### No Grupo Comunidade:
1. Abra o **grupo** → nome → **Administradores** → **Adicionar Admin**
2. Pesquise pelo @ do bot
3. Dê essas permissões:
   - ✅ Gerenciar tópicos
   - ✅ Apagar mensagens
   - ✅ Banir usuários
   - ✅ Fixar mensagens
   - ✅ Convidar via link
   - ✅ Gerenciar videochats (pras lives)
4. Salve

### No Grupo Premium:
1. Mesma coisa — adicione o bot como admin com as mesmas permissões

---

## 📝 Resumo do que me passar depois

Quando terminar tudo, me manda:

| Info | Exemplo |
|------|---------|
| **Token do bot** | `7123456789:AAHxxx...` |
| **@ do canal** | `@vibecoding` |
| **@ do grupo comunidade** | `@vibecoding_chat` |
| **Link do grupo premium** | `https://t.me/+xxxxx` |
| **Nome que ficou** | (se já decidiram o nome da comunidade) |

Com isso eu consigo codar toda a automação! 🔥
