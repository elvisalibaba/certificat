import { SimpleRolePage } from "@/components/simple-role-page";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SimpleRolePage role="inspector" title="Fiche inspection" description={`Mission ${id}. Formulaire pret pour saisie terrain et future compatibilite offline.`} />;
}
