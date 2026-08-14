# GaraTech

Plateforme intégrée de gestion de garage automobile : suivi atelier, gestion des stocks, dépannage géolocalisé et suivi client en temps réel.

## Stack Technique

| Domaine | Technologie |
|---|---|
| Frontend / PWA | Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn/ui |
| Cartographie | Leaflet.js / OpenStreetMap (react-leaflet) |
| Backend / DB | Supabase (PostgreSQL, Auth, RLS, Realtime) |
| ORM | Prisma |
| PDF | @react-pdf/renderer |
| Infra locale | Docker Compose (stack Supabase self-hosted) |
| Hébergement | Vercel / Render + Supabase Cloud |

## Structure du projet

```
garatech/
├── apps/
│   └── web/              # Application Next.js (Dashboard Admin + PWA)
├── packages/
│   └── types/            # Types TypeScript partagés
├── docker/
│   └── volumes/          # Volumes persistants Docker (non versionnés)
├── docker-compose.yml     # Stack Supabase locale
├── .env.example           # Variables d'environnement à documenter
└── docs/
    └── CDCF.md             # Cahier des charges fonctionnel et technique
```

## Prérequis

- Node.js ≥ 20
- pnpm ≥ 9 (`npm install -g pnpm`)
- Docker & Docker Compose

## Installation

### 1. Cloner le dépôt

```bash
git clone <url-du-depot>
cd garatech
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Générer les secrets requis :

```bash
# JWT_SECRET
openssl rand -base64 32

# REALTIME_SECRET_KEY_BASE
openssl rand -base64 64
```

Puis générer `ANON_KEY` et `SERVICE_ROLE_KEY` à partir du `JWT_SECRET` en suivant la documentation officielle Supabase self-hosting.

Compléter également `apps/web/.env.local` avec les mêmes clés (voir section correspondante dans `.env.example`).

### 3. Lancer l'infrastructure Docker (Supabase local)

```bash
pnpm docker:up
```

- Studio (interface DB) : http://localhost:54323
- API Gateway (Kong) : http://localhost:8000

### 4. Installer les dépendances

```bash
pnpm install
```

### 5. Appliquer le schéma de base de données

```bash
pnpm db:migrate
```

### 6. Lancer l'application

```bash
pnpm dev
```

L'application est accessible sur http://localhost:3000

## Scripts disponibles

| Commande | Description |
|---|---|
| `pnpm dev` | Lance le serveur Next.js en développement |
| `pnpm build` | Build de production |
| `pnpm lint` | Vérifie le code avec ESLint |
| `pnpm docker:up` | Démarre la stack Supabase locale |
| `pnpm docker:down` | Arrête la stack Supabase locale |
| `pnpm db:studio` | Ouvre Prisma Studio |
| `pnpm db:migrate` | Applique les migrations Prisma |

## Documentation

Le cahier des charges fonctionnel et technique complet est disponible dans [`docs/CDCF.md`](./docs/CDCF.md).

## Rôles utilisateurs

| Rôle | Périmètre |
|---|---|
| Admin | Accès complet, supervision, reporting |
| Réceptionniste | Gestion clients, prise de rendez-vous, saisie dépannage |
| Mécanicien | Diagnostic, devis, suivi statut atelier |
| Dépanneur | Missions terrain, géolocalisation live |
| Client | Suivi de son véhicule, historique, factures |

## Licence

Projet propriétaire — tous droits réservés.
