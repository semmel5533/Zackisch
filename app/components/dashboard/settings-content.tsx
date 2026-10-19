"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { Card } from "@astryxdesign/core/Card";
import { Button } from "@astryxdesign/core/Button";
import { TextInput } from "@astryxdesign/core/TextInput";
import { TextArea } from "@astryxdesign/core/TextArea";
import { Switch } from "@astryxdesign/core/Switch";
import { Divider } from "@astryxdesign/core/Divider";
import { Badge } from "@astryxdesign/core/Badge";
import { Tooltip } from "@astryxdesign/core/Tooltip";
import { Banner } from "@astryxdesign/core/Banner";
import { VStack, HStack } from "@astryxdesign/core/Layout";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { toast } from "@/components/common/toast";
import {
  WarningCircle,
  UploadSimple,
  PencilSimple,
  Trash,
  Info,
} from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n";
import { getImagePreviewUrl } from "@/lib/convex/client";
import { cn } from "@/lib/utils";
import { MAX_IMAGE_SIZE_BYTES, isAllowedImageFile } from "@/lib/constants";
import {
  updateBusinessAction,
  requestAccountDeletionAction,
  requestEmailChangeAction,
  logoutAllDevicesAction,
} from "@/actions/settings-actions";
import {
  connectStripeAction,
  createStripeDashboardLinkAction,
  completeTestStripeOnboardingAction,
} from "@/actions/stripe-actions";
import { StripeEmbeddedPortal } from "@/components/dashboard/stripe-embedded-portal";
import { SetupAndBillingPanel } from "@/components/dashboard/setup-and-billing-panel";
import type { Business } from "@/lib/types";

interface SettingsContentProps {
  business: Business;
  user: { name?: string; email?: string; [key: string]: any };
}

function InfoTooltip({ content }: { content: string }) {
  return (
    <Tooltip content={content}>
      <span className="inline-flex items-center justify-center text-muted-foreground hover:text-foreground cursor-help p-0.5">
        <Info className="size-4" />
      </span>
    </Tooltip>
  );
}

