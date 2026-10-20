"use client";

import React, { useState } from "react";
import Image from "next/image";
import { formatEuro } from "@/lib/calculator";
import type { Locale } from "@/lib/content/site-data";

interface SignatureDemoProps {
  locale: Locale;
}

type VenueMode = "table" | "counter" | "pickup";
type DemoStep = "qr" | "guest" | "staff" | "ledger";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  isPopular?: boolean;
  image: string;
  modifiers?: Array<{ name: string; price: number }>;
}

const DEMO_MENUS: Record<
  VenueMode,
  {
    venueName: string;
    venueSub: string;
    targetLabel: string;
    items: MenuItem[];
    recommendedAddon: { id: string; name: string; price: number; reason: string };
  }
> = {
  table: {
    venueName: "Trattoria & Bar Gusto",
    venueSub: "Tisch 04 · Am Platz bestellen",
    targetLabel: "Tisch 04",
    items: [
      {
        id: "pinsa-margherita",
        name: "Pinsa Romana Margherita",
        category: "Klassiker",
        price: 12.5,
        description: "Fior di Latte, San Marzano Tomaten, frisches Basilikum",
        isPopular: true,
        image: "/media/food-plated.webp",
        modifiers: [
          { name: "Mit Burrata (+2,50 €)", price: 2.5 },
          { name: "Extra Basilikum (+0,50 €)", price: 0.5 },
        ],
      },
      {
        id: "lemonade",
        name: "Hausgemachte Zitronenlimonade",
        category: "Getränke",
        price: 4.2,
        description: "Frisch gepresste Bio-Zitronen, Minze, wenig Rohrzucker",
        image: "/media/food-coffee.webp",
      },
      {
        id: "tiramisu",
        name: "Hausgemachtes Tiramisu",
        category: "Dessert",
        price: 6.5,
        description: "Nach traditionellem Familienrezept mit Savoiardi",
        image: "/media/food-coffee.webp",
      },
    ],
    recommendedAddon: {
      id: "garlic-dip",
      name: "Trüffel-Knoblauch-Dip",
      price: 1.8,
      reason: "Wird oft zur Pinsa bestellt",
    },
  },
  counter: {
    venueName: "Café Monnem",
    venueSub: "Theke · Barista Express",
    targetLabel: "Tresen Express",
    items: [
      {
        id: "flat-white",
        name: "Flat White (Doppelter Ristretto)",
        category: "Kaffee",
        price: 4.1,
        description: "Bio-Espressobohnen, cremiger Mikroschaum",
        isPopular: true,
        image: "/media/food-coffee.webp",
        modifiers: [
          { name: "Mit Bio-Hafermilch (+0,50 €)", price: 0.5 },
          { name: "Extra Shot (+1,20 €)", price: 1.2 },
        ],
      },
      {
        id: "croissant",
        name: "Buttercroissant aus der Backstube",
        category: "Gebäck",
        price: 2.6,
        description: "Frisch gebacken, zartblättrig mit französischer Butter",
        image: "/media/food-coffee.webp",
      },
    ],
    recommendedAddon: {
      id: "cantuccini",
      name: "Hausgemachte Mandel-Cantuccini",
      price: 1.5,
      reason: "Häufig zusammen mit Flat White",
    },
  },
  pickup: {
    venueName: "Street Food Lab",
    venueSub: "Abholung #42 · Counter Pick-up",
    targetLabel: "Abholung #42",
    items: [
      {
        id: "smash-burger",
        name: "Smash Burger Spezial",
        category: "Burger",
        price: 11.8,
        description: "Zweifach gesmashtes Regional-Beef, Cheddar, hausgemachte Sauce",
        isPopular: true,
        image: "/media/pos-counter.webp",
        modifiers: [
          { name: "Extra Cheddar (+1,20 €)", price: 1.2 },
          { name: "Jalapeños (+0,80 €)", price: 0.8 },
        ],
      },
      {
        id: "fries",
        name: "Süßkartoffel-Pommes",
        category: "Beilagen",
        price: 4.5,
        description: "Knusprig gebacken mit Meersalz und Rosmarin",
        image: "/media/food-plated.webp",
      },
    ],
    recommendedAddon: {
      id: "dip-mayo",
      name: "Trüffel-Mayonnaise",
      price: 1.2,
      reason: "Passt perfekt zu den Pommes",
    },
  },
};

