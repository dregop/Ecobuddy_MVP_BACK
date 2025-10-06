# Ecobuddy_MVP_BACK

# Backend API – Fastify + Prisma + Supabase

Ce projet est une API construite avec **Fastify**, **Prisma** et **Supabase**. Il utilise Supabase comme base de données locale et fournit des scripts pratiques pour la migration, la seed, et le développement.

## 📁 Structure du projet

```bash
├── src/
│ ├── app.ts # Point d'entrée principal de Fastify (registre plugins/routes)
│ ├── server.ts # Démarrage du serveur (appel de `app.listen`)
│ ├── config/ # Fichiers de configuration (env, sécurité, etc.)
│ ├── plugins/ # Plugins Fastify (auth, cors, db, rate-limit…)
│ ├── routes/ # Routes Fastify organisées par domaine
│ │ └── user/
│ │ ├── controller.ts
│ │ ├── schema.ts
│ │ ├── routes.ts
│ │ └── service.ts
│ ├── services/ # Services métiers (peuvent être transversaux)
│   └── rag/
│       ├── ingestion.service.ts   ✅ logique d’ingestion
│       ├── embedding.service.ts   ✅ appel OpenAI
│       └── utils.ts               ✅ chunking / tokenisation
│ ├── prisma/ # Fichiers liés à Prisma (schema, client)
│ ├── utils/ # Fonctions utilitaires
│ ├── types/ # Types globaux TS
│ └── middlewares/ # Middlewares Fastify (auth, logger, etc.)
├── scripts/
│   └── ingest-pdf.ts              ✅ script d’entrée
├── assets/
│   └── pdfs/
│       ├── ipcc-ar6.pdf
│       └── unep-2024.pdf
├── .env # Variables d’environnement
├── package.json
├── tsconfig.json
├── prisma/ # Fichiers liés à Prisma (schema, client)
│ ├── schema.prisma
│ └── migrations/
├── tests/ # Tests (unitaires, intégration, e2e)
└── supabase/
```

### 🧱 Prérequis

- Node.js (v18+ recommandé)
- Docker Desktop
- Supabase CLI : `npm install -g supabase`

### Configuration

Copie le fichier `.env` :

```bash
cp .env.example .env
```

### Lancer Supabase

```bash
supabase start
```

## 🐳 Lancer l'application avec Docker

#### Lancer frontend + backend

```bash
docker-compose up --build
```

## Lancer le serveur API en mode développement

```bash
npm install
npm run dev
```

---

### 🔗 URLs par défaut

- Frontend : http://localhost:3000
- Backend : http://localhost:8000
- Supabase Studio : http://localhost:54323/

2. 🧠 Convertir en vector manuellement dans Supabase
Une fois la table créée, tu dois modifier la colonne en SQL dans Supabase (ou Postgres local) pour la convertir en vector natif :

sql
Copier
Modifier
-- exemple pour une taille de 1536 dimensions
alter table "RagChunk"
alter column embedding
type vector(1536)
using embedding::vector;
⚠️ Cette commande :

change le type SQL en vector

dit à Postgres de caster l’ancien tableau float8[] en vector

3. ✅ Tu peux maintenant indexer
sql
Copier
Modifier
create index on "RagChunk" using ivfflat (embedding vector_cosine_ops) with (lists = 100);