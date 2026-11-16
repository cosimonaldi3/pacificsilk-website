import { redirect } from "@/i18n/navigation";

export default async function PortalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/portal/login", locale });
}
