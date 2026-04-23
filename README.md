CertiArt National est une plateforme Next.js + Supabase pour la certification artisanale.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui local
- Supabase Auth, Postgres, Storage, RLS
- Zod, React Hook Form
- QR code et PDF

## Installation locale

```bash
npm install
cp .env.example .env.local
supabase start
supabase db reset
npm run dev
```

Configurer `.env.local` avec les valeurs de `supabase status`.

Pour utiliser ton projet Supabase cloud :

```env
NEXT_PUBLIC_SUPABASE_URL=https://zwvhvjqrogfdrvjyaagm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_XEL_PkYmmualtl9N1456xg_dFsPOu5i
```

## Configuration Vercel

Ajouter dans les variables d'environnement Vercel :

```env
NEXT_PUBLIC_SITE_URL=https://ton-domaine-vercel.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://zwvhvjqrogfdrvjyaagm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_XEL_PkYmmualtl9N1456xg_dFsPOu5i
SUPABASE_SERVICE_ROLE_KEY=cle-service-role-supabase
```

`SUPABASE_SERVICE_ROLE_KEY` est necessaire pour les actions admin serveur comme la generation de certificat. Elle ne doit jamais etre exposee cote client.

## Migrations

Les migrations compatibles Supabase CLI sont dans `supabase/migrations`.

## Notes

- Ne pas exposer `SUPABASE_SERVICE_ROLE_KEY` au client.
- Les changements de statut doivent passer par des fonctions serveur.
- Les policies RLS sont la barriere de securite finale.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
