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
│ ├── prisma/ # Fichiers liés à Prisma (schema, client)
│ ├── utils/ # Fonctions utilitaires
│ ├── types/ # Types globaux TS
│ └── middlewares/ # Middlewares Fastify (auth, logger, etc.)
│
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
