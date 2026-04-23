# Architecture CertiArt National

## Couches

- `app/` : routes App Router, Server Components, Server Actions et Route Handlers.
- `components/` : UI reutilisable, composants shadcn-style et surfaces metier.
- `lib/supabase/` : clients `client`, `server` et `admin` separes.
- `lib/workflow/` : transitions de statuts et regles metier.
- `lib/payments/` : abstraction provider paiement.
- `lib/certificates/` : generation PDF et QR code.
- `supabase/migrations/` : schema Postgres, RLS et storage.

## Securite

- Les pages sensibles sont protegees par `middleware.ts`.
- Les mutations critiques sont cote serveur.
- Les policies RLS limitent les donnees par role et ownership.
- La service role key est reservee aux traitements serveur admin.

## Developpement local

```bash
npm install
cp .env.example .env.local
supabase start
supabase db reset
npm run dev
```

Recuperer les cles locales avec :

```bash
supabase status
```

## Deploiement Vercel

Variables requises :

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Le lecteur QR utilise l'API navigateur `BarcodeDetector`. Si le navigateur ne la supporte pas, l'utilisateur conserve la saisie manuelle du numero de certificat.

## Storage

- `product-images` : `artisan/{userId}/products/{productId}/images/{file}`
- `product-videos` : `artisan/{userId}/products/{productId}/videos/{file}`
- `documents` : `artisan/{userId}/requests/{requestId}/documents/{file}`
- `certificates` : `certificates/{certificateId}/{certificateNumber}.pdf`
- `inspection-media` : `inspections/{missionId}/{file}`
- `lab-reports` : `lab/{testId}/reports/{file}`
