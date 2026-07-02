# 🛒 Discord Sales & Ticket Bots — Source Collection

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)
![discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?logo=discord&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

> ⚠️ **AVISO / NOTICE:** Este repositório contém **APENAS CÓDIGO-FONTE** (sources) reunido para fins de **estudo e portfólio**. **Não é um produto pronto para produção** — não há garantias, suporte ou instruções completas de deploy.
> This repository contains **SOURCE CODE ONLY**, collected for **study and portfolio** purposes. It is **not a production-ready product**.

---

## 🇧🇷 Português

### 📖 Sobre

Coleção de **bots de vendas com sistema de tickets para Discord**, todos com a mesma proposta — automatizar vendas (pagamentos, estoque, entrega) e atendimento via tickets — implementados em duas stacks diferentes: **Node.js (discord.js v14)** e **Python (discord.py / disnake)**.

Cada variante fica em sua própria pasta, permitindo comparar abordagens, arquiteturas de handlers, formas de persistência (JSON/SQLite/MongoDB) e integrações de pagamento (Pix, Mercado Pago, Stripe, Efí).

### 📦 Variantes

| Pasta | Linguagem | Descrição |
|---|---|---|
| `vendas-ticket/` | Node.js (discord.js v14) | Bot de vendas completo ("Vexy Labs"): integrações **Mercado Pago**, **Stripe**, Pix (QR Code via `qrcode-pix` / `qr-code-styling-node`), gráficos com `chartjs-node-canvas`, e-mails via `nodemailer`, persistência `wio.db` (JSON). Handlers de slash commands e eventos, comandos administrativos em `Comandos/Admin`. |
| `ticket-v3/` | Node.js (discord.js v14) | Bot focado em **tickets** com vendas via **Pix manual** (chave + QR Code no `config.json`): categorias de ticket/call, cargo de suporte, logs com **transcript** do chat (sourcebin/hastebin), persistência `quick.db` (SQLite). Inclui utilidades de voz (`discord-player`). |
| `vendas-zend/` | Node.js (discord.js v14) | Bot de vendas ("Zend") com **Mercado Pago** e **Efí (Gerencianet)** para Pix, geração de QR Code estilizado, comandos de configuração (`confignovo`, `set`, `utilidades`), persistência `wio.db` (JSON) e trava de instância única (sai de servidores extras). |
| `goatzpro-python/` | Python (disnake) | Variante mais completa: **MongoDB** (pymongo) como banco, módulos de vendas (produtos, estoque, cupons, assinaturas, VIP, ranking, rendimentos, entrega automática), sistema de tickets com **transcript em HTML**, giveaways, moderação, proteção de servidor, comunicação em tempo real (Socket.IO/WebSocket) com API externa e gráficos via matplotlib. |
| `zen-sellers-python/` | Python (discord.py 2.3) | Variante enxuta ("ZenSellers"): painel de controle via slash command `/painel` com botões interativos (Minha Loja, Ticket, Boas-Vindas, Automações, Customizar, zenCloud etc.) — base de UI para um bot de vendas + tickets. |

### 🔐 Configuração & Segurança

Todo o material sensível foi **removido ou substituído por placeholders** antes da publicação:

- **Tokens de bot, chaves de API, URIs do MongoDB e webhooks** foram removidos — os arquivos de configuração contêm apenas placeholders (`SEU_VALOR_AQUI`).
- **Dumps de dados reais** (bancos, transcripts, dados de clientes) foram removidos.
- Para rodar qualquer variante, **crie o arquivo de configuração a partir do respectivo `.example`**:

| Variante | Copiar de → para |
|---|---|
| `vendas-ticket` | `token.example.json` → `token.json` |
| `ticket-v3` | `config.example.json` → `config.json` |
| `vendas-zend` | `token.example.json` → `token.json` (e `config.example.json` → `config.json`) |
| `goatzpro-python` | `config.example.json` → `config.json` |
| `zen-sellers-python` | `config.example.py` → `config.py` |

> 🔒 **Nunca** faça commit de tokens, chaves Pix, credenciais de gateway de pagamento ou strings de conexão. Use os `.example` como modelo e mantenha os arquivos reais no `.gitignore`.

### ⚙️ Instalação (genérica)

**Variantes Node.js** (`vendas-ticket`, `ticket-v3`, `vendas-zend`):

```bash
cd <pasta-da-variante>
npm install
# crie o arquivo de config a partir do .example (ver tabela acima)
node index.js
```

**Variantes Python** (`goatzpro-python`, `zen-sellers-python`):

```bash
cd <pasta-da-variante>
pip install -r requirements.txt
# crie o arquivo de config a partir do .example (ver tabela acima)
python bot.py
```

> `goatzpro-python` requer uma instância **MongoDB** acessível e instala uma build local do disnake (`.whl` incluído no `requirements.txt`).

### 🧰 Stack

- **Node.js** — discord.js v14, wio.db / quick.db (better-sqlite3), Mercado Pago SDK, Stripe, Efí (sdk-node-apis-efi), canvas / sharp / chartjs-node-canvas, axios, moment-timezone
- **Python** — discord.py 2.3 / disnake, pymongo + dnspython (MongoDB), aiohttp / websockets / python-socketio, matplotlib, Pillow, py-discord-html-transcripts
- **Hospedagem** — arquivos `squarecloud.config` presentes (SquareCloud)

### 🗂️ Estrutura

```
discord-sales-ticket-source/
├── vendas-ticket/        # Node.js — vendas (MP/Stripe/Pix) + tickets
│   ├── Comandos/  Eventos/  Functions/  handler/  Database/  assets/
│   └── index.js  package.json  token.example.json
├── ticket-v3/            # Node.js — tickets + Pix manual, transcripts
│   ├── Commands/  events/  handler/
│   └── index.js  package.json  config.example.json
├── vendas-zend/          # Node.js — vendas (MP/Efí) + tickets
│   ├── Comandos/  events/  Functions/  handler/  schema/  json/
│   └── index.js  package.json  token.example.json  config.example.json
├── goatzpro-python/      # Python (disnake) — vendas + tickets, MongoDB
│   ├── commands/  events/  modules/  tasks/  core/  connections/  functions/
│   └── bot.py  requirements.txt  config.example.json
├── zen-sellers-python/   # Python (discord.py) — painel de vendas/tickets
│   └── bot.py  emojis.py  requirements.txt  config.example.py
├── LICENSE
└── README.md
```

### 👤 Créditos

Coleção organizada e higienizada por **Isaque Félix** ([@isaquefl](https://github.com/isaquefl)). Os sources reúnem código de bots de vendas/tickets da comunidade Discord brasileira, preservados para estudo.

### 📄 Licença

Distribuído sob a licença **MIT** — veja o arquivo [LICENSE](./LICENSE).

---

## 🇺🇸 English

### 📖 About

A collection of **Discord sales bots with ticket systems**, all sharing the same purpose — automating sales (payments, stock, delivery) and support via tickets — implemented in two different stacks: **Node.js (discord.js v14)** and **Python (discord.py / disnake)**.

Each variant lives in its own folder, making it easy to compare approaches, handler architectures, persistence layers (JSON/SQLite/MongoDB), and payment integrations (Pix, Mercado Pago, Stripe, Efí).

### 📦 Variants

| Folder | Language | Description |
|---|---|---|
| `vendas-ticket/` | Node.js (discord.js v14) | Full-featured sales bot ("Vexy Labs"): **Mercado Pago** and **Stripe** integrations, Pix payments (QR Codes via `qrcode-pix` / `qr-code-styling-node`), charts with `chartjs-node-canvas`, e-mail via `nodemailer`, `wio.db` (JSON) persistence. Slash command/event handlers, admin commands under `Comandos/Admin`. |
| `ticket-v3/` | Node.js (discord.js v14) | **Ticket-focused** bot with manual **Pix** sales (Pix key + QR Code in `config.json`): ticket/call categories, support role, log channel with full chat **transcripts** (sourcebin/hastebin), `quick.db` (SQLite) persistence. Includes voice utilities (`discord-player`). |
| `vendas-zend/` | Node.js (discord.js v14) | Sales bot ("Zend") with **Mercado Pago** and **Efí (Gerencianet)** Pix integrations, styled QR Code generation, configuration commands (`confignovo`, `set`, `utilidades`), `wio.db` (JSON) persistence, and a single-guild lock (leaves extra servers). |
| `goatzpro-python/` | Python (disnake) | The most complete variant: **MongoDB** (pymongo) as its database, sales modules (products, stock, coupons, subscriptions, VIP, ranking, revenue, automatic delivery), ticket system with **HTML transcripts**, giveaways, moderation, server protection, real-time communication (Socket.IO/WebSocket) with an external API, and matplotlib charts. |
| `zen-sellers-python/` | Python (discord.py 2.3) | Lightweight variant ("ZenSellers"): a `/painel` slash-command control panel with interactive buttons (My Store, Ticket, Welcome, Automations, Customize, zenCloud, etc.) — a UI foundation for a sales + tickets bot. |

### 🔐 Configuration & Security

All sensitive material was **removed or replaced with placeholders** before publishing:

- **Bot tokens, API keys, MongoDB URIs, and webhooks** were removed — configuration files only contain placeholders (`SEU_VALOR_AQUI`).
- **Real data dumps** (databases, transcripts, customer data) were removed.
- To run any variant, **create the config file from its `.example` counterpart**:

| Variant | Copy from → to |
|---|---|
| `vendas-ticket` | `token.example.json` → `token.json` |
| `ticket-v3` | `config.example.json` → `config.json` |
| `vendas-zend` | `token.example.json` → `token.json` (and `config.example.json` → `config.json`) |
| `goatzpro-python` | `config.example.json` → `config.json` |
| `zen-sellers-python` | `config.example.py` → `config.py` |

> 🔒 **Never** commit tokens, Pix keys, payment gateway credentials, or connection strings. Use the `.example` files as templates and keep the real files in `.gitignore`.

### ⚙️ Installation (generic)

**Node.js variants** (`vendas-ticket`, `ticket-v3`, `vendas-zend`):

```bash
cd <variant-folder>
npm install
# create the config file from the .example (see table above)
node index.js
```

**Python variants** (`goatzpro-python`, `zen-sellers-python`):

```bash
cd <variant-folder>
pip install -r requirements.txt
# create the config file from the .example (see table above)
python bot.py
```

> `goatzpro-python` requires a reachable **MongoDB** instance and installs a local disnake build (`.whl` referenced in `requirements.txt`).

### 🧰 Stack

- **Node.js** — discord.js v14, wio.db / quick.db (better-sqlite3), Mercado Pago SDK, Stripe, Efí (sdk-node-apis-efi), canvas / sharp / chartjs-node-canvas, axios, moment-timezone
- **Python** — discord.py 2.3 / disnake, pymongo + dnspython (MongoDB), aiohttp / websockets / python-socketio, matplotlib, Pillow, py-discord-html-transcripts
- **Hosting** — `squarecloud.config` files included (SquareCloud)

### 🗂️ Structure

```
discord-sales-ticket-source/
├── vendas-ticket/        # Node.js — sales (MP/Stripe/Pix) + tickets
├── ticket-v3/            # Node.js — tickets + manual Pix, transcripts
├── vendas-zend/          # Node.js — sales (MP/Efí) + tickets
├── goatzpro-python/      # Python (disnake) — sales + tickets, MongoDB
├── zen-sellers-python/   # Python (discord.py) — sales/tickets panel
├── LICENSE
└── README.md
```

### 👤 Credits

Collection curated and sanitized by **Isaque Félix** ([@isaquefl](https://github.com/isaquefl)). These sources gather sales/ticket bot code from the Brazilian Discord community, preserved for study.

### 📄 License

Distributed under the **MIT** license — see [LICENSE](./LICENSE).
