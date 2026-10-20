"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/content/site-data";

interface VenueShowcaseProps {
  locale: Locale;
}

export function VenueShowcase({ locale }: VenueShowcaseProps) {
  const isDe = locale === "de-de";

  const venues = [
    {
      id: "restaurants-bars",
      title: isDe ? "Restaurant & Bar" : "Restaurant & Bar",
      tagline: isDe ? "Nachbestellungen ohne Warten" : "Frictionless Reorders",
      description: isDe
        ? "Gäste bestellen die zweite Runde Getränke oder ein Dessert direkt am Tisch, wenn sie Durst haben – nicht erst, wenn die Servicekraft wieder vorbeikommt."
        : "Guests reorder drinks and desserts the moment they want them, rather than waiting for staff to make rounds.",
      highlight: isDe ? "+15 % Getränkeumsatz zu Stoßzeiten" : "+15% beverage sales during peak hours",
      image: "/media/restaurant-interior.webp",
      href: "/solutions/restaurants-bars",
    },
    {
      id: "cafes-bakeries",
      title: isDe ? "Café & Bäckerei" : "Café & Bakery",
      tagline: isDe ? "Tresen entlasten, Tische beleben" : "Relieve Counter Lines",
      description: isDe
        ? "Lange Warteschlangen am Tresen schrecken Laufkundschaft ab. Gäste scannen den Tischaufsteller, wählen ihre Kaffeespezialität mit Hafermilch und zahlen sofort."
        : "Long counter queues discourage takeaway visitors. Guests scan table stands, customize with oat milk, and pay instantly.",
      highlight: isDe ? "Halbierte Wartezeit an der Kasse" : "50% reduced wait times at counter",
      image: "/media/food-coffee.webp",
      href: "/solutions/cafes-bakeries",
    },
    {
      id: "quick-service",
      title: isDe ? "Imbiss & Fast-Casual" : "Fast-Casual & Quick Service",
      tagline: isDe ? "Maximaler Durchsatz im Mittagsansturm" : "Peak Lunch Throughput",
      description: isDe
        ? "Keine Kassenengpässe zur Stoßzeit. Gäste bestellen via Aufsteller oder Thekendisplay, personalisieren ihre Bestellung und holen ihr Essen auf Zuruf ab."
        : "Zero checkout bottlenecks. Customers order via counter displays or table codes, customize items, and pick up when called.",
      highlight: isDe ? "Schnellere Tisch- und Thekendrehung" : "Faster counter and table turnaround",
      image: "/media/pos-counter.webp",
      href: "/solutions/quick-service",
    },
    {
      id: "pickup",
      title: isDe ? "Abholung & To-go" : "Pickup & Takeaway",
      tagline: isDe ? "0 % Fremdgebühren für Vorbestellungen" : "0% Aggregator Commissions",
      description: isDe
        ? "Eigene Vorbestellungen und Selbstabholung ohne 30 % Provision an Lieferportale. Stammgäste bestellen online vor und holen pünktlich im Lokal ab."
        : "Direct customer pickup orders without paying 30% aggregator platform commissions to third-party delivery apps.",
      highlight: isDe ? "Vollständige Margenbeibehaltung" : "Full profit margin retention",
      image: "/media/food-plated.webp",
      href: "/solutions/pickup",
    },
  ];

  const [activeId, setActiveId] = useState("restaurants-bars");
  const activeVenue = venues.find((v) => v.id === activeId) || venues[0];

  return (
    <div className="w-full">
      {/* Venue Selector Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-[#FAF9F6] border border-[#E5E5E2] max-w-2xl mx-auto mb-10">
        {venues.map((v) => {
          const isActive = v.id === activeId;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => setActiveId(v.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-[#111111] text-white shadow-sm"
                  : "text-[#646464] hover:text-[#111111]"
              }`}
            >
              {v.title}
            </button>
          );
        })}
      </div>

      {/* Selected Venue Showcase Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#FAF9F6] border border-[#E5E5E2] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm transition-all">
        {/* Left: Visual Photography Frame */}
        <div className="lg:col-span-6 relative">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E5E5E2] shadow-md bg-stone-100">
            <Image
              src={activeVenue.image}
              alt={activeVenue.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-[#111111] shadow-sm">
                {activeVenue.highlight}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Operational Editorial Context */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#646464]">
              {activeVenue.tagline}
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#111111]">
              {activeVenue.title}
            </h3>
          </div>

          <p className="text-base sm:text-lg text-[#52525B] leading-relaxed">
            {activeVenue.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href={`/${locale}${activeVenue.href}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#111111] text-white text-xs sm:text-sm font-semibold hover:bg-black transition-all shadow-sm"
            >
              <span>{isDe ? "Lösung im Detail ansehen" : "Explore solution details"}</span>
              <span>→</span>
            </Link>
            <span className="text-xs text-[#646464]">
              {isDe ? "Bestehende Kasse bleibt unverändert" : "Existing POS stays intact"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
