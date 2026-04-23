insert into public.product_categories (name) values
  ('Textile'),
  ('Ceramique'),
  ('Bijouterie'),
  ('Maroquinerie'),
  ('Agro-artisanal')
on conflict do nothing;

-- Les utilisateurs auth de demonstration doivent etre crees via Supabase Auth.
-- Apres creation, ajuster les roles :
-- update public.profiles set role = 'admin' where email = 'admin@example.com';
-- update public.profiles set role = 'inspector' where email = 'inspecteur@example.com';
-- update public.profiles set role = 'lab_agent' where email = 'labo@example.com';
