"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog";
import { Layout, LayoutContent, LayoutFooter } from "@astryxdesign/core/Layout";
import { HStack } from "@astryxdesign/core/HStack";
import { Button } from "@astryxdesign/core/Button";
import { Badge } from "@astryxdesign/core/Badge";
import { Text } from "@astryxdesign/core/Text";
import { Heading } from "@astryxdesign/core/Heading";
import { Check, CaretDown, CaretUp } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n";
import { Price } from "@/components/common/price";
import { DIETARY_LABEL_KEYS } from "@/lib/dietary-labels";
import { cn, hasPaidCustomizations } from "@/lib/utils";
import type { MenuItem, CustomizationStep } from "@/lib/types";

interface CustomizationModalProps {
  item: MenuItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart: (
    item: MenuItem,
    selections: { stepName: string; optionName: string; extraPrice: number }[],
    totalPrice: number
  ) => void;
}

export function CustomizationModal({
  item,
  open,
  onOpenChange,
  onAddToCart,
}: CustomizationModalProps) {
  const { t } = useTranslation();
  const [steps, setSteps] = useState<CustomizationStep[]>([]);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [highlightedStepNames, setHighlightedStepNames] = useState<Set<string>>(new Set());
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToStep = (index: number) => {
    const container = scrollRef.current;
    const targetEl = stepRefs.current[index];
    if (!container || !targetEl) return;

    if (index === 0) {
      container.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    const scrollDelta = targetRect.top - containerRect.top;

    container.scrollTo({
      top: Math.max(0, container.scrollTop + scrollDelta),
      behavior: "smooth",
    });
  };

  useEffect(() => {
    setIsDescriptionExpanded(false);
    setHighlightedStepNames(new Set());
    if (item && item.customizations) {
      try {
        const parsedRaw = JSON.parse(item.customizations);
        const parsed: CustomizationStep[] = parsedRaw.map((step: any) => {
          const min =
            step.minSelections ??
            step.minSelect ??
            (step.required ? 1 : step.type === "singleChoice" ? 1 : 0);
          const max =
            step.maxSelections ??
            step.maxSelect ??
            (step.type === "singleChoice" ? 1 : step.required && min === 1 && !step.maxSelect ? 1 : 99);

          return {
            ...step,
            minSelections: Number(min),
            maxSelections: Number(max),
            includedCount: step.includedCount ?? 0,
          };
        });

        setSteps(parsed);

        const initialSelections: Record<string, string[]> = {};
        parsed.forEach((step) => {
          initialSelections[step.name] = [];
        });
        setSelections(initialSelections);
      } catch (e) {
        setSteps([]);
      }
    } else {
      setSteps([]);
    }
  }, [item, open]);

  if (!item) return null;

  const getOptionPrice = (opt: any): number => {
    if (typeof opt.extraPrice === "number") return opt.extraPrice;
    if (typeof opt.price === "number") return opt.price;
    return 0;
  };

  const calculateTotal = () => {
    let total = item.price;
    steps.forEach((step) => {
      const selectedOptionNames = selections[step.name] || [];
      const selectedOptions = step.options.filter((o) =>
        selectedOptionNames.includes(o.name)
      );

      const sortedOptions = [...selectedOptions].sort(
        (a, b) => getOptionPrice(a) - getOptionPrice(b)
      );

      const payableOptions = sortedOptions.slice(step.includedCount || 0);
      payableOptions.forEach((opt) => {
        total += getOptionPrice(opt);
      });
    });
    return total;
  };

  const handleSelect = (stepName: string, optionName: string) => {
    const stepIndex = steps.findIndex((s) => s.name === stepName);
    const step = steps[stepIndex];
    if (!step) return;

    const currentSelections = selections[stepName] || [];
    const isCurrentlySelected = currentSelections.includes(optionName);

    setSelections((prev) => {
      const current = prev[stepName] || [];
      if (isCurrentlySelected) {
        return { ...prev, [stepName]: current.filter((name) => name !== optionName) };
      } else {
        if (step.maxSelections === 1) {
          return { ...prev, [stepName]: [optionName] };
        }
        if (current.length >= step.maxSelections) {
          return prev;
        }
        return { ...prev, [stepName]: [...current, optionName] };
      }
    });

    if (!isCurrentlySelected) {
      setHighlightedStepNames((prev) => {
        if (!prev.has(stepName)) return prev;
        const next = new Set(prev);
        next.delete(stepName);
        return next;
      });

      if (step.maxSelections === 1 && stepIndex < steps.length - 1) {
        setTimeout(() => {
          scrollToStep(stepIndex + 1);
        }, 190);
      }
    }
  };

  const handleAdd = () => {
    const incompleteSteps = steps.filter((step) => {
      const count = (selections[step.name] || []).length;
      return count < step.minSelections;
    });

    if (incompleteSteps.length > 0) {
      const incompleteNames = new Set(incompleteSteps.map((s) => s.name));
      setHighlightedStepNames(incompleteNames);

      const firstIncompleteIdx = steps.findIndex((s) => s.name === incompleteSteps[0].name);
      if (firstIncompleteIdx !== -1) {
        scrollToStep(firstIncompleteIdx);
      }
      return;
    }

    const finalSelections: { stepName: string; optionName: string; extraPrice: number }[] = [];
    steps.forEach((step) => {
      const selectedOptionNames = selections[step.name] || [];
      const selectedOptions = step.options.filter((o) =>
        selectedOptionNames.includes(o.name)
      );

      const sortedOptions = [...selectedOptions].sort(
        (a, b) => getOptionPrice(a) - getOptionPrice(b)
      );

      sortedOptions.forEach((opt, index) => {
        finalSelections.push({
          stepName: step.name,
          optionName: opt.name,
          extraPrice: index < (step.includedCount || 0) ? 0 : getOptionPrice(opt),
        });
      });
    });
    onAddToCart(item, finalSelections, calculateTotal());
    onOpenChange(false);
  };

  const subtitleNode = (
    <div className="flex items-center gap-2 mt-1">
      <Price
        cents={item.price}
        from={hasPaidCustomizations(item.customizations)}
        className="text-sm font-semibold text-foreground"
      />
      {Boolean(item.dietaryLabels?.length) && (
        <span className="text-xs text-muted-foreground">
          · {item.dietaryLabels!.map((label) => t(DIETARY_LABEL_KEYS[label])).join(" · ")}
        </span>
      )}
    </div>
  );

  return (
    <Dialog isOpen={open} onOpenChange={onOpenChange} width={520} maxHeight="90dvh" purpose="form">
      <Layout
        header={
          <DialogHeader
            title={item.name}
            subtitle={subtitleNode}
            onOpenChange={onOpenChange}
          />
        }
        content={
          <LayoutContent>
            <div ref={scrollRef} className="space-y-6 pt-1 pb-4">
              {item.description && (
                <div className="pb-3 border-b border-border">
                  <button
                    type="button"
                    onClick={() => setIsDescriptionExpanded((prev) => !prev)}
                    className="text-left w-full flex items-start justify-between gap-3 cursor-pointer select-none"
                    aria-expanded={isDescriptionExpanded}
                  >
                    <p
                      className={cn(
                        "text-xs text-muted-foreground leading-relaxed",
                        isDescriptionExpanded ? "line-clamp-none" : "line-clamp-2"
                      )}
                    >
                      {item.description}
                    </p>
                    <span className="shrink-0 text-muted-foreground">
                      {isDescriptionExpanded ? (
                        <CaretUp className="size-4" weight="bold" />
                      ) : (
                        <CaretDown className="size-4" weight="bold" />
                      )}
                    </span>
                  </button>
                </div>
              )}

              {steps.map((step, stepIdx) => {
                const currentSelections = selections[step.name] || [];
                const isHighlighted = highlightedStepNames.has(step.name);
                const isMulti = step.maxSelections > 1;

                const badgeLabel =
                  step.minSelections === 0 &&
                  (!step.maxSelections ||
                    step.maxSelections >= 99 ||
                    step.maxSelections >= step.options.length)
                    ? t("optional")
                    : step.minSelections === step.maxSelections && step.minSelections > 0
                    ? t("chooseExactly" as any, { count: step.minSelections })
                    : step.minSelections > 0
                    ? t("chooseBetween" as any, { min: step.minSelections, max: step.maxSelections })
                    : t("chooseUpTo" as any, { max: step.maxSelections });

                return (
                  <div
                    key={step.name}
                    ref={(el) => {
                      stepRefs.current[stepIdx] = el;
                    }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <Heading level={3}>{step.name}</Heading>
                      <Badge
                        variant={isHighlighted ? "error" : "neutral"}
                        label={badgeLabel}
                      />
                    </div>

                    {step.includedCount > 0 && (
                      <Text type="supporting">
                        {t("includedFirst" as any, { count: step.includedCount })}
                      </Text>
                    )}

                    <div className="space-y-2">
                      {step.options.map((option) => {
                        const isSelected = currentSelections.includes(option.name);
                        const isMaxReached =
                          step.maxSelections > 1 &&
                          !isSelected &&
                          currentSelections.length >= step.maxSelections;

                        return (
                          <button
                            key={option.name}
                            type="button"
                            onClick={() => handleSelect(step.name, option.name)}
                            disabled={isMaxReached}
                            role={isMulti ? "checkbox" : "radio"}
                            aria-checked={isSelected}
                            className={cn(
                              "w-full min-h-11 flex items-center justify-between px-3.5 py-2.5 rounded-lg border transition-colors text-left select-none",
                              isSelected
                                ? "border-primary bg-primary/5 text-foreground font-medium"
                                : isMaxReached
                                ? "border-border/40 opacity-40 cursor-not-allowed bg-muted/20 text-muted-foreground"
                                : "border-border bg-card hover:bg-muted/40 text-foreground cursor-pointer"
                            )}
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                              {isMulti ? (
                                <div
                                  className={cn(
                                    "size-4 flex items-center justify-center rounded-[4px] border shrink-0 transition-colors",
                                    isSelected
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "border-border bg-background"
                                  )}
                                >
                                  {isSelected && (
                                    <Check weight="bold" className="size-3 text-primary-foreground" />
                                  )}
                                </div>
                              ) : (
                                <div
                                  className={cn(
                                    "size-4 flex items-center justify-center rounded-full shrink-0 transition-colors",
                                    isSelected
                                      ? "border-2 border-primary bg-transparent"
                                      : "border border-border bg-background"
                                  )}
                                >
                                  {isSelected && (
                                    <div className="size-2 rounded-full bg-primary" />
                                  )}
                                </div>
                              )}
                              <span className="text-sm leading-snug break-words">
                                {option.name}
                              </span>
                            </div>
                            {getOptionPrice(option) > 0 && (
                              <Price
                                cents={getOptionPrice(option)}
                                prefix="+"
                                className="text-sm font-semibold text-muted-foreground shrink-0"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </LayoutContent>
        }
        footer={
          <LayoutFooter>
            <Button
              label={`${t("addToCart" as any)} · ${(calculateTotal() / 100).toFixed(2).replace(".", ",")} €`}
              variant="primary"
              width="100%"
              size="lg"
              onClick={handleAdd}
            />
          </LayoutFooter>
        }
      />
    </Dialog>
  );
}
