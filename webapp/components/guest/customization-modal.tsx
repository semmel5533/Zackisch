"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogCloseButton,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, CaretDown, CaretUp } from "@phosphor-icons/react";
import { formatPrice, useTranslation } from "@/lib/i18n";
import { Price } from "@/components/ui/price";
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
  const [selections, setSelections] = useState<Record<string, string[]>>({}); // stepName -> optionNames
  const [highlightedStepNames, setHighlightedStepNames] = useState<Set<string>>(new Set());
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showFooterShadow, setShowFooterShadow] = useState(false);
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

  const updateScrollShadow = () => {
    const el = scrollRef.current;
    if (!el) return;
    const hasScrolled = el.scrollTop > 2;
    const isNotAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight > 8;
    setShowFooterShadow(hasScrolled && isNotAtBottom);
  };

  useEffect(() => {
    setIsDescriptionExpanded(false);
    setShowFooterShadow(false);
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
        
        // Never pre-select any options by default
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

    // Clear error highlight for this step as soon as an option is chosen
    if (!isCurrentlySelected) {
      setHighlightedStepNames((prev) => {
        if (!prev.has(stepName)) return prev;
        const next = new Set(prev);
        next.delete(stepName);
        return next;
      });

      // Auto-scroll to the next step if single-choice and a choice was made
      if (step.maxSelections === 1 && stepIndex < steps.length - 1) {
        setTimeout(() => {
          scrollToStep(stepIndex + 1);
        }, 190);
      }
    }
  };

  const handleAdd = () => {
    // Find all incomplete steps where minimum requirements are not met
    const incompleteSteps = steps.filter((step) => {
      const count = (selections[step.name] || []).length;
      return count < step.minSelections;
    });

    if (incompleteSteps.length > 0) {
      // Highlight all incomplete steps with destructive red badge
      const incompleteNames = new Set(incompleteSteps.map((s) => s.name));
      setHighlightedStepNames(incompleteNames);

      // Scroll smoothly so the first incomplete step is at the top
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[500px] sm:max-w-[500px] md:max-w-[500px] lg:max-w-[500px] bottom-0 top-auto translate-y-0 left-1/2 -translate-x-1/2 sm:bottom-0 sm:top-auto sm:translate-y-0 sm:left-1/2 sm:-translate-x-1/2 rounded-none sm:rounded-none rounded-t-[24px] sm:rounded-t-[24px] rounded-b-none sm:rounded-b-none border-t border-border border-b-0 border-x-0 min-[501px]:border-x h-[92vh] h-[92dvh] max-h-[92dvh] flex flex-col p-0 sm:p-0 gap-0 sm:gap-0 overflow-hidden bg-background text-foreground shadow-2xl">
        {/* Fixed Header */}
        <DialogHeader className="p-5 pb-3.5 border-b border-border shrink-0 bg-background space-y-1.5 text-left relative z-30">
          <div className="flex items-start justify-between gap-3">
            <DialogTitle className="text-xl font-bold min-w-0 flex-1 text-foreground break-words leading-snug">
              {item.name}
            </DialogTitle>
            <DialogCloseButton className="shrink-0 -mr-1 mt-0.5" />
          </div>
          <div>
            <Price
              cents={item.price}
              from={hasPaidCustomizations(item.customizations)}
              className="text-base font-bold text-foreground"
            />
          </div>
          {item.description && (
            <button
              type="button"
              onClick={() => setIsDescriptionExpanded((prev) => !prev)}
              className="text-left w-full group flex items-start justify-between gap-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm cursor-pointer"
              aria-expanded={isDescriptionExpanded}
            >
              <p
                className={cn(
                  "text-xs text-muted-foreground leading-relaxed break-words flex-1 group-hover:text-foreground transition-colors",
                  isDescriptionExpanded ? "line-clamp-none" : "line-clamp-2"
                )}
              >
                {item.description}
              </p>
              <span className="w-7 h-5 flex items-center justify-center shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
                {isDescriptionExpanded ? (
                  <CaretUp className="w-4 h-4" weight="bold" />
                ) : (
                  <CaretDown className="w-4 h-4" weight="bold" />
                )}
              </span>
            </button>
          )}
        </DialogHeader>

        {/* Scrollable Content (Options) */}
        <div
          ref={scrollRef}
          onScroll={updateScrollShadow}
          className="flex-1 min-h-0 overflow-y-auto px-5 pb-5 relative"
        >
          {steps.map((step, stepIdx) => {
            const currentSelections = selections[step.name] || [];
            const isHighlighted = highlightedStepNames.has(step.name);
            const isMulti = step.maxSelections > 1;

            return (
              <div
                key={step.name}
                ref={(el) => {
                  stepRefs.current[stepIdx] = el;
                }}
                className={cn(stepIdx < steps.length - 1 ? "pb-6" : "pb-2")}
              >
                {/* Sticky Step Header */}
                <div
                  style={{ zIndex: 10 + stepIdx }}
                  className="sticky -top-px bg-background py-2.5 -mx-5 px-5 border-b border-border/30 transition-colors"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-semibold text-lg leading-tight text-foreground">{step.name}</h3>
                    <span
                      className={cn(
                        "shrink-0 text-[13px] px-2.5 py-0.5 rounded-full transition-colors duration-200",
                        isHighlighted
                          ? "bg-destructive text-destructive-foreground font-semibold shadow-xs"
                          : "bg-muted text-muted-foreground font-medium"
                      )}
                    >
                      {step.minSelections === 0 &&
                      (!step.maxSelections ||
                        step.maxSelections >= 99 ||
                        step.maxSelections >= step.options.length)
                        ? t("optional")
                        : step.minSelections === step.maxSelections && step.minSelections > 0
                        ? t("chooseExactly" as any, { count: step.minSelections })
                        : step.minSelections > 0
                        ? t("chooseBetween" as any, { min: step.minSelections, max: step.maxSelections })
                        : t("chooseUpTo" as any, { max: step.maxSelections })}
                    </span>
                  </div>
                  {step.includedCount > 0 && (
                    <p className="text-sm text-muted-foreground font-medium mt-0.5">
                      {t("includedFirst" as any, { count: step.includedCount })}
                    </p>
                  )}
                </div>

                {/* Options List */}
                <div className="space-y-2 pt-2.5">
                  {step.options.map((option) => {
                    const isSelected = currentSelections.includes(option.name);
                    const isMaxReached = step.maxSelections > 1 && !isSelected && currentSelections.length >= step.maxSelections;

                    return (
                      <button
                        key={option.name}
                        onClick={() => handleSelect(step.name, option.name)}
                        disabled={isMaxReached}
                        role={isMulti ? "checkbox" : "radio"}
                        aria-checked={isSelected}
                        className={cn(
                          "group w-full flex items-center justify-between px-4 py-3 rounded-[14px] border transition-all text-left select-none",
                          isSelected
                            ? "border-primary bg-primary/[0.04] ring-1 ring-primary text-foreground hover:bg-primary/[0.07] active:scale-[0.985] cursor-pointer"
                            : isMaxReached
                            ? "border-border/40 opacity-40 cursor-not-allowed bg-muted/20 text-muted-foreground"
                            : "border-border/80 bg-card hover:bg-muted/50 hover:border-foreground/25 active:scale-[0.985] cursor-pointer text-foreground hover:shadow-2xs"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                          {isMulti ? (
                            <div
                              className={cn(
                                "w-5 h-5 flex items-center justify-center rounded-[5px] border shrink-0 transition-colors",
                                isSelected
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border bg-background group-hover:border-foreground/40"
                              )}
                            >
                              {isSelected && <Check weight="bold" className="w-3.5 h-3.5 text-primary-foreground" />}
                            </div>
                          ) : (
                            <div
                              className={cn(
                                "w-5 h-5 flex items-center justify-center rounded-full shrink-0 transition-colors",
                                isSelected
                                  ? "border-2 border-primary bg-transparent"
                                  : "border border-border bg-background group-hover:border-foreground/40"
                              )}
                            >
                              {isSelected && (
                                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                              )}
                            </div>
                          )}
                          <span
                            className={cn(
                              "text-sm text-left leading-snug break-words transition-colors",
                              isSelected ? "font-semibold text-foreground" : "font-medium text-foreground"
                            )}
                          >
                            {option.name}
                          </span>
                        </div>
                        {getOptionPrice(option) > 0 && (
                          <Price
                            cents={getOptionPrice(option)}
                            prefix="+"
                            className={cn(
                              "text-sm shrink-0 whitespace-nowrap text-right transition-colors",
                              isSelected
                                ? "font-semibold text-foreground"
                                : "font-semibold text-muted-foreground group-hover:text-foreground/80"
                            )}
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

        {/* Fixed Footer */}
        <div
          className={cn(
            "p-4 border-t border-border shrink-0 bg-background transition-shadow duration-200",
            showFooterShadow && "shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
          )}
        >
          <Button 
            size="lg"
            className="w-full rounded-full font-bold h-12 text-base shadow-md cursor-pointer flex items-center justify-between px-5 bg-primary text-primary-foreground hover:bg-neutral-800 transition-all active:scale-[0.98]" 
            onClick={handleAdd}
          >
            <span>{t("addToCart" as any)}</span>
            <Price cents={calculateTotal()} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
