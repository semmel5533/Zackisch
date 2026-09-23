"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash,
  CaretUp,
  CaretDown,
  DotsSixVertical,
  PencilSimple,
  Info,
  Check,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { CustomizationStep, CustomizationOption } from "@/lib/types";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface CustomizationBuilderProps {
  steps: CustomizationStep[];
  onChange: (steps: CustomizationStep[]) => void;
  itemAvailable?: boolean;
}

function generateId() {
  return crypto.randomUUID();
}

export function CustomizationBuilder({
  steps,
  onChange,
  itemAvailable = true,
}: CustomizationBuilderProps) {
  const { t } = useTranslation();
  const [autoEditStepId, setAutoEditStepId] = useState<string | null>(null);
  const [autoEditOptionId, setAutoEditOptionId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = steps.findIndex((s) => s.id === active.id);
      const newIndex = steps.findIndex((s) => s.id === over.id);
      onChange(
        arrayMove(steps, oldIndex, newIndex).map((s, i) => ({
          ...s,
          sortOrder: i,
        })),
      );
    }
  };

  const addStep = () => {
    const newStepId = generateId();
    const newStep: CustomizationStep = {
      id: newStepId,
      name: t("newStep"),
      nameEn: "",
      minSelections: 1,
      maxSelections: 1,
      includedCount: 1,
      available: itemAvailable,
      sortOrder: steps.length,
      options: [],
    };
    setAutoEditStepId(newStepId);
    onChange([...steps, newStep]);
  };

  const updateStep = (stepId: string, updates: Partial<CustomizationStep>) => {
    if (itemAvailable === false && updates.available === true) return;
    onChange(
      steps.map((s) => {
        if (s.id !== stepId) return s;
        if (updates.available !== undefined && !updates.options) {
          const updatedOptions = s.options.map((o) => ({
            ...o,
            available: updates.available!,
          }));
          return { ...s, ...updates, options: updatedOptions };
        }
        return { ...s, ...updates };
      }),
    );
  };

  const removeStep = (stepId: string) => {
    const updated: CustomizationStep[] = [];
    for (const s of steps) {
      if (s.id !== stepId) {
        updated.push({ ...s, sortOrder: updated.length });
      }
    }
    onChange(updated);
  };

  const addOption = (stepId: string) => {
    const step = steps.find((s) => s.id === stepId);
    if (!step) return;
    const newOptionId = generateId();
    const newOption: CustomizationOption = {
      id: newOptionId,
      name: t("newOption"),
      nameEn: "",
      extraPrice: 0,
      available: itemAvailable && (step.available ?? true),
      sortOrder: step.options.length,
    };
    setAutoEditOptionId(newOptionId);
    updateStep(stepId, { options: [...step.options, newOption] });
  };

  const updateOption = (
    stepId: string,
    optionId: string,
    updates: Partial<CustomizationOption>,
  ) => {
    const step = steps.find((s) => s.id === stepId);
    if (!step) return;
    if (
      (itemAvailable === false || step.available === false) &&
      updates.available === true
    )
      return;
    updateStep(stepId, {
      options: step.options.map((o) =>
        o.id === optionId ? { ...o, ...updates } : o,
      ),
    });
  };

  const removeOption = (stepId: string, optionId: string) => {
    const step = steps.find((s) => s.id === stepId);
    if (!step) return;
    const updatedOptions: CustomizationOption[] = [];
    for (const o of step.options) {
      if (o.id !== optionId) {
        updatedOptions.push({ ...o, sortOrder: updatedOptions.length });
      }
    }
    updateStep(stepId, { options: updatedOptions });
  };

  return (
    <div className="flex flex-col gap-4">
      {steps.length > 0 ? (
        <DndContext
          id="customization-steps-dnd"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={steps.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-4">
              {steps.map((step, index) => (
                <SortableStepCard
                  key={step.id || `step-${index}`}
                  step={step}
                  stepIndex={index}
                  totalSteps={steps.length}
                  itemAvailable={itemAvailable}
                  autoEditStepName={autoEditStepId === step.id}
                  autoEditOptionId={autoEditOptionId}
                  onEditStepComplete={() => setAutoEditStepId(null)}
                  onEditOptionComplete={() => setAutoEditOptionId(null)}
                  onUpdate={(updates) => updateStep(step.id, updates)}
                  onRemove={() => removeStep(step.id)}
                  onAddOption={() => addOption(step.id)}
                  onUpdateOption={(optionId, updates) =>
                    updateOption(step.id, optionId, updates)
                  }
                  onRemoveOption={(optionId) => removeOption(step.id, optionId)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="p-6 text-center border border-dashed border-border/80 rounded-xl bg-muted/20">
          <p className="text-sm text-muted-foreground font-medium">
            {t("noStepsAdded")}
          </p>
        </div>
      )}

      <Button
        type="button"
        variant="ghost"
        onClick={addStep}
        className="w-full h-11 rounded-full border border-dashed border-border hover:border-foreground/30 bg-card hover:bg-muted/40 text-foreground font-semibold text-sm gap-2 transition-colors active:scale-[0.98] flex items-center justify-center cursor-pointer"
      >
        <Plus className="w-4 h-4 shrink-0 text-foreground" weight="bold" />
        <span>{t("addStep")}</span>
      </Button>
    </div>
  );
}

interface StepCardProps {
  step: CustomizationStep;
  stepIndex: number;
  totalSteps: number;
  itemAvailable?: boolean;
  autoEditStepName?: boolean;
  autoEditOptionId?: string | null;
  onEditStepComplete?: () => void;
  onEditOptionComplete?: () => void;
  onUpdate: (updates: Partial<CustomizationStep>) => void;
  onRemove: () => void;
  onAddOption: () => void;
  onUpdateOption: (
    optionId: string,
    updates: Partial<CustomizationOption>,
  ) => void;
  onRemoveOption: (optionId: string) => void;
}

function SortableStepCard({
  step,
  stepIndex,
  totalSteps,
  itemAvailable = true,
  autoEditStepName = false,
  autoEditOptionId,
  onEditStepComplete,
  onEditOptionComplete,
  onUpdate,
  onRemove,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
}: StepCardProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditingName, setIsEditingName] = useState(autoEditStepName);

  const finishEditingName = () => {
    setIsEditingName(false);
    onEditStepComplete?.();
  };

  // Sync isEditingName when autoEditStepName changes (render-time update)
  const [prevAutoEditStepName, setPrevAutoEditStepName] =
    useState(autoEditStepName);
  if (autoEditStepName !== prevAutoEditStepName) {
    setPrevAutoEditStepName(autoEditStepName);
    if (autoEditStepName) {
      setIsEditingName(true);
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: step.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const [minVal, setMinVal] = useState(() => (step.minSelections ?? 0).toString());
  const [maxVal, setMaxVal] = useState(() => (step.maxSelections ?? 1).toString());
  const [incVal, setIncVal] = useState(() => (step.includedCount ?? 0).toString());

  // Sync props to local state if they change externally
  useEffect(() => {
    setMinVal((step.minSelections ?? 0).toString());
    setMaxVal((step.maxSelections ?? 1).toString());
    setIncVal((step.includedCount ?? 0).toString());
  }, [step.minSelections, step.maxSelections, step.includedCount]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-card flex flex-col border border-border/80 rounded-xl overflow-hidden hover:border-border transition-colors"
    >
      {/* Step Header */}
      <div
        className={cn(
          "flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 p-3 sm:p-4 bg-card cursor-pointer select-none transition-colors border-b border-border/40",
          !isExpanded && "border-b-0",
        )}
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
      >
        {/* Line 1: Drag handle, Caret, Step Name / Rename Input, Pencil */}
        <div className="flex items-center gap-2 flex-1 min-w-0 w-full">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1.5 -m-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <DotsSixVertical
              className="w-4 h-4 shrink-0"
              weight="bold"
            />
          </div>
          <CaretDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0",
              isExpanded ? "rotate-0" : "-rotate-90",
            )}
            weight="bold"
          />
          <div
            role="presentation"
            className="flex items-center gap-2 flex-1 min-w-0"
            onMouseDown={(e) => isEditingName && e.stopPropagation()}
          >
            {isEditingName ? (
              <div
                className="flex items-center gap-1.5 flex-1 w-full"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <Input
                  autoFocus
                  value={step.name}
                  onChange={(e) => onUpdate({ name: e.target.value })}
                  onFocus={(e) => e.target.select()}
                  onBlur={finishEditingName}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === "Enter") finishEditingName();
                    if (e.key === "Escape") finishEditingName();
                  }}
                  maxLength={100}
                  className="h-8 text-sm font-medium bg-background border-input text-foreground px-2.5 rounded-lg flex-1 min-w-0"
                  placeholder={t("stepName")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    finishEditingName();
                  }}
                  className="h-8 w-8 text-foreground hover:text-foreground hover:bg-muted rounded-lg shrink-0 transition-colors"
                  title={t("save")}
                >
                  <Check
                    className="w-4 h-4 text-foreground"
                    weight="bold"
                  />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 min-w-0 group flex-1">
                <span className="font-semibold text-sm sm:text-base truncate text-foreground">
                  {step.name || t("stepName")}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-70 sm:opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingName(true);
                  }}
                  title={t("edit")}
                >
                  <PencilSimple className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Controls (sm and above: single row) */}
        <div
          className="hidden sm:flex items-center gap-2.5 sm:gap-3 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 sm:gap-2.5">
            <Badge className="w-6 h-6 min-w-6 aspect-square rounded-full p-0 flex items-center justify-center bg-primary text-secondary font-bold text-xs shrink-0 font-inter tabular-nums leading-none">
              {step.options.length}
            </Badge>
            <Switch
              checked={step.available ?? true}
              disabled={itemAvailable === false}
              onCheckedChange={(checked) => onUpdate({ available: checked })}
              className="shrink-0"
            />
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
            title={t("delete")}
          >
            <Trash className="w-4 h-4" weight="bold" />
          </Button>
        </div>

        {/* Mobile Controls (below sm: clean second row with full space) */}
        <div
          className="flex sm:hidden items-center justify-between pt-2 border-t border-border/40 w-full shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <Badge className="w-5 h-5 min-w-5 aspect-square rounded-full p-0 flex items-center justify-center bg-primary text-secondary font-bold text-[11px] shrink-0 font-inter tabular-nums leading-none">
              {step.options.length}
            </Badge>
            <span>{step.options.length === 1 ? t("option") : t("options")}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Switch
              checked={step.available ?? true}
              disabled={itemAvailable === false}
              onCheckedChange={(checked) => onUpdate({ available: checked })}
              className="shrink-0"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
              title={t("delete")}
            >
              <Trash className="w-4 h-4" weight="bold" />
            </Button>
          </div>
        </div>
      </div>

      {/* Step Content */}
      {isExpanded && (
        <div className="p-3 sm:p-4 flex flex-col gap-3.5 bg-muted/15">
          {/* Step Settings - Single 3-column row on all screen sizes */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`step-min-${step.id}`}
                className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1"
              >
                {t("minSelections")}
                <TooltipProvider delay={200}>
                  <Tooltip>
                    <TooltipTrigger className="hidden sm:inline-flex items-center">
                      <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">{t("minSelectionsDesc" as any)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </label>
              <Input
                id={`step-min-${step.id}`}
                type="number"
                min={0}
                max={99}
                value={minVal}
                onChange={(e) => {
                  setMinVal(e.target.value);
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) {
                    let newMax = parseInt(maxVal) || 0;
                    if (val > newMax) {
                      newMax = val;
                      setMaxVal(newMax.toString());
                    }
                    onUpdate({ minSelections: val, maxSelections: newMax });
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value === "") {
                    setMinVal("0");
                    onUpdate({ minSelections: 0 });
                  }
                }}
                className="w-full text-center bg-background border-input text-foreground placeholder:text-muted-foreground h-9 sm:h-8 font-inter tabular-nums rounded-lg font-medium"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`step-max-${step.id}`}
                className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1"
              >
                {t("maxSelections")}
                <TooltipProvider delay={200}>
                  <Tooltip>
                    <TooltipTrigger className="hidden sm:inline-flex items-center">
                      <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">{t("maxSelectionsDesc" as any)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </label>
              <Input
                id={`step-max-${step.id}`}
                type="number"
                min={1}
                max={99}
                value={maxVal}
                onChange={(e) => {
                  setMaxVal(e.target.value);
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) {
                    let newMin = parseInt(minVal) || 0;
                    if (val < newMin) {
                      newMin = val;
                      setMinVal(newMin.toString());
                    }
                    onUpdate({ maxSelections: val, minSelections: newMin });
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value === "") {
                    setMaxVal("1");
                    onUpdate({ maxSelections: 1 });
                  }
                }}
                className="w-full text-center bg-background border-input text-foreground placeholder:text-muted-foreground h-9 sm:h-8 font-inter tabular-nums rounded-lg font-medium"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`step-inc-${step.id}`}
                className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1"
              >
                {t("includedInPrice")}
                <TooltipProvider delay={200}>
                  <Tooltip>
                    <TooltipTrigger className="hidden sm:inline-flex items-center">
                      <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">
                        {t("includedInPriceDesc" as any)}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </label>
              <Input
                id={`step-inc-${step.id}`}
                type="number"
                min={0}
                max={99}
                value={incVal}
                onChange={(e) => {
                  setIncVal(e.target.value);
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) {
                    onUpdate({ includedCount: val });
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value === "") {
                    setIncVal("0");
                    onUpdate({ includedCount: 0 });
                  }
                }}
                className="w-full text-center bg-background border-input text-foreground placeholder:text-muted-foreground h-9 sm:h-8 font-inter tabular-nums rounded-lg font-medium"
              />
            </div>
          </div>

          <Separator className="bg-zinc-100" />

          {/* Options */}
          <div className="flex flex-col gap-2.5">
            <span className="text-sm font-bold uppercase tracking-wider text-foreground">
              {t("options")}
            </span>
            {step.options.length === 0 ? (
              <p className="text-sm text-muted-foreground py-3 text-center">
                {t("noOptions")}
              </p>
            ) : (
              <DndContext
                id={`step-options-dnd-${step.id}`}
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => {
                  const { active, over } = event;
                  if (over && active.id !== over.id) {
                    const oldIndex = step.options.findIndex(
                      (o) => o.id === active.id,
                    );
                    const newIndex = step.options.findIndex(
                      (o) => o.id === over.id,
                    );
                    onUpdate({
                      options: arrayMove(step.options, oldIndex, newIndex).map(
                        (o, i) => ({ ...o, sortOrder: i }),
                      ),
                    });
                  }
                }}
              >
                <SortableContext
                  items={step.options.map((o) => o.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-2">
                    {step.options.map((option, optIndex) => (
                      <OptionRow
                        key={option.id || `opt-${optIndex}`}
                        option={option}
                        optionIndex={optIndex}
                        disabled={
                          itemAvailable === false || step.available === false
                        }
                        autoFocusName={autoEditOptionId === option.id}
                        onEditComplete={onEditOptionComplete}
                        onUpdate={(updates) =>
                          onUpdateOption(option.id, updates)
                        }
                        onRemove={() => onRemoveOption(option.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
            <Button
              type="button"
              variant="ghost"
              className="w-full h-11 rounded-full border border-dashed border-border hover:border-foreground/30 bg-background hover:bg-muted/40 text-foreground font-semibold text-sm gap-2 transition-colors active:scale-[0.98] flex items-center justify-center cursor-pointer"
              onClick={onAddOption}
            >
              <Plus className="w-4 h-4 shrink-0 text-foreground" weight="bold" />
              <span>{t("addOption")}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

interface OptionRowProps {
  option: CustomizationOption;
  optionIndex: number;
  disabled?: boolean;
  autoFocusName?: boolean;
  onEditComplete?: () => void;
  onUpdate: (updates: Partial<CustomizationOption>) => void;
  onRemove: () => void;
}

function OptionRow({
  option,
  optionIndex,
  disabled = false,
  autoFocusName = false,
  onEditComplete,
  onUpdate,
  onRemove,
}: OptionRowProps) {
  const { t } = useTranslation();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: option.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-xl border border-border/80 bg-background hover:border-foreground/25 hover:bg-muted/20 transition-colors duration-150"
    >
      {/* Name line (Full width on mobile, flex-1 on desktop) */}
      <div className="flex items-center gap-2 w-full sm:flex-1 min-w-0">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing shrink-0 focus-visible:outline-none p-1.5 -m-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <DotsSixVertical
            className="w-4 h-4 shrink-0"
            weight="bold"
          />
        </div>
        <Input
          autoFocus={autoFocusName}
          value={option.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          onFocus={(e) => e.target.select()}
          onBlur={onEditComplete}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.nativeEvent.isComposing) return;
            if (e.key === "Enter") onEditComplete?.();
            if (e.key === "Escape") onEditComplete?.();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          placeholder={t("optionName")}
          maxLength={100}
          className="h-9 sm:h-8 text-sm bg-background border-input hover:border-foreground/30 focus-visible:border-foreground text-foreground placeholder:text-muted-foreground rounded-lg flex-1 min-w-0"
        />
      </div>

      {/* Controls line: Price + Switch + Delete (Inline on desktop, single 2nd line on mobile) */}
      <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3 w-full sm:w-auto shrink-0">
        {/* Price Input */}
        <div className="relative flex-1 sm:flex-initial sm:w-28">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-semibold select-none pointer-events-none">
            +
          </span>
          <Input
            type="number"
            step="0.01"
            min="0"
            max="99999"
            value={
              option.extraPrice === 0
                ? ""
                : (Math.round(option.extraPrice) / 100).toFixed(2)
            }
            onChange={(e) => {
              const val = e.target.value;
              if (val.length > 8) return;
              onUpdate({
                extraPrice: val ? Math.round(parseFloat(val) * 100) : 0,
              });
            }}
            placeholder="0.00"
            className="h-9 sm:h-8 text-sm pl-6 pr-6 bg-background border-input hover:border-foreground/30 focus-visible:border-foreground text-foreground placeholder:text-muted-foreground w-full font-inter tabular-nums rounded-lg text-right sm:text-left"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium select-none pointer-events-none">
            €
          </span>
        </div>

        {/* Switch */}
        <Switch
          checked={option.available ?? true}
          disabled={disabled}
          onCheckedChange={(checked) => onUpdate({ available: checked })}
          className="shrink-0"
        />

        {/* Delete Icon Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
          title={t("delete")}
        >
          <Trash className="w-4 h-4" weight="bold" />
        </Button>
      </div>
    </div>
  );
}
