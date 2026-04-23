import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code")?.trim();

  if (!code) {
    redirect("/verify");
  }

  redirect(`/verify/${encodeURIComponent(code)}`);
}