export function SignatureDemo({ locale }: SignatureDemoProps) {
  const isDe = locale === "de-de";
  const [mode, setMode] = useState<VenueMode>("table");
  const [step, setStep] = useState<DemoStep>("qr");

  // Sold out items controlled by staff
  const [soldOutItems, setSoldOutItems] = useState<Record<string, boolean>>({
    tiramisu: false,
    lemonade: false,
  });

  // Sold out modifiers
  const [soldOutModifiers, setSoldOutModifiers] = useState<Record<string, boolean>>({
    "Mit Burrata (+2,50 €)": false,
    "Mit Bio-Hafermilch (+0,50 €)": false,
  });

  // Guest order state
  const [cart, setCart] = useState<
    Array<{ id: string; name: string; price: number; quantity: number }>
  >([]);
  const [includeAddon, setIncludeAddon] = useState(false);
  const [selectedModifier, setSelectedModifier] = useState<string | null>(null);
  const [tipPercent, setTipPercent] = useState<number>(0); // 0% default!
  const [orderPaid, setOrderPaid] = useState(false);
  const [posTransferred, setPosTransferred] = useState(false);

  const currentMenu = DEMO_MENUS[mode];

  // Cart total calculations
  const itemsTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const addonTotal = includeAddon ? currentMenu.recommendedAddon.price : 0;
  const foodSubtotal = itemsTotal + addonTotal;
  const tipAmount = (foodSubtotal * tipPercent) / 100;
  const grandTotal = foodSubtotal + tipAmount;

  // Zackisch 2% platform fee ONLY on foodSubtotal (excluding tip!)
  const zackischFee = foodSubtotal * 0.02;
  const stripeFee = foodSubtotal > 0 ? grandTotal * 0.015 + 0.25 : 0;
  const netMerchantProceeds = grandTotal - zackischFee - stripeFee;

  const handleAddToCart = (item: MenuItem) => {
    if (soldOutItems[item.id]) return;
    let price = item.price;
    let name = item.name;
    if (selectedModifier) {
      const mod = item.modifiers?.find((m) => m.name === selectedModifier);
      if (mod && !soldOutModifiers[mod.name]) {
        price += mod.price;
        name += ` (${mod.name})`;
      }
    }
    setCart((prev) => {
      const existing = prev.find((i) => i.name === name);
      if (existing) {
        return prev.map((i) => (i.name === name ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { id: item.id, name, price, quantity: 1 }];
    });
  };

  const handleSimulatePayment = () => {
    if (cart.length === 0 && !includeAddon) return;
    setOrderPaid(true);
    setStep("staff");
  };

  const handleResetDemo = () => {
    setCart([]);
    setIncludeAddon(false);
    setSelectedModifier(null);
    setTipPercent(0);
    setOrderPaid(false);
    setPosTransferred(false);
    setStep("qr");
  };

  return (
    <div className="w-full bg-[#FAF9F6] border border-[#E5E5E2] rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm transition-all duration-300">
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E5E5E2]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#E5E5E2] text-[#111111] mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {isDe ? "Live-Simulation ohne Backend" : "Live Simulation (In-Memory)"}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#111111]">
            {isDe ? "Eine Bestellung. Drei Perspektiven." : "One Order. Three Perspectives."}
          </h3>
          <p className="text-sm text-[#646464] mt-0.5">
            {isDe
              ? "Wähle ein Lokal-Konzept und navigiere durch den gesamten Ablauf."
              : "Select a venue concept and explore the synchronized workflow."}
          </p>
        </div>

        {/* Venue Concept Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E5E5E2] rounded-2xl self-start md:self-auto">
          <button
            type="button"
            onClick={() => {
              setMode("table");
              handleResetDemo();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mode === "table"
                ? "bg-[#111111] text-white shadow-sm"
                : "text-[#646464] hover:text-[#111111]"
            }`}
          >
            {isDe ? "Restaurant & Bar" : "Restaurant & Bar"}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("counter");
              handleResetDemo();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mode === "counter"
                ? "bg-[#111111] text-white shadow-sm"
                : "text-[#646464] hover:text-[#111111]"
            }`}
          >
            {isDe ? "Café & Theke" : "Café & Counter"}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("pickup");
              handleResetDemo();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mode === "pickup"
                ? "bg-[#111111] text-white shadow-sm"
                : "text-[#646464] hover:text-[#111111]"
            }`}
          >
            {isDe ? "Imbiss & Abholung" : "Quick-Service / Takeaway"}
          </button>
        </div>
      </div>

      {/* Synchronized Stepper Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-6">
        <button
          type="button"
          onClick={() => setStep("qr")}
          className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all ${
            step === "qr"
              ? "bg-white border-[#111111] shadow-sm ring-1 ring-[#111111]"
              : "bg-white/60 border-[#E5E5E2] text-[#646464] hover:bg-white"
          }`}
        >
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#111111] text-white text-xs font-bold">
            1
          </span>
          <div>
            <div className="text-xs font-bold text-[#111111]">
              {isDe ? "QR-Aufsteller" : "1. QR Code"}
            </div>
            <div className="text-[11px] text-[#646464] hidden sm:block">
              {isDe ? "Scan simulieren" : "Simulate scan"}
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setStep("guest")}
          className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all ${
            step === "guest"
              ? "bg-white border-[#111111] shadow-sm ring-1 ring-[#111111]"
              : "bg-white/60 border-[#E5E5E2] text-[#646464] hover:bg-white"
          }`}
        >
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#111111] text-white text-xs font-bold">
            2
          </span>
          <div>
            <div className="text-xs font-bold text-[#111111]">
              {isDe ? "Gast-Smartphone" : "2. Guest Mobile"}
            </div>
            <div className="text-[11px] text-[#646464] hidden sm:block">
              {isDe ? "Menü & Checkout" : "Menu & pay"}
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setStep("staff")}
          className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all ${
            step === "staff"
              ? "bg-white border-[#111111] shadow-sm ring-1 ring-[#111111]"
              : "bg-white/60 border-[#E5E5E2] text-[#646464] hover:bg-white"
          }`}
        >
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#111111] text-white text-xs font-bold">
            3
          </span>
          <div>
            <div className="text-xs font-bold text-[#111111]">
              {isDe ? "Personal-Tablet" : "3. Staff Tablet"}
            </div>
            <div className="text-[11px] text-[#646464] hidden sm:block">
              {isDe ? "Küche & Ausverkauft" : "Prep & 86 toggle"}
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setStep("ledger")}
          className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all ${
            step === "ledger"
              ? "bg-white border-[#111111] shadow-sm ring-1 ring-[#111111]"
              : "bg-white/60 border-[#E5E5E2] text-[#646464] hover:bg-white"
          }`}
        >
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#111111] text-white text-xs font-bold">
            4
          </span>
          <div>
            <div className="text-xs font-bold text-[#111111]">
              {isDe ? "Betreiber-Ledger" : "4. Owner Ledger"}
            </div>
            <div className="text-[11px] text-[#646464] hidden sm:block">
              {isDe ? "Getrenntes Trinkgeld" : "Separate tips"}
            </div>
          </div>
        </button>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative bg-white rounded-3xl border border-[#E5E5E2] overflow-hidden min-h-[520px] p-6 sm:p-8">
        {/* STEP 1: PHYSICAL QR STAND */}
        {step === "qr" && (
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-4">
            <div className="max-w-md">
              <span className="text-xs font-bold uppercase tracking-wider text-[#646464]">
                {isDe ? "Perspektive 1 · Der physische Anker" : "Perspective 1 · The Physical Anchor"}
              </span>
              <h4 className="text-2xl sm:text-3xl font-bold text-[#111111] mt-2">
                {isDe
                  ? "Ein Scan genügt. Ohne App-Download."
                  : "A single scan. No app download needed."}
              </h4>
              <p className="text-sm text-[#52525B] mt-3 leading-relaxed">
                {isDe
                  ? "Der Gast sitzt am Tisch oder steht an der Theke. Ein dezenter, ansprechender QR-Aufsteller führt direkt in dein digitales Menü im mobilen Browser."
                  : "Guests arrive at the table or counter. An elegant QR stand directs them straight to your digital menu in their mobile browser."}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep("guest")}
                  className="px-6 py-3 rounded-full bg-[#111111] text-white text-sm font-semibold hover:bg-black transition-all flex items-center gap-2 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  {isDe ? "QR-Scan simulieren" : "Simulate QR Scan"}
                </button>
                <span className="text-xs text-[#646464]">
                  {isDe ? "Keine Kamera erforderlich" : "No camera permissions required"}
                </span>
              </div>
            </div>

            {/* Simulated 3D-like Stand Graphic */}
            <div className="relative w-full max-w-sm aspect-[4/5] bg-gradient-to-b from-[#F7F7F8] to-[#EBEBEB] rounded-3xl p-6 flex flex-col items-center justify-between border border-[#E5E5E2] shadow-md">
              <div className="w-full flex items-center justify-between">
                <div className="text-xs font-bold tracking-tight text-[#111111]">
                  {currentMenu.venueName}
                </div>
                <div className="text-[11px] font-semibold text-[#646464]">
                  {currentMenu.targetLabel}
                </div>
              </div>

              {/* QR Emblem */}
              <div className="p-5 bg-white rounded-2xl border border-[#E5E5E2] shadow-sm flex flex-col items-center cursor-pointer hover:scale-105 transition-transform" onClick={() => setStep("guest")}>
                <Image
                  src="/branding/combination_mark.svg"
                  alt="Zackisch QR"
                  width={160}
                  height={50}
                  className="mb-3 h-8 w-auto"
                />
                <div className="w-36 h-36 bg-[#111111] rounded-xl flex items-center justify-center p-2">
                  {/* Styled QR graphic representation */}
                  <div className="w-full h-full bg-white rounded-lg p-2 grid grid-cols-5 gap-1">
                    <div className="bg-[#111111] col-span-2 row-span-2 rounded" />
                    <div className="bg-[#111111]" />
                    <div className="bg-[#111111] col-span-2 row-span-2 rounded" />
                    <div className="bg-[#111111]" />
                    <div className="bg-[#111111] col-span-3 row-span-1" />
                    <div className="bg-[#111111] col-span-2 row-span-2 rounded" />
                    <div className="bg-[#111111]" />
                    <div className="bg-[#111111]" />
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#111111] mt-3">
                  {isDe ? "Hier scannen & bestellen" : "Scan here to order"}
                </span>
              </div>

              <div className="text-[11px] text-center text-[#646464]">
                {isDe
                  ? "Druckfertige Vorlagen im Betreiber-Dashboard"
                  : "Print-ready templates in merchant dashboard"}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: GUEST SMARTPHONE VIEW */}
        {step === "guest" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E2]">
                <div>
                  <h4 className="text-xl font-bold text-[#111111]">
                    {currentMenu.venueName}
                  </h4>
                  <p className="text-xs text-[#646464]">{currentMenu.venueSub}</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  {isDe ? "Tisch geöffnet" : "Open Table"}
                </span>
              </div>

              {/* Menu items list */}
              <div className="space-y-3">
                {currentMenu.items.map((item) => {
                  const isSoldOut = soldOutItems[item.id];
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isSoldOut
                          ? "bg-stone-50 border-stone-200 opacity-60"
                          : "bg-white border-[#E5E5E2] hover:border-[#111111] shadow-xs"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#111111]">
                              {item.name}
                            </span>
                            {item.isPopular && !isSoldOut && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F4F4F5] text-[#111111]">
                                {isDe ? "Beliebt" : "Popular"}
                              </span>
                            )}
                            {isSoldOut && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                                {isDe ? "Ausverkauft" : "Sold Out"}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#646464] mt-1 leading-relaxed">
                            {item.description}
                          </p>
                          <div className="font-bold text-sm text-[#111111] mt-2 font-mono">
                            {formatEuro(item.price, locale === "de-de" ? "de" : "en", 2)}
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={isSoldOut}
                          onClick={() => handleAddToCart(item)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            isSoldOut
                              ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                              : "bg-[#111111] text-white hover:bg-black shadow-xs active:scale-95"
                          }`}
                        >
                          {isSoldOut
                            ? isDe ? "Ausverkauft" : "Sold Out"
                            : isDe ? "+ Hinzufügen" : "+ Add"}
                        </button>
                      </div>

                      {/* Modifiers for item */}
                      {item.modifiers && !isSoldOut && (
                        <div className="mt-3 pt-3 border-t border-dashed border-[#E5E5E2] flex flex-wrap gap-2 items-center">
                          <span className="text-[11px] text-[#646464] font-medium">
                            {isDe ? "Option:" : "Modifier:"}
                          </span>
                          {item.modifiers.map((mod) => {
                            const modDisabled = soldOutModifiers[mod.name];
                            return (
                              <button
                                key={mod.name}
                                type="button"
                                disabled={modDisabled}
                                onClick={() =>
                                  setSelectedModifier(
                                    selectedModifier === mod.name ? null : mod.name
                                  )
                                }
                                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                                  modDisabled
                                    ? "bg-stone-100 text-stone-400 border-stone-200 line-through cursor-not-allowed"
                                    : selectedModifier === mod.name
                                    ? "bg-[#111111] text-white border-[#111111]"
                                    : "bg-white text-[#111111] border-[#E5E5E2] hover:border-[#111111]"
                                }`}
                              >
                                {mod.name}
                                {modDisabled && (
                                  <span className="ml-1 text-[10px] text-rose-600 font-bold">
                                    ({isDe ? "Aus" : "86"})
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Smart Cart Add-on recommendation */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 mt-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <span>✨</span>
                    {isDe ? "Wird oft zusammen bestellt:" : "Frequently paired together:"}
                  </div>
                  <div className="text-xs font-medium text-amber-800 mt-0.5">
                    {currentMenu.recommendedAddon.name} (+
                    {formatEuro(
                      currentMenu.recommendedAddon.price,
                      locale === "de-de" ? "de" : "en",
                      2
                    )}
                    )
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIncludeAddon(!includeAddon)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    includeAddon
                      ? "bg-amber-800 text-white"
                      : "bg-white border border-amber-300 text-amber-900 hover:bg-amber-100"
                  }`}
                >
                  {includeAddon
                    ? isDe ? "Dazu gewählt ✓" : "Added ✓"
                    : isDe ? "+ Dazunehmen" : "+ Add"}
                </button>
              </div>
            </div>

            {/* Simulated Checkout Sheet */}
            <div className="lg:col-span-5 bg-stone-50 rounded-2xl border border-[#E5E5E2] p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E2]">
                <h5 className="font-bold text-sm text-[#111111]">
                  {isDe ? "Warenkorb & Kasse" : "Cart & Checkout"}
                </h5>
                <span className="text-xs text-[#646464] font-mono">
                  {cart.reduce((s, i) => s + i.quantity, 0) + (includeAddon ? 1 : 0)}{" "}
                  {isDe ? "Artikel" : "items"}
                </span>
              </div>

              {/* Items in cart */}
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {cart.length === 0 && !includeAddon ? (
                  <p className="text-xs text-[#646464] italic py-4 text-center">
                    {isDe
                      ? "Warenkorb ist noch leer. Wähle ein Gericht links aus."
                      : "Cart is empty. Select an item on the left."}
                  </p>
                ) : (
                  <>
                    {cart.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between text-xs py-1"
                      >
                        <span className="text-[#111111]">
                          {item.quantity}× {item.name}
                        </span>
                        <span className="font-mono font-bold text-[#111111]">
                          {formatEuro(
                            item.price * item.quantity,
                            locale === "de-de" ? "de" : "en",
                            2
                          )}
                        </span>
                      </div>
                    ))}
                    {includeAddon && (
                      <div className="flex items-center justify-between text-xs py-1 text-amber-900">
                        <span>1× {currentMenu.recommendedAddon.name} (Add-on)</span>
                        <span className="font-mono font-bold">
                          {formatEuro(
                            currentMenu.recommendedAddon.price,
                            locale === "de-de" ? "de" : "en",
                            2
                          )}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Tip Selection (0% Default!) */}
              <div className="pt-3 border-t border-[#E5E5E2]">
                <div className="flex items-center justify-between text-xs font-semibold text-[#111111] mb-2">
                  <span>{isDe ? "Freiwilliges Trinkgeld" : "Voluntary Tip"}</span>
                  <span className="text-[11px] text-[#646464]">
                    {isDe ? "0 % Voreinstellung" : "0% default"}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 5, 10, 15].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setTipPercent(pct)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                        tipPercent === pct
                          ? "bg-[#111111] text-white"
                          : "bg-white border border-[#E5E5E2] text-[#646464] hover:border-[#111111]"
                      }`}
                    >
                      {pct === 0 ? (isDe ? "Kein" : "None") : `${pct} %`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Summary */}
              <div className="pt-3 border-t border-[#E5E5E2] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#646464]">
                  <span>{isDe ? "Speisen & Getränke" : "Food & Beverage"}</span>
                  <span className="font-mono">
                    {formatEuro(foodSubtotal, locale === "de-de" ? "de" : "en", 2)}
                  </span>
                </div>
                <div className="flex justify-between text-[#646464]">
                  <span>{isDe ? "Freiwilliges Trinkgeld" : "Voluntary Tip"}</span>
                  <span className="font-mono">
                    {formatEuro(tipAmount, locale === "de-de" ? "de" : "en", 2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#111111] pt-1 border-t border-[#E5E5E2]">
                  <span>{isDe ? "Gesamtbetrag" : "Total Amount"}</span>
                  <span className="font-mono">
                    {formatEuro(grandTotal, locale === "de-de" ? "de" : "en", 2)}
                  </span>
                </div>
              </div>

              {/* Payment trigger */}
              <button
                type="button"
                disabled={foodSubtotal === 0}
                onClick={handleSimulatePayment}
                className={`w-full py-3 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 ${
                  foodSubtotal === 0
                    ? "bg-stone-300 text-stone-500 cursor-not-allowed"
                    : "bg-[#111111] text-white hover:bg-black active:scale-98"
                }`}
              >
                <span>💳</span>
                {isDe ? "Zahlung simulieren (Apple Pay / Karte)" : "Simulate Payment (Apple Pay / Card)"}
              </button>
              <p className="text-[10px] text-center text-[#646464]">
                {isDe
                  ? "Reine Simulation: Es werden keine echten Kartendaten oder Zahlungen erhoben."
                  : "Pure simulation: No real credit card or payment transaction executed."}
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: STAFF TABLET & 86 AVAILABILITY */}
        {step === "staff" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E2]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {isDe ? "Perspektive 2 · Personal-Tablet" : "Perspective 2 · Staff Tablet"}
                </span>
                <h4 className="text-xl sm:text-2xl font-bold text-[#111111] mt-1.5">
                  {isDe
                    ? "Bestellung bezahlt eingetroffen"
                    : "Paid Order Received Live"}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep("ledger")}
                  className="px-4 py-2 rounded-xl bg-[#111111] text-white text-xs font-bold hover:bg-black transition-all"
                >
                  {isDe ? "Zum Betreiber-Ledger →" : "View Owner Ledger →"}
                </button>
              </div>
            </div>

            {/* Live Order Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-white border-2 border-emerald-500 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-bold text-sm text-[#111111]">
                      {currentMenu.targetLabel}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {isDe ? "BEZAHLT (Stripe)" : "PAID (Stripe)"}
                  </span>
                </div>

                <div className="text-xs text-[#646464] border-b border-[#E5E5E2] pb-2">
                  Ticket #ZK-8921 · vor 12 Sekunden eingetroffen
                </div>

                {/* Items breakdown */}
                <div className="space-y-1.5 py-1 text-xs">
                  {cart.length > 0 ? (
                    cart.map((item) => (
                      <div key={item.name} className="flex justify-between font-semibold">
                        <span>
                          {item.quantity}× {item.name}
                        </span>
                        <span className="font-mono">
                          {formatEuro(
                            item.price * item.quantity,
                            locale === "de-de" ? "de" : "en",
                            2
                          )}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-between font-semibold">
                      <span>1× Pinsa Romana Margherita (Demo)</span>
                      <span className="font-mono">12,50 €</span>
                    </div>
                  )}
                  {includeAddon && (
                    <div className="flex justify-between font-semibold text-amber-900">
                      <span>1× {currentMenu.recommendedAddon.name}</span>
                      <span className="font-mono">
                        {formatEuro(
                          currentMenu.recommendedAddon.price,
                          locale === "de-de" ? "de" : "en",
                          2
                        )}
                      </span>
                    </div>
                  )}
                  {tipAmount > 0 && (
                    <div className="flex justify-between text-[#646464] pt-1 border-t border-dashed border-[#E5E5E2]">
                      <span>{isDe ? "Trinkgeld (Personal)" : "Tip (Staff)"}</span>
                      <span className="font-mono">
                        {formatEuro(tipAmount, locale === "de-de" ? "de" : "en", 2)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Manual POS booking confirmation */}
                <div className="pt-3 border-t border-[#E5E5E2]">
                  <button
                    type="button"
                    onClick={() => setPosTransferred(!posTransferred)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      posTransferred
                        ? "bg-emerald-700 text-white"
                        : "bg-white border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white"
                    }`}
                  >
                    <span>✓</span>
                    {posTransferred
                      ? isDe
                        ? "In vorhandene Kasse gebucht ✓"
                        : "Recorded in POS register ✓"
                      : isDe
                      ? "In vorhandene Kasse übertragen"
                      : "Transfer to existing POS"}
                  </button>
                  <p className="text-[10px] text-[#646464] mt-1 text-center">
                    {isDe
                      ? "Ein Tastendruck am Kassensystem genügt. Kein API-Zwang."
                      : "One manual keystroke in existing POS. No complex API needed."}
                  </p>
                </div>
              </div>

              {/* The 86 / Sold out toggle showcase */}
              <div className="p-5 rounded-2xl bg-[#F7F7F8] border border-[#E5E5E2] space-y-4">
                <div>
                  <h5 className="font-bold text-sm text-[#111111]">
                    {isDe
                      ? "Ausverkauft-Schalter (Zutaten & Gerichte)"
                      : "Instant 86 List (Items & Ingredients)"}
                  </h5>
                  <p className="text-xs text-[#646464] mt-1">
                    {isDe
                      ? "Deaktiviere hier Optionen, wenn Zutaten ausgehen. Das Gast-Menü reagiert sofort."
                      : "Toggle items off when ingredients run low. Guest menus update in real time."}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E5E5E2]">
                    <div>
                      <div className="font-bold text-xs text-[#111111]">
                        Hausgemachte Zitronenlimonade
                      </div>
                      <div className="text-[11px] text-[#646464]">
                        {isDe ? "Ganzes Getränk sperren" : "Disable whole drink"}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setSoldOutItems((prev) => ({
                          ...prev,
                          lemonade: !prev.lemonade,
                        }))
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        soldOutItems.lemonade
                          ? "bg-rose-600 text-white"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {soldOutItems.lemonade
                        ? isDe ? "Ausverkauft" : "Sold Out"
                        : isDe ? "Verfügbar" : "Available"}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E5E5E2]">
                    <div>
                      <div className="font-bold text-xs text-[#111111]">
                        Burrata (Pinsa-Extra)
                      </div>
                      <div className="text-[11px] text-[#646464]">
                        {isDe ? "Einzelne Zutat deaktivieren" : "Disable single modifier"}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setSoldOutModifiers((prev) => ({
                          ...prev,
                          "Mit Burrata (+2,50 €)": !prev["Mit Burrata (+2,50 €)"],
                        }))
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        soldOutModifiers["Mit Burrata (+2,50 €)"]
                          ? "bg-rose-600 text-white"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {soldOutModifiers["Mit Burrata (+2,50 €)"]
                        ? isDe ? "Ausverkauft" : "Sold Out"
                        : isDe ? "Verfügbar" : "Available"}
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900 leading-relaxed">
                  💡 {isDe
                    ? "Wechsle zurück zu Schritt 2: Deaktivierte Artikel sind für Gäste sofort gesperrt!"
                    : "Switch back to Step 2: Disabled items are blocked for guests immediately!"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: OWNER FINANCIAL LEDGER */}
        {step === "ledger" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E2]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  {isDe ? "Perspektive 3 · Betreiber-Ledger" : "Perspective 3 · Owner Ledger"}
                </span>
                <h4 className="text-xl sm:text-2xl font-bold text-[#111111] mt-1.5">
                  {isDe
                    ? "Saubere Gebührentrennung & Trinkgeld-Schutz"
                    : "Clean Fee Separation & Tip Protection"}
                </h4>
              </div>

              <button
                type="button"
                onClick={handleResetDemo}
                className="px-4 py-2 rounded-xl bg-stone-100 text-[#111111] text-xs font-bold hover:bg-stone-200 transition-all"
              >
                {isDe ? "Demo zurücksetzen ↺" : "Reset Demo ↺"}
              </button>
            </div>

            {/* Financial Ledger Table */}
            <div className="p-6 rounded-2xl bg-[#F7F7F8] border border-[#E5E5E2] space-y-4">
              <div className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                {isDe ? "Abrechnung dieses Beispielvorgangs" : "Settlement for this transaction"}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1.5 border-b border-[#E5E5E2]">
                  <span className="text-[#111111] font-medium">
                    {isDe ? "1. Speisen- & Getränkeumsatz (Netto/Brutto Lokal)" : "1. Food & Beverage Sales"}
                  </span>
                  <span className="font-mono font-bold text-[#111111]">
                    {formatEuro(foodSubtotal || 12.5, locale === "de-de" ? "de" : "en", 2)}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-[#E5E5E2] text-purple-900 bg-purple-50/50 px-2 rounded-lg">
                  <span className="font-medium">
                    {isDe ? "2. Freiwilliges Trinkgeld (100 % für Personal)" : "2. Voluntary Tip (100% to Staff)"}
                  </span>
                  <span className="font-mono font-bold">
                    {formatEuro(tipAmount || 2.0, locale === "de-de" ? "de" : "en", 2)}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-[#E5E5E2] text-[#646464]">
                  <span>
                    {isDe ? "3. Zackisch-Plattformgebühr (2 % auf Speisen, 0 % auf Trinkgeld)" : "3. Zackisch Platform Fee (2% on food, 0% on tip)"}
                  </span>
                  <span className="font-mono text-rose-700 font-bold">
                    -{formatEuro((foodSubtotal || 12.5) * 0.02, locale === "de-de" ? "de" : "en", 2)}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-[#E5E5E2] text-[#646464]">
                  <span>
                    {isDe ? "4. Stripe-Transaktionsgebühr (geschätzt 1,5 % + 0,25 €)" : "4. Stripe Processing Fee (estimated 1.5% + 0.25 €)"}
                  </span>
                  <span className="font-mono text-rose-700 font-bold">
                    -{formatEuro(
                      ((foodSubtotal || 12.5) + (tipAmount || 2.0)) * 0.015 + 0.25,
                      locale === "de-de" ? "de" : "en",
                      2
                    )}
                  </span>
                </div>

                <div className="flex justify-between py-2 pt-3 text-base font-bold text-emerald-800 bg-emerald-50 px-3 rounded-xl border border-emerald-200">
                  <span>{isDe ? "Auszahlung auf dein Bankkonto" : "Net Payout to Your Bank Account"}</span>
                  <span className="font-mono">
                    {formatEuro(
                      (foodSubtotal || 12.5) +
                        (tipAmount || 2.0) -
                        (foodSubtotal || 12.5) * 0.02 -
                        (((foodSubtotal || 12.5) + (tipAmount || 2.0)) * 0.015 + 0.25),
                      locale === "de-de" ? "de" : "en",
                      2
                    )}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#646464] leading-relaxed pt-2">
                {isDe
                  ? "Hinweis: Zackisch zieht seine 2 % Plattformgebühr ausschließlich vom Speisen- und Getränkewert ab. Trinkgelder erreichen dein Team centgenau separat ausgewiesen."
                  : "Note: Zackisch applies its 2% platform fee exclusively to food and drink subtotal. Tips are reported separately for fair staff distribution."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
