# GaraTech

Plateforme intégrée de gestion de garage automobile : suivi atelier, gestion des stocks, dépannage géolocalisé et suivi client en temps réel.

## Stack Technique

| Domaine | Technologie |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn/ui |
| Authentification | Auth.js (NextAuth v5) — email + mot de passe |
| Base de données | PostgreSQL 16 |
| ORM | Prisma |
| Infra locale | Docker Compose (PostgreSQL seul) |

## Structure du projet

```
garatech/
├── apps/
│   └── web/              # Application Next.js
├── packages/
│   └── types/             # Types TypeScript partagés
├── docker/
│   └── volumes/           # Volumes persistants Docker (non versionnés)
├── docker-compose.yml      # PostgreSQL local
├── .env.example             # Variables d'environnement à documenter
└── docs/
    └── CDCF.md               # Cahier des charges fonctionnel et technique
```

## Prérequis

- Node.js ≥ 20
- pnpm ≥ 9 (`npm install -g pnpm`)
- Docker & Docker Compose

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/nonoserena/GaraTech.git
cd garatech
```

### 2. Configurer les variables d'environnement

Racine du projet (`.env`) :

```bash
cp .env.example .env
```

Complète `POSTGRES_PASSWORD`.

Application (`apps/web/.env`) :

```env
DATABASE_URL=postgresql://postgres:<ton_mot_de_passe>@localhost:5433/postgres
AUTH_SECRET=
```

Génère `AUTH_SECRET` :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Lancer la base de données

```bash
pnpm docker:up
```

### 4. Installer les dépendances

```bash
pnpm install
```

### 5. Appliquer les migrations

```bash
pnpm db:migrate
```

### 6. Créer le premier compte Admin

```bash
$env:DATABASE_URL="postgresql://postgres:<ton_mot_de_passe>@localhost:5433/postgres"
pnpm --filter web exec tsx scripts/create-admin.ts
```

### 7. Lancer l'application

```bash
pnpm dev
```

Accessible sur http://localhost:3000

## Scripts disponibles

| Commande | Description |
|---|---|
| `pnpm dev` | Lance le serveur Next.js en développement |
| `pnpm build` | Build de production |
| `pnpm lint` | Vérifie le code avec ESLint |
| `pnpm docker:up` | Démarre PostgreSQL localement |
| `pnpm docker:down` | Arrête PostgreSQL |
| `pnpm db:studio` | Ouvre Prisma Studio |
| `pnpm db:migrate` | Applique les migrations Prisma |

## Documentation

Le cahier des charges fonctionnel et technique complet est disponible dans [`docs/CDCF.md`](./docs/CDCF.md).

## Rôles utilisateurs

| Rôle | Périmètre |
|---|---|
| Admin | Accès complet, supervision, validation des comptes, reporting |
| Réceptionniste | Gestion clients, prise de rendez-vous, saisie dépannage |
| Mécanicien | Diagnostic, devis, suivi statut atelier |
| Dépanneur | Missions terrain, géolocalisation live |
| Client | Suivi de son véhicule, historique, factures |

## Workflow de contribution

Ce projet suit le **GitHub Flow** : toute nouvelle fonctionnalité part d'une branche `feature/...` depuis `main`, est testée localement, puis intégrée via une Pull Request (CI automatique : lint + build).

## Licence

Projet propriétaire — tous droits réservés.