export function SettingsContent({ business, user }: SettingsContentProps) {
  const { t, locale } = useTranslation();

  const [businessState, businessAction, isBusinessPending] = useActionState(
    updateBusinessAction,
    {},
  );

  const [businessName, setBusinessName] = useState(business.name || "");
  const [userName, setUserName] = useState(user.name || "");
  const [address, setAddress] = useState(business.address || "");

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [logoPreview, setLogoPreview] = useState<string | null>(
    business.logoUrl || (business.logoFileId ? getImagePreviewUrl(business.logoFileId) : null),
  );
  const [bannerPreview, setBannerPreview] = useState<string | null>(
    business.bannerUrl || (business.bannerFileId ? getImagePreviewUrl(business.bannerFileId) : null),
  );

  const [removeLogo, setRemoveLogo] = useState(false);
  const [removeBanner, setRemoveBanner] = useState(false);
  const [isDraggingBanner, setIsDraggingBanner] = useState(false);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);
  const [isStripeLoading, setIsStripeLoading] = useState(false);
  const [isUpsellingEnabled, setIsUpsellingEnabled] = useState(
    business.isUpsellingEnabled ?? true,
  );
  const [isTippingEnabled, setIsTippingEnabled] = useState(
    business.isTippingEnabled ?? true,
  );
  const [isPopularCategoryEnabled, setIsPopularCategoryEnabled] = useState(
    business.isPopularCategoryEnabled ?? true,
  );

  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
      if (bannerPreview && bannerPreview.startsWith("blob:")) {
        URL.revokeObjectURL(bannerPreview);
      }
    };
  }, [logoPreview, bannerPreview]);

  const [isEmailChanging, setIsEmailChanging] = useState(false);

  useEffect(() => {
    if (businessState.success) {
      toast.success(t("saved"));
    }
  }, [businessState, t]);

  const handleLogoFile = (file: File) => {
    if (!isAllowedImageFile(file)) {
      toast.error(t("invalidImageFormat"));
      if (logoInputRef.current) logoInputRef.current.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error(t("imageTooLarge"));
      if (logoInputRef.current) logoInputRef.current.value = "";
      return;
    }

    setRemoveLogo(false);
    const url = URL.createObjectURL(file);
    setLogoPreview((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return url;
    });

    if (logoInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      logoInputRef.current.files = dataTransfer.files;
    }
  };

  const handleBannerFile = (file: File) => {
    if (!isAllowedImageFile(file)) {
      toast.error(t("invalidImageFormat"));
      if (bannerInputRef.current) bannerInputRef.current.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error(t("imageTooLarge"));
      if (bannerInputRef.current) bannerInputRef.current.value = "";
      return;
    }

    setRemoveBanner(false);
    const url = URL.createObjectURL(file);
    setBannerPreview((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return url;
    });

    if (bannerInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      bannerInputRef.current.files = dataTransfer.files;
    }
  };

  return (
    <div className="flex-1 space-y-6 @container">
      <div className="sticky top-0 z-30 h-16 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-canvas/95 backdrop-blur-md border-b border-border/40 flex items-center justify-between shrink-0 print:hidden">
        <Heading level={1}>{t("settings")}</Heading>
      </div>

      <div className="flex flex-col gap-6 w-full">
        {/* Business & Stripe Settings Card */}
        <Card elevation="low" variant="default" padding={4}>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Heading level={3}>{t("businessSettings")}</Heading>
                <InfoTooltip content={t("businessSettingsDescription" as any)} />
              </div>
            </div>

            <form
              action={businessAction}
              noValidate
              className="flex flex-col gap-6"
            >
              <input
                type="hidden"
                name="businessId"
                value={business.$id}
              />
              <input
                type="hidden"
                name="existingLogoId"
                value={business.logoFileId || ""}
              />
              <input
                type="hidden"
                name="removeLogo"
                value={removeLogo ? "true" : "false"}
              />
              <input
                type="hidden"
                name="existingBannerId"
                value={business.bannerFileId || ""}
              />
              <input
                type="hidden"
                name="removeBanner"
                value={removeBanner ? "true" : "false"}
              />
              <input
                ref={logoInputRef}
                id="business-logo"
                name="logo"
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLogoFile(file);
                }}
              />
              <input
                ref={bannerInputRef}
                id="business-banner"
                name="banner"
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleBannerFile(file);
                }}
              />

              {/* Form Fields: 2 Columns on >= 480px, 1 Column on narrow mobile */}
              <div className="grid grid-cols-1 @min-[480px]:grid-cols-2 gap-4">
                <TextInput
                  label={t("restaurantName")}
                  isRequired
                  size="lg"
                  value={businessName}
                  onChange={(val) => setBusinessName(val.slice(0, 80))}
                  htmlName="businessName"
                  id="business-name"
                  width="100%"
                />
                <TextInput
                  label={t("name")}
                  isRequired
                  size="lg"
                  value={userName}
                  onChange={(val) => setUserName(val.slice(0, 128))}
                  htmlName="userName"
                  id="business-user-name"
                  width="100%"
                />
                <TextArea
                  label={t("address")}
                  size="lg"
                  value={address}
                  onChange={setAddress}
                  htmlName="address"
                  id="business-address"
                  width="100%"
                  rows={2}
                  maxLength={300}
                />
                <TextInput
                  label={t("email")}
                  isRequired
                  size="lg"
                  value={user.email || ""}
                  isDisabled
                  disabledMessage={t("changeEmailTooltip" as any)}
                  htmlName="userEmail"
                  id="business-email"
                  width="100%"
                />
              </div>

              {/* Visual Media & Stripe Integration: 2 Columns on >= 600px, 1 Column on mobile */}
              <div className="grid grid-cols-1 @min-[600px]:grid-cols-2 gap-6 items-stretch">
                {/* Brand Media Column */}
                <div className="flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <Text weight="bold">{t("brandMedia")}</Text>
                      <Text color="secondary">{t("bannerRecommended")}</Text>
                    </div>

                    <div className="relative isolate w-full aspect-[2.3/1] rounded-xl overflow-hidden border border-border bg-muted/40 group/banner transition-colors">
                      {/* Banner Area */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => bannerInputRef.current?.click()}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            bannerInputRef.current?.click();
                          }
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingBanner(true);
                        }}
                        onDragLeave={() => setIsDraggingBanner(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDraggingBanner(false);
                          const file = e.dataTransfer.files[0];
                          if (file) handleBannerFile(file);
                        }}
                        className={cn(
                          "w-full h-full cursor-pointer relative flex flex-col items-center justify-center transition-colors",
                          isDraggingBanner && "bg-primary/10",
                        )}
                      >
                        {bannerPreview ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={bannerPreview}
                              alt="Banner"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center gap-2.5 pointer-events-none">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  bannerInputRef.current?.click();
                                }}
                                className="pointer-events-auto inline-flex size-10 items-center justify-center rounded-full bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white text-white transition-colors cursor-pointer hover:bg-black active:scale-95 shadow-md"
                                title={t("changeBanner")}
                              >
                                <PencilSimple className="size-4" weight="bold" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (bannerPreview.startsWith("blob:")) URL.revokeObjectURL(bannerPreview);
                                  setBannerPreview(null);
                                  setRemoveBanner(true);
                                  if (bannerInputRef.current) bannerInputRef.current.value = "";
                                }}
                                className="pointer-events-auto inline-flex size-10 items-center justify-center rounded-full bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white hover:bg-destructive text-white transition-colors cursor-pointer active:scale-95 shadow-md"
                                title={t("removeBanner")}
                              >
                                <Trash className="size-4" weight="bold" />
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-full h-full bg-muted/40" />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/banner:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white font-medium text-xs bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                <UploadSimple className="w-3.5 h-3.5" />
                                {t("uploadBanner")}
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Bottom-Left Logo Box */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          logoInputRef.current?.click();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();
                            logoInputRef.current?.click();
                          }
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDraggingLogo(true);
                        }}
                        onDragLeave={(e) => {
                          e.stopPropagation();
                          setIsDraggingLogo(false);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDraggingLogo(false);
                          const file = e.dataTransfer.files[0];
                          if (file) handleLogoFile(file);
                        }}
                        className={cn(
                          "absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-background border transition-colors cursor-pointer flex items-center justify-center overflow-hidden group/logo shadow-md",
                          (bannerPreview || logoPreview) ? "border-border" : "border-border",
                          isDraggingLogo && "border-primary ring-2 ring-primary/20",
                        )}
                        title={logoPreview ? t("changeLogo") : t("uploadLogo")}
                      >
                        {logoPreview ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={logoPreview}
                              alt="Logo"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center gap-2 pointer-events-none">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  logoInputRef.current?.click();
                                }}
                                className="pointer-events-auto inline-flex size-8 items-center justify-center rounded-full bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white text-white transition-colors cursor-pointer hover:bg-black active:scale-95 shadow-md"
                                title={t("changeLogo")}
                              >
                                <PencilSimple className="size-3.5" weight="bold" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (logoPreview.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
                                  setLogoPreview(null);
                                  setRemoveLogo(true);
                                  if (logoInputRef.current) logoInputRef.current.value = "";
                                }}
                                className="pointer-events-auto inline-flex size-8 items-center justify-center rounded-full bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white hover:bg-destructive text-white transition-colors cursor-pointer active:scale-95 shadow-md"
                                title={t("removeLogo")}
                              >
                                <Trash className="size-3.5" weight="bold" />
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                            <UploadSimple className="size-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </div>

                    <Text color="secondary" className="px-1 mt-0.5">
                      {t("brandMediaDesc")}
                    </Text>
                  </div>

                  {/* Smart Menu & Checkout Feature Toggles */}
                  <div className="flex flex-col gap-4 p-4 border border-border/70 rounded-xl bg-canvas">
                    <div className="flex flex-col gap-0.5">
                      <Heading level={4}>
                        {locale.startsWith("de") ? "Smart Menu & Bezahlung" : "Smart Menu & Payment"}
                      </Heading>
                      <Text color="secondary">
                        {locale.startsWith("de")
                          ? "Datensparsame, automatisierte Verkaufsförderung auf Basis verifizierter Restaurant-Bestellungen."
                          : "Privacy-first, automated sales optimization based on verified venue orders."}
                      </Text>
                    </div>

                    <input type="hidden" name="isUpsellingEnabled" value={String(isUpsellingEnabled)} />
                    <Switch
                      label={locale.startsWith("de") ? "Intelligente Empfehlungen & Upselling" : "Smart Recommendations & Upselling"}
                      description={locale.startsWith("de")
                        ? "Häufig zusammen bestellte Artikel und kleine Zusatzartikel vor der Zahlung vorschlagen."
                        : "Recommend frequently ordered together items and small add-ons before checkout."}
                      value={isUpsellingEnabled}
                      onChange={setIsUpsellingEnabled}
                      labelPosition="start"
                      labelSpacing="spread"
                      width="100%"
                    />

                    <Divider />

                    <input type="hidden" name="isTippingEnabled" value={String(isTippingEnabled)} />
                    <Switch
                      label={locale.startsWith("de") ? "Freiwilliges Trinkgeld" : "Voluntary Tipping"}
                      description={locale.startsWith("de")
                        ? "Trinkgeld-Auswahl im Bezahlprozess anbieten (100 % für das Team, 0 % Zackisch-Gebühr)."
                        : "Offer tipping at checkout (100% to venue, 0% Zackisch fee)."}
                      value={isTippingEnabled}
                      onChange={setIsTippingEnabled}
                      labelPosition="start"
                      labelSpacing="spread"
                      width="100%"
                    />

                    <Divider />

                    <input type="hidden" name="isPopularCategoryEnabled" value={String(isPopularCategoryEnabled)} />
                    <Switch
                      label={locale.startsWith("de") ? "Kategorie „Beliebteste“" : "Category 'Most Popular'"}
                      description={locale.startsWith("de")
                        ? "Automatisch generierte Bestseller-Kategorie ganz oben in der Speisekarte anzeigen."
                        : "Display an automatically generated bestsellers category at the top of the menu."}
                      value={isPopularCategoryEnabled}
                      onChange={setIsPopularCategoryEnabled}
                      labelPosition="start"
                      labelSpacing="spread"
                      width="100%"
                    />
                  </div>

                  {businessState.error && (
                    <Banner status="error" title={businessState.error} />
                  )}

                  <div className="pt-2 w-full mt-auto">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      label={t("save")}
                      isLoading={isBusinessPending}
                      isDisabled={isBusinessPending}
                      width="100%"
                    />
                  </div>
                </div>

                {/* Stripe Settings Column / Panel */}
                <div className="h-full flex flex-col justify-between gap-4 p-5 border border-border/70 rounded-xl bg-canvas">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <Heading level={4}>{t("stripeSettings")}</Heading>
                        {!business.stripeOnboardingComplete && (
                          business.stripeAccountId ? (
                            <Badge
                              variant="warning"
                              label={t("stripeOnboardingIncomplete" as any)}
                            />
                          ) : (
                            <Badge
                              variant="neutral"
                              label={t("stripeNotConnected")}
                            />
                          )
                        )}
                      </div>

                      <Text color="secondary">
                        {business.stripeOnboardingComplete
                          ? t("stripeConnectedDesc" as any)
                          : t("stripeDescription" as any)}
                      </Text>
                    </div>

                    {business.stripeAccountId && (
                      <div className="bg-muted/40 p-3 rounded-lg border border-border text-xs flex flex-col gap-1">
                        <Text weight="medium">{t("stripeAccountIdLabel" as any)}</Text>
                        <code className="font-mono text-muted-foreground select-all break-all text-[11px]">
                          {business.stripeAccountId}
                        </code>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 pt-2 mt-auto">
                    <Button
                      type="button"
                      variant={business.stripeOnboardingComplete ? "secondary" : "primary"}
                      label={business.stripeOnboardingComplete
                        ? t("openStripeDashboard" as any)
                        : business.stripeAccountId
                        ? t("continueOnboarding" as any)
                        : t("connectStripeWithIban" as any)}
                      isLoading={isStripeLoading}
                      isDisabled={isStripeLoading}
                      width="100%"
                      onClick={async () => {
                        const newTab = window.open("about:blank", "_blank");
                        setIsStripeLoading(true);
                        try {
                          if (business.stripeOnboardingComplete) {
                            const res = await createStripeDashboardLinkAction(business.$id);
                            if (res.url) {
                              if (newTab) {
                                newTab.location.href = res.url;
                              } else {
                                window.open(res.url, "_blank");
                              }
                            } else {
                              if (newTab) newTab.close();
                              toast.error(res.error || t("error"));
                            }
                          } else {
                            const res = await connectStripeAction(business.$id);
                            if (res.url) {
                              if (newTab) {
                                newTab.location.href = res.url;
                              } else {
                                window.open(res.url, "_blank");
                              }
                            } else {
                              if (newTab) newTab.close();
                              toast.error(res.error || t("error"));
                            }
                          }
                        } catch (err: any) {
                          if (newTab) newTab.close();
                          toast.error(err?.message || t("error"));
                        } finally {
                          setIsStripeLoading(false);
                        }
                      }}
                    />

                    <StripeEmbeddedPortal
                      businessId={business.$id}
                      stripeAccountId={business.stripeAccountId}
                      stripeOnboardingComplete={business.stripeOnboardingComplete}
                    />

                    {process.env.NODE_ENV === "development" && !business.stripeOnboardingComplete && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        label={t("testOnboardingHelper" as any)}
                        isDisabled={isStripeLoading}
                        onClick={async () => {
                          setIsStripeLoading(true);
                          try {
                            const res = await completeTestStripeOnboardingAction(business.$id);
                            if (res.success) {
                              toast.success(t("stripeConnectedSuccessfully" as any));
                            } else {
                              toast.error(res.error || t("error"));
                            }
                          } finally {
                            setIsStripeLoading(false);
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Card>

        {/* Self-Service Setup Wizard & B2B Monthly Fee Statements */}
        <SetupAndBillingPanel business={business} userEmail={user.email} userName={user.name} />

        {/* Danger Zone */}
        <Card elevation="low" variant="default" padding={4} className="border-destructive/40">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between pb-3 border-b border-destructive/20">
              <div className="flex items-center gap-2">
                <Heading level={3} className="text-destructive">
                  {t("dangerZone" as any)}
                </Heading>
                <InfoTooltip content={t("dangerZoneDescription" as any)} />
              </div>
            </div>

            <div className="grid grid-cols-1 @min-[600px]:grid-cols-2 gap-6">
              <div className="h-full flex flex-col justify-between gap-4 p-5 border border-border/70 rounded-xl bg-canvas">
                <div className="flex flex-col gap-1">
                  <Heading level={4}>{t("logoutAllDevices")}</Heading>
                  <Text color="secondary">
                    {t("logoutAllDevicesDescription")}
                  </Text>
                </div>
                <Button
                  variant="secondary"
                  label={t("logoutAllDevices")}
                  isLoading={isLoggingOutAll}
                  isDisabled={isLoggingOutAll}
                  width="100%"
                  onClick={async () => {
                    setIsLoggingOutAll(true);
                    try {
                      await logoutAllDevicesAction();
                    } catch (error) {
                      setIsLoggingOutAll(false);
                    }
                  }}
                />
              </div>

              <div className="h-full flex flex-col justify-between gap-4 p-5 border border-border/70 rounded-xl bg-canvas">
                <div className="flex flex-col gap-1">
                  <Heading level={4}>{t("changeEmailAddress" as any)}</Heading>
                  <Text color="secondary">
                    {t("changeEmailDescription" as any)}
                  </Text>
                </div>
                <Button
                  variant="secondary"
                  label={t("changeEmailButton" as any)}
                  isLoading={isEmailChanging}
                  isDisabled={isEmailChanging}
                  width="100%"
                  onClick={async () => {
                    setIsEmailChanging(true);
                    try {
                      const res = await requestEmailChangeAction();
                      if (res?.error) {
                        toast.error(res.error);
                      } else {
                        toast.success(t("changeEmailRequestSent" as any));
                      }
                    } finally {
                      setIsEmailChanging(false);
                    }
                  }}
                />
              </div>
            </div>

            <div className="w-full flex flex-col justify-between gap-4 p-5 border border-destructive/30 rounded-xl bg-canvas">
              <div className="flex flex-col gap-1">
                <Heading level={4} className="text-destructive">{t("deleteAccount")}</Heading>
                <Text color="secondary">
                  {t("deleteAccountDescription")}
                </Text>
              </div>
              <Button
                variant="destructive"
                label={t("requestDeletion")}
                isLoading={isDeleting}
                isDisabled={isDeleting}
                icon={<WarningCircle className="size-4" weight="bold" />}
                width="100%"
                onClick={async () => {
                  setIsDeleting(true);
                  try {
                    const res = await requestAccountDeletionAction();
                    if (res?.error) {
                      toast.error(res.error);
                    } else {
                      toast.success(t("deletionRequestSent"));
                    }
                  } finally {
                    setIsDeleting(false);
                  }
                }}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
