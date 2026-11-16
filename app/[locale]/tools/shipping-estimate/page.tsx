import type { Metadata } from "next";
import Estimator from "@/components/tools/Estimator";
import { loadToolsContent } from "@/content/tools";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { title, description } = (await loadToolsContent(locale)).meta.estimate;
  return { title, description, openGraph: { title, description } };
}

export default function ShippingEstimatePage() {
  return <Estimator />;
}
