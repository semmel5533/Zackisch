import {
  getPublicRestaurant,
  getMenuCategories,
  getAvailableMenuItems,
  getPopularMenuItems,
  getOrder,
} from "@/lib/convex/database";
import { GuestFrontend } from "@/components/guest/guest-frontend";
import { Storefront } from "@phosphor-icons/react/dist/ssr";
import { LocalizedText } from "@/components/ui/localized-text";

import { cookies } from "next/headers";
import { translations, Locale } from "@/lib/translations";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ businessId: string }>;
  searchParams: Promise<{ table?: string; order?: string }>;
}) {
  const [{ businessId }, { table, order }] = await Promise.all([
    params,
    searchParams,
  ]);
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "de";
  const dict = translations[locale] || translations.de;
  const business = await getPublicRestaurant(businessId);
  const businessName = business?.name || "";

  if (order) {
    return {
      title: businessName ? `${dict.orderStatus} - ${businessName}` : dict.orderStatus,
    };
  }

  const cleanTable = table ? table.trim().slice(0, 4) : undefined;
  const prefix = cleanTable
    ? dict.titleToStay.replace("{table}", cleanTable)
    : dict.titleToStayNoTable;

  return {
    title: businessName ? `${prefix} ${businessName}` : prefix,
  };
}

export default async function TablePage({
  params,
  searchParams,
}: {
  params: Promise<{ businessId: string }>;
  searchParams: Promise<{ table?: string; order?: string }>;
}) {
  const [{ businessId }, { table, order }] = await Promise.all([
    params,
    searchParams,
  ]);

  const [business, categories, items, initialOrder, popularItems] = await Promise.all([
    getPublicRestaurant(businessId),
    getMenuCategories(businessId),
    getAvailableMenuItems(businessId),
    order ? getOrder(order) : Promise.resolve(null),
    getPopularMenuItems(businessId),
  ]);

  if (!business)
    return (
      <div className="p-8 text-center">
        <LocalizedText tKey="businessNotFound" />
      </div>
    );

  if (business.isToStayEnabled === false && !order) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-background text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
          <Storefront
            className="w-8 h-8 text-muted-foreground"
            weight="duotone"
          />
        </div>
        <h1 className="text-2xl font-bold mb-2">
          <LocalizedText tKey="ordersPaused" />
        </h1>
        <LocalizedText
          tKey="notAcceptingOrders"
          params={{ name: business.name }}
          className="text-muted-foreground max-w-sm"
          as="p"
        />
      </div>
    );
  }

  if (!business.canOrder && !order) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-background text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
          <Storefront
            className="w-8 h-8 text-muted-foreground"
            weight="duotone"
          />
        </div>
        <h1 className="text-2xl font-bold mb-2">
          <LocalizedText tKey="onlineOrderingUnavailable" />
        </h1>
        <LocalizedText
          tKey="onlineOrderingUnavailableDesc"
          className="text-muted-foreground max-w-sm"
          as="p"
        />
      </div>
    );
  }

  const sanitizedInitialOrder =
    initialOrder && initialOrder.businessId === businessId
      ? {
          ...initialOrder,
          stripePaymentId: undefined,
          zakkigFee: 0,
          stripeFee: 0,
          netAmount: 0,
        }
      : null;

  const cleanTable = table ? table.trim().slice(0, 4) : undefined;

  return (
    <GuestFrontend
      business={structuredClone(business)}
      categories={structuredClone(categories)}
      items={structuredClone(items)}
      popularItems={popularItems ? structuredClone(popularItems) : []}
      type="dine-in"
      tableNumber={cleanTable}
      orderId={order}
      initialOrder={sanitizedInitialOrder ? structuredClone(sanitizedInitialOrder) : null}
    />
  );
}
