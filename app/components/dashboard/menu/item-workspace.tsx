"use client";

import { CheckboxInput } from "@astryxdesign/core/CheckboxInput";
import { DIETARY_LABELS, DIETARY_LABEL_KEYS, type DietaryLabel } from "@/lib/dietary-labels";
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog";
import { Layout, LayoutContent, LayoutFooter } from "@astryxdesign/core/Layout";
import { Button } from "@astryxdesign/core/Button";
import { TextInput } from "@astryxdesign/core/TextInput";
import { TextArea } from "@astryxdesign/core/TextArea";
import { Switch } from "@astryxdesign/core/Switch";
import { Selector } from "@astryxdesign/core/Selector";
import { Divider } from "@astryxdesign/core/Divider";
import {
  CircleNotch,
  SlidersHorizontal,
  Sparkle,
  ImageSquare,
  Info,
} from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n";
import { toast } from "@/components/common/toast";
import { ImageUpload } from "./image-upload";
import { CustomizationBuilder } from "./customization-builder";

import {
  createMenuItemAction,
  updateMenuItemAction,
} from "@/actions/menu-actions";
import type { MenuItem, MenuCategory, CustomizationStep } from "@/lib/types";

interface ItemWorkspaceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: MenuItem | null;
  categories: MenuCategory[];
  selectedCategoryId: string;
  businessId: string;
}

