# Cahier des Charges Fonctionnel et Technique (CDCF)

**Projet :** Plateforme Intégrée de Gestion de Garage, Stocks, Dépannage & Suivi Client

## 1. Présentation Générale du Projet

### 1.1. Contexte

L'entreprise cliente (un garage automobile de grande envergure) souhaite moderniser et digitaliser l'intégralité de ses activités opérationnelles et relationnelles. Actuellement, la gestion des entrées/sorties de véhicules, la traçabilité des pièces en stock, la facturation et le suivi des interventions de dépannage nécessitent une centralisation et une automatisation poussées pour éviter les pertes d'informations et optimiser les délais de prise en charge.

### 1.2. Objectifs du Projet

- **Digitaliser la gestion atelier :** Suivre le workflow d'un véhicule depuis son entrée au garage jusqu'à sa livraison finale.
- **Maîtriser les stocks :** Assurer la traçabilité des pièces détachées avec des alertes automatiques de seuil critique.
- **Moderniser l'expérience client :** Offrir un suivi en temps réel par géolocalisation pour les dépannages et l'état d'avancement des réparations.
- **Automatiser la gestion financière :** Émettre instantanément des devis, Ordres de Réparation (OR) et factures PDF conformes.

## 2. Périmètre & Spécifications Fonctionnelles

Le système est découpé en **5 grands modules applicatifs**.

### Module 1 : Gestion de la Relation Client & Portail Suivi Live

- **Répertoire Clients :** Fiches détaillées des clients (Particuliers et Flottes d'Entreprises) avec historique complet des entretiens et factures associées.
- **Prise de demande de dépannage :**
  - *Via Réception :* Saisie rapide d'une alerte en cas d'appel téléphonique du client.
  - *Via le Portail Web / PWA Client :* Envoi d'une demande d'urgence en 1 clic avec transmission automatique des coordonnées GPS.
- **Lien de suivi dynamique :** Envoi automatique par SMS/WhatsApp d'un lien sécurisé unique permettant au client de :
  - Voir l'approche de la dépanneuse sur une carte interactive en temps réel (ETA + numéro du chauffeur).
  - Consulter l'état d'avancement de son véhicule en atelier.

### Module 2 : Workflow Ateliers & Parc Automobile

- **Fiche Véhicule :** Enregistrement complet (Marque, Modèle, Immatriculation, Numéro VIN, Kilométrage, Historique).
- **Gestion des Statuts Dynamiques :** Suivi en temps réel de l'état du véhicule (Réception → Diagnostic → En réparation → Prêt → Facturé).

### Module 3 : Gestion des Stocks & Pièces Détachées

- **Catalogue des Pièces :** Gestion du référentiel (Références, Désignation, Marque, Prix d'achat, Prix de vente).
- **Mouvements de Stock :** Saisie des approvisionnements, sorties d'atelier et ajustements d'inventaire.
- **Alertes de Seuil Critique :** Notification automatique lorsque le stock d'une pièce descend en dessous du seuil de sécurité défini.
- **Imputation Automatique :** Liaison directe des pièces utilisées aux Ordres de Réparation (OR) du véhicule concerné.

### Module 4 : Dépannage Terrain & Géolocalisation

- **Interface Dépanneur (Mobile/PWA) :** Prise en charge des missions d'urgence, activation du suivi GPS en direct, navigation et confirmation de prise en charge.
- **Console Admin Dépannage :** Carte interactive centrale affichant la position de la flotte de dépanneuses, les urgences en cours et les véhicules en attente.

### Module 5 : Facturation & Reporting de Direction

- **Gestion Documentaire PDF :** Génération automatique et téléchargement des Devis, Ordres de Réparation (OR) et Factures.
- **Tableau de Bord Analytics :** Graphiques et statistiques d'activité (Chiffre d'affaires journalier/mensuel, volume d'interventions par type, pièces les plus consommées).

## 3. Architecture Technique (Stack "No Stress")

Stack **Fullstack JavaScript/TypeScript**, choisie pour la performance, la maintenabilité par un développeur unique et la rapidité de déploiement.

### 3.1. Frontend & Applications Mobiles

- **Framework Web & PWA :** Next.js (React / TypeScript) — unification du Dashboard Admin et de la PWA mobile Client/Dépanneur dans un seul projet.
- **Design & Composants UI :** TailwindCSS + shadcn/ui.
- **Cartographie Temps Réel :** Leaflet.js / OpenStreetMap (via react-leaflet), sans surcoût d'API.

### 3.2. Backend & Base de Données

- **Base de Données & Backend-as-a-Service :** Supabase (PostgreSQL).
  - *Base Relationnelle :* Modélisation robuste des tables Clients, Vehicles, RepairOrders, StockItems, GPSLogs.
  - *Authentification & Sécurité :* Gestion native des accès par rôles (JWT / RLS : Admin, Réceptionniste, Mécanicien, Dépanneur, Client).
  - *Temps Réel (Websockets) :* Flux de données en temps réel pour la géolocalisation live des dépanneuses.
- **ORM & API :** Prisma ORM + Next.js API Routes.
- **Génération PDF :** @react-pdf/renderer.

### 3.3. Infrastructure & DevOps

- **Hébergement Web & API :** Vercel / Render (déploiement continu via GitHub).
- **Hébergement Base de Données :** Supabase Cloud (backups automatiques quotidiens).

## 4. Exigences Non-Fonctionnelles

- **Sécurité :** Chiffrement des communications en HTTPS/SSL, mots de passe hachés, sécurisation des accès à la base via Row Level Security (RLS).
- **Disponibilité & Performance :** Temps de chargement des pages inférieur à 2 secondes, interface PWA optimisée pour le réseau mobile.
- **Ergonomie :** Interface intuitive ne nécessitant pas plus de 2 heures de formation pour le personnel d'atelier.

## 5. Livrables Attendus

- Maquettes UI/UX interactives (Figma).
- Code source de l'application (Dépôt GitHub).
- Application déployée et fonctionnelle en environnement de production (Serveur VPS / Vercel + Supabase).
- Manuel d'utilisation utilisateur/administrateur au format PDF.
- Session de formation du personnel du garage.

---

## Annexe — Workflow Métier Validé (Parcours Véhicule)

Voir historique du projet pour le détail complet. Points clés validés :

- Entrée double : rendez-vous programmé **ou** urgence (appel/PWA).
- Refus de devis → aucune facturation (geste commercial), statut "Clôturé sans réparation".
- Avenant en cours de réparation → seuil configurable déterminant pause ou poursuite du travail.
- Statut de paiement : Payé / Acompte versé / En attente.
