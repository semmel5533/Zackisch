"use client";

import { useState, useEffect, useRef, startTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogCloseButton,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CircleNotch,
  SlidersHorizontal,
  Sparkle,
  ImageSquare,
  Info,
} from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n";
import { toast } from "sonner";
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
  organizationId: string;
}

export function ItemWorkspace({
  open,
  onOpenChange,
  editingItem,
  categories,
  selectedCategoryId,
  organizationId,
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
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      newErrors.price = t("validationItemPrice");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const formData = new FormData();

    formData.append("organizationId", organizationId);
    formData.append("categoryId", categoryId || categoryIdRef.current);
    formData.append("name", name.trim());
    formData.append("description", description);
    formData.append("price", price);
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
      if (res?.error) {
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
      open={open}
      onOpenChange={(newOpen) => {
        if (!isSubmitting) {
          onOpenChange(newOpen);
        }
      }}
    >
      <DialogContent className="w-[calc(100%-1.25rem)] sm:w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl h-[92vh] sm:h-[90vh] max-h-[820px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>
            {editingItem ? t("editItem") : t("addItem")}
          </DialogTitle>
          <DialogCloseButton />
        </DialogHeader>

        <form
          id="workspace-item-form"
          noValidate
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col min-h-0 overflow-hidden"
        >
          <ScrollArea className="flex-1 min-h-0 w-full">
            <div className="px-3.5 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5">
              {/* SECTION 1: DETAILS */}
              <div className="space-y-3.5 sm:space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Left Column (Bild) */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground">
                        {t("imageSection")}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        {t("itemImageRecommended")}
                      </span>
                    </div>
                    <ImageUpload
                      className="w-full min-h-[200px] h-[240px] sm:h-[260px]"
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
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm font-semibold text-foreground">
                        {t("category")} <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={categoryId}
                        onValueChange={(val) => {
                          if (val) {
                            setCategoryId(val);
                            categoryIdRef.current = val;
                          }
                        }}
                        items={categories.map((cat) => ({
                          label: cat.name,
                          value: cat.$id,
                        }))}
                      >
                        <SelectTrigger className="w-full bg-background border-input hover:border-foreground/30 focus-visible:border-foreground text-foreground rounded-full h-11 px-4 cursor-pointer transition-all font-semibold active:scale-[0.98]">
                          <SelectValue placeholder={t("category")}>
                            {(value: string | null) =>
                              categories.find((c) => c.$id === value)?.name ||
                              t("category")
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.$id} value={cat.$id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label
                        htmlFor="ws-item-name"
                        className={`text-sm font-semibold ${errors.name ? "text-destructive" : "text-foreground"}`}
                      >
                        {t("itemName")}{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="ws-item-name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name)
                            setErrors((prev) => ({ ...prev, name: undefined }));
                        }}
                        onKeyDown={(e) => e.stopPropagation()}
                        placeholder={t("itemNamePlaceholder")}
                        maxLength={100}
                        className={`h-10 rounded-xl border-input bg-background text-foreground placeholder:text-muted-foreground ${errors.name ? "border-destructive" : ""}`}
                      />
                      {errors.name && (
                        <span className="text-sm text-destructive">
                          {errors.name}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label
                        htmlFor="ws-item-desc"
                        className="text-sm font-semibold text-foreground"
                      >
                        {t("description")}
                      </Label>
                      <Textarea
                        id="ws-item-desc"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={t("itemDescPlaceholder")}
                        rows={3}
                        maxLength={500}
                        className="resize-none rounded-xl border-input bg-background text-foreground placeholder:text-muted-foreground min-h-[88px]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label
                        htmlFor="ws-item-price"
                        className={`text-sm font-semibold flex items-center gap-1.5 ${errors.price ? "text-destructive" : "text-foreground"}`}
                      >
                        <span>{t("basePrice")}</span>
                        <span className="text-destructive">*</span>
                        <TooltipProvider delay={100}>
                          <Tooltip>
                            <TooltipTrigger
                              type="button"
                              className="hidden sm:inline-flex items-center"
                            >
                              <Info
                                className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors cursor-help"
                                weight="fill"
                              />
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-[260px]">
                              <p>{t("basePriceDesc")}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <div className="relative">
                        <Input
                          id="ws-item-price"
                          type="number"
                          step="0.01"
                          min="0"
                          max="99999"
                          value={price}
                          onChange={(e) => {
                            if (e.target.value.length > 10) return;
                            setPrice(e.target.value);
                            if (errors.price)
                              setErrors((prev) => ({
                                ...prev,
                                price: undefined,
                              }));
                          }}
                          placeholder="0.00"
                          className={`pr-8 h-10 rounded-xl border-input bg-background text-foreground placeholder:text-muted-foreground font-inter tabular-nums ${errors.price ? "border-destructive" : ""}`}
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                          €
                        </span>
                      </div>
                      {errors.price && (
                        <span className="text-sm text-destructive">
                          {errors.price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-zinc-100" />

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
                    checked={enableCustomizations}
                    onCheckedChange={setEnableCustomizations}
                    className="shrink-0"
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
          </ScrollArea>

          {/* Fixed Footer Action Buttons */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="w-full sm:flex-1 h-11 rounded-full border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-semibold cursor-pointer"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:flex-1 h-11 rounded-full bg-black text-white hover:bg-zinc-800 font-semibold active:scale-[0.98] transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <CircleNotch
                    className="w-5 h-5 animate-spin mr-2"
                    weight="bold"
                  />
                  {t("saving")}
                </>
              ) : (
                t("save")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
