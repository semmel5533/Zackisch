"use client";

import React, { useEffect, useState } from "react";
import { loadConnectAndInitialize, type StripeConnectInstance } from "@stripe/connect-js";
import {
  ConnectComponentsProvider,
  ConnectAccountOnboarding,
  ConnectAccountManagement,
  ConnectPayments,
  ConnectPayouts,
  ConnectNotificationBanner,
} from "@stripe/react-connect-js";
import {
  createConnectV2AccountAction,
  createEmbeddedAccountSessionAction,
  getStripeAccountStatusAction,
} from "@/actions/stripe-actions";
import { Button } from "@astryxdesign/core/Button";
import { Banner } from "@astryxdesign/core/Banner";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@astryxdesign/core/SegmentedControl";
import { Icon } from "@astryxdesign/core/Icon";
import { SpinnerGap, Check, WarningCircle } from "@phosphor-icons/react";
import { toast } from "@/components/common/toast";
import { useTranslation } from "@/lib/i18n";

interface StripeEmbeddedPortalProps {
  businessId: string;
  stripeAccountId?: string;
  stripeOnboardingComplete?: boolean;
  onStatusUpdated?: () => void;
}

export function StripeEmbeddedPortal({
  businessId,
  stripeAccountId,
  stripeOnboardingComplete,
  onStatusUpdated,
}: StripeEmbeddedPortalProps) {
  const { locale } = useTranslation();
  const isDe = locale.startsWith("de");

  const [connectInstance, setConnectInstance] =
    useState<StripeConnectInstance | null>(null);
  const [activeTab, setActiveTab] = useState<
    "onboarding" | "management" | "payments" | "payouts"
  >(stripeOnboardingComplete ? "management" : "onboarding");
  const [isInitializing, setIsInitializing] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  const initializeEmbeddedConnect = async () => {
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!pk) {
      setInitError("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ist nicht gesetzt.");
      return;
    }

    setIsInitializing(true);
    setInitError(null);

    try {
      if (!stripeAccountId) {
        const created = await createConnectV2AccountAction(
          businessId,
          "none",
        );
        if (created.error) {
          setInitError(created.error);
          setIsInitializing(false);
          return;
        }
      }

      const initialSession = await createEmbeddedAccountSessionAction(businessId);
      if (initialSession.error || !initialSession.clientSecret) {
        setInitError(
          initialSession.error ||
            (isDe
              ? "Konnte keine Stripe Account Session erzeugen."
              : "Failed to create Stripe Account Session."),
        );
        setIsInitializing(false);
        return;
      }

      let cachedSecret: string | null = initialSession.clientSecret;
      const fetchClientSecret = async () => {
        if (cachedSecret) {
          const secret = cachedSecret;
          cachedSecret = null;
          return secret;
        }
        const res = await createEmbeddedAccountSessionAction(businessId);
        if (res.error || !res.clientSecret) {
          throw new Error(
            res.error || "Konnte keine Stripe Account Session erzeugen.",
          );
        }
        return res.clientSecret;
      };

      const instance = loadConnectAndInitialize({
        publishableKey: pk,
        fetchClientSecret,
        locale: isDe ? "de-DE" : "en-US",
        appearance: {
          overlays: "dialog",
          variables: {
            colorPrimary: "#000000",
            fontFamily: "Poppins, -apple-system, BlinkMacSystemFont, sans-serif",
            borderRadius: "12px",
          },
        },
      });

      setConnectInstance(instance);
    } catch (err: any) {
      setInitError(
        err?.message ||
          (isDe
            ? "Eingebettetes Stripe-Portal konnte nicht geladen werden."
            : "Failed to load embedded Stripe portal."),
      );
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    if (stripeAccountId && !connectInstance && !isInitializing) {
      initializeEmbeddedConnect().catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripeAccountId]);

  const handleSyncStatus = async () => {
    const res = await getStripeAccountStatusAction(businessId);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    if (res.isOnboardingComplete) {
      toast.success(
        isDe
          ? "Stripe-Händlerkonto ist aktiv und bereit für Direct Charges!"
          : "Stripe merchant account is active and ready for Direct Charges!",
      );
      setActiveTab("management");
    } else {
      toast.info(
        isDe
          ? "KYC-Angaben werden noch von Stripe geprüft oder sind unvollständig."
          : "KYC requirements are still pending or under review.",
      );
    }
    onStatusUpdated?.();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs text-muted-foreground">
          {isDe
            ? "Direct Charges (Connected Account v2): Dein Betrieb ist Verkäufer, Stripe zieht Zahlungsgebühren direkt ab, Zackisch erhält 2 % Provision (inkl. USt., ohne Trinkgeld)."
            : "Direct Charges (Connected Account v2): Your venue is the Seller of Record, Stripe collects processing fees directly, Zackisch receives a 2% VAT-inclusive fee (excl. tips)."}
        </div>

        <div className="flex items-center gap-2">
          {!connectInstance && (
            <Button
              type="button"
              size="sm"
              variant="primary"
              isDisabled={isInitializing}
              isLoading={isInitializing}
              onClick={initializeEmbeddedConnect}
              label={
                stripeAccountId
                  ? isDe
                    ? "Eingebettetes Stripe-Portal öffnen"
                    : "Open embedded Stripe portal"
                  : isDe
                    ? "Stripe Connect v2 Konto jetzt starten"
                    : "Start Stripe Connect v2 onboarding"
              }
            />
          )}
          {stripeAccountId && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleSyncStatus}
              icon={<Icon icon={Check} size="sm" />}
              label={isDe ? "Status prüfen" : "Sync status"}
            />
          )}
        </div>
      </div>

      {initError && (
        <Banner
          status="error"
          title={initError}
        />
      )}

      {connectInstance && (
        <ConnectComponentsProvider connectInstance={connectInstance}>
          <div className="space-y-3 border border-border rounded-xl p-4 bg-background">
            <ConnectNotificationBanner />

            <SegmentedControl
              label="Stripe Connect Tab"
              value={activeTab}
              onChange={(val) => setActiveTab(val as any)}
              size="sm"
            >
              <SegmentedControlItem
                value="onboarding"
                label={isDe ? "Verifizierung & KYC" : "Onboarding & KYC"}
              />
              <SegmentedControlItem
                value="management"
                label={isDe ? "Konto & Bankdaten" : "Account & Bank"}
              />
              <SegmentedControlItem
                value="payments"
                label={isDe ? "Zahlungen & Erstattungen" : "Payments & Refunds"}
              />
              <SegmentedControlItem
                value="payouts"
                label={isDe ? "Auszahlungen (IBAN)" : "Payouts (IBAN)"}
              />
            </SegmentedControl>

            <div className="min-h-[320px] pt-2">
              {activeTab === "onboarding" && (
                <ConnectAccountOnboarding
                  onExit={() => {
                    handleSyncStatus().catch(console.error);
                  }}
                />
              )}
              {activeTab === "management" && <ConnectAccountManagement />}
              {activeTab === "payments" && <ConnectPayments />}
              {activeTab === "payouts" && <ConnectPayouts />}
            </div>
          </div>
        </ConnectComponentsProvider>
      )}
    </div>
  );
}
