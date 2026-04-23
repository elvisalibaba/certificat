import { SimpleRolePage } from "@/components/simple-role-page";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SimpleRolePage role="lab" title="Fiche test" description={`Test ${id}. Resultats, observations, rapport final et recommandation.`} />;
}
