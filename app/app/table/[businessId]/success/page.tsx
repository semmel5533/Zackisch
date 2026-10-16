import { PaymentSuccessPoller } from "@/components/guest/payment-success-poller";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { translations, Locale } from "@/lib/translations";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "de";
  const dict = translations[locale] || translations.de;
  return {
    title: dict.paymentSuccessful,
  };
}

export default async function TableSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ businessId: string }>;
  searchParams: Promise<{ payment_intent?: string; session_id?: string }>;
}) {
  const { businessId } = await params;
  const { payment_intent, session_id } = await searchParams;

  if (!payment_intent && !session_id) {
    redirect(`/table/${businessId}`);
  }

  return (
    <PaymentSuccessPoller
      sessionId={session_id}
      paymentIntentId={payment_intent}
      businessId={businessId}
      type="dine-in"
    />
  );
}