export function ItemWorkspace({
  open,
  onOpenChange,
  editingItem,
  categories,
  selectedCategoryId,
  businessId,
}: ItemWorkspaceProps) {
  const { t, locale } = useTranslation();

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [categoryId, setCategoryId] = useState(selectedCategoryId);
  const categoryIdRef = useRef(selectedCategoryId);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [dietaryLabels, setDietaryLabels] = useState<DietaryLabel[]>([]);
  const selectedFileRef = useRef<File | null>(null);
  const removeImageRef = useRef(false);
  const [enableCustomizations, setEnableCustomizations] = useState(false);
  const [customizationSteps, setCustomizationSteps] = useState<
    CustomizationStep[]
  >([]);

  const [errors, setErrors] = useState<{ name?: string; price?: string }>({});

  // Reset or initialize state when workspace opens
  // react-doctor-ignore react-doctor/no-adjust-state-on-prop-change
  useEffect(() => {
    if (open) {
      setErrors({});
      setIsSubmitting(false);
      if (editingItem) {
        const catId = editingItem.categoryId;
        setCategoryId(catId);
        categoryIdRef.current = catId;
        setName(editingItem.name);
        setDescription(editingItem.description || "");
        setDietaryLabels(editingItem.dietaryLabels ?? []);
        setPrice((Math.round(editingItem.price) / 100).toFixed(2));
        selectedFileRef.current = null;
        removeImageRef.current = false;

        try {
          const parsed = JSON.parse(editingItem.customizations || "[]");
          if (Array.isArray(parsed) && parsed.length > 0) {
            const sanitized = parsed.map((step, i) => ({
              ...step,
              id: step.id || `step_${Date.now()}_${i}`,
              options: (step.options || []).map((opt: any, j: number) => ({
                ...opt,
                id: opt.id || `opt_${Date.now()}_${i}_${j}`,
                extraPrice: Math.round(Number(opt.extraPrice ?? opt.priceAdjustment ?? 0)),
              })),
            }));
            setCustomizationSteps(sanitized);
            setEnableCustomizations(true);
          } else {
            setCustomizationSteps([]);
            setEnableCustomizations(false);
          }
        } catch {
          setCustomizationSteps([]);
          setEnableCustomizations(false);
        }
      } else {
        const initialCat = selectedCategoryId || (categories[0]?.$id ?? "");
        setCategoryId(initialCat);
        categoryIdRef.current = initialCat;
        setName("");
        setDescription("");
        setDietaryLabels([]);
        setPrice("");
        selectedFileRef.current = null;
        removeImageRef.current = false;
        setCustomizationSteps([]);
        setEnableCustomizations(false);
      }
    }
  }, [open, editingItem, selectedCategoryId, categories]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Auth-style client validation
    const newErrors: { name?: string; price?: string } = {};
    if (!name.trim()) {
      newErrors.name = t("validationItemName");
    } else if (name.trim().length > 100) {
      newErrors.name = t("nameTooLong");
      toast.error(t("nameTooLong"));
    }
    if (description && description.length > 500) {
      toast.error(t("descTooLong"));
      return;
    }
    const normalizedPrice = price.trim().replace(",", ".");
    const parsedPrice = parseFloat(normalizedPrice);
    if (!normalizedPrice || isNaN(parsedPrice) || parsedPrice < 0) {
      newErrors.price = t("validationItemPrice");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const formData = new FormData();

    formData.append("businessId", businessId);
    formData.append("categoryId", categoryId || categoryIdRef.current);
    formData.append("name", name.trim());
    formData.append("description", description);
    dietaryLabels.forEach(label => formData.append("dietaryLabels", label));
    formData.append("price", normalizedPrice);
    formData.append("taxRate", "19.0");
    formData.append(
      "available",
      String(editingItem ? editingItem.available : true),
    );

    if (editingItem) {
      formData.append("itemId", editingItem.$id);
      formData.append("existingImageId", editingItem.imageId || "");
      if (removeImageRef.current) {
        formData.append("removeImage", "true");
      }
    }

    if (selectedFileRef.current) {
      formData.append("image", selectedFileRef.current);
    }

    const finalSteps = enableCustomizations ? customizationSteps : [];
    formData.append("customizations", JSON.stringify(finalSteps));

    setIsSubmitting(true);
    try {
      const action = editingItem ? updateMenuItemAction : createMenuItemAction;
      const res = await action({}, formData);
      if (res?.errorKey) {
        toast.error(t(res.errorKey));
      } else if (res?.error) {
        toast.error(res.error);
      } else if (res?.success) {
        onOpenChange(false);
      }
    } catch {
      toast.error(t("databaseError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={open}
      onOpenChange={(newOpen) => {
        if (!isSubmitting) {
          onOpenChange(newOpen);
        }
      }}
      width={560}
      purpose="form"
    >
      <Layout
        header={
          <DialogHeader
            title={editingItem ? t("editItem") : t("addItem")}
            onOpenChange={(newOpen) => {
              if (!isSubmitting) {
                onOpenChange(newOpen);
              }
            }}
          />
        }
        content={
          <LayoutContent>
            <form
              id="workspace-item-form"
              noValidate
              onSubmit={handleSubmit}
              className="flex-1 flex flex-col min-h-0 overflow-y-auto"
            >
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* SECTION 1: DETAILS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Left Column (Bild) */}
                  <div className="flex flex-col gap-2 h-full">
                    <div className="flex items-center justify-between shrink-0">
                      <span className="text-sm font-bold text-foreground">
                        {t("imageSection")}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        {t("itemImageRecommended")}
                      </span>
                    </div>
                    <ImageUpload
                      className="w-full flex-1 min-h-[220px] h-[240px] md:h-full"
                      existingImageId={editingItem?.imageId}
                      onFileSelect={(file) => {
                        selectedFileRef.current = file;
                        removeImageRef.current = false;
                      }}
                      onRemoveExisting={() => {
                        removeImageRef.current = true;
                        selectedFileRef.current = null;
                      }}
                    />
                  </div>

                  {/* Right Column (Details) */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground">
                        {t("itemDetails")}
                      </span>
                    </div>

                    {/* Category Select */}
                    <Selector
                      label={t("category")}
                      isRequired
                      value={categoryId}
                      onChange={(val) => {
                        if (val) {
                          setCategoryId(val);
                          categoryIdRef.current = val;
                        }
                      }}
                      options={categories.map((cat) => ({
                        label: cat.name,
                        value: cat.$id,
                      }))}
                      width="100%"
                    />

                    <TextInput
                      label={t("itemName")}
                      isRequired
                      value={name}
                      onChange={(val) => {
                        setName(val.slice(0, 100));
                        if (errors.name)
                          setErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                      placeholder={t("itemNamePlaceholder")}
                      status={
                        errors.name
                          ? { type: "error", message: errors.name }
                          : undefined
                      }
                      width="100%"
                    />

                    <TextArea
                      label={t("description")}
                      value={description}
                      onChange={setDescription}
                      placeholder={t("itemDescPlaceholder")}
                      rows={3}
                      maxLength={500}
                      width="100%"
                    />

                    <fieldset aria-describedby="ws-dietary-help" className="space-y-2">
                      <legend className="text-sm font-semibold text-foreground">
                        {t("dietaryLabelsTitle")}
                      </legend>
                      <p id="ws-dietary-help" className="text-sm text-muted-foreground">
                        {t("dietaryLabelsHelp")}
                      </p>
                      <div className="flex flex-wrap gap-x-5 gap-y-2">
                        {DIETARY_LABELS.map((label) => (
                          <CheckboxInput
                            key={label}
                            label={t(DIETARY_LABEL_KEYS[label])}
                            value={dietaryLabels.includes(label)}
                            isDisabled={isSubmitting}
                            onChange={(checked) =>
                              setDietaryLabels((current) =>
                                checked
                                  ? [...current, label]
                                  : current.filter((value) => value !== label),
                              )
                            }
                          />
                        ))}
                      </div>
                    </fieldset>

                    <TextInput
                      label={t("basePrice")}
                      isRequired
                      value={price}
                      onChange={(val) => {
                        if (val === "") {
                          setPrice("");
                          if (errors.price)
                            setErrors((prev) => ({ ...prev, price: undefined }));
                          return;
                        }
                        const separators = val.match(/[.,]/g);
                        if (separators && separators.length > 1) return;
                        if (!/^[\d]*[.,]?[\d]*$/.test(val)) return;
                        if (val.length > 10) return;

                        setPrice(val);
                        if (errors.price)
                          setErrors((prev) => ({ ...prev, price: undefined }));
                      }}
                      onBlur={() => {
                        if (!price.trim()) return;
                        const normalized = price.trim().replace(",", ".");
                        const num = parseFloat(normalized);
                        if (!isNaN(num) && num >= 0) {
                          const formatted = num.toFixed(2);
                          setPrice(
                            price.includes(",")
                              ? formatted.replace(".", ",")
                              : formatted,
                          );
                        }
                      }}
                      placeholder="0.00"
                      status={
                        errors.price
                          ? { type: "error", message: errors.price }
                          : undefined
                      }
                      width="100%"
                    />
                  </div>
                </div>

                <Divider />

                {/* SECTION 2: ZUSAMMENSTELLUNG & PRESETS */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-muted/30 border border-border/70">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-background border border-border/80 flex items-center justify-center shrink-0">
                        <SlidersHorizontal className="w-5 h-5 text-foreground" weight="bold" />
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                        <span className="text-sm font-bold text-foreground">
                          {t("customization")}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium line-clamp-2 sm:line-clamp-none">
                          {t("customizationDesc")}
                        </span>
                      </div>
                    </div>
                    <Switch
                      value={enableCustomizations}
                      onChange={setEnableCustomizations}
                      label=""
                      isLabelHidden
                      aria-label={t("customization")}
                    />
                  </div>

                  {enableCustomizations && (
                    <div className="space-y-4 pt-1">
                      <CustomizationBuilder
                        steps={customizationSteps}
                        onChange={setCustomizationSteps}
                        itemAvailable={editingItem ? editingItem.available : true}
                      />
                    </div>
                  )}
                </div>
              </div>
            </form>
          </LayoutContent>
        }
        footer={
          <LayoutFooter>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-border/40 w-full">
              <Button
                variant="secondary"
                size="lg"
                label={t("cancel")}
                isDisabled={isSubmitting}
                onClick={() => onOpenChange(false)}
              />
              <Button
                variant="primary"
                size="lg"
                type="submit"
                form="workspace-item-form"
                label={isSubmitting ? t("saving") : t("save")}
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
              />
            </div>
          </LayoutFooter>
        }
      />
    </Dialog>
  );
}
