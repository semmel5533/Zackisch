"use client";

import { useState, type ReactNode } from "react";
import { Pause, Play } from "@phosphor-icons/react";

type DemoCopy = {
  demoTitle: string;
  demoVenues: readonly string[];
  pauseLogos: string;
  resumeLogos: string;
};

function DemoLogoMark({ index }: { index: number }): ReactNode {
  switch (index % 6) {
    case 0:
      return (
        <svg
          className="demo-logo-mark"
          viewBox="0 0 28 28"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="14"
            cy="14"
            r="10"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <circle cx="14" cy="14" r="4" fill="currentColor" />
        </svg>
      );
    case 1:
      return (
        <svg
          className="demo-logo-mark"
          viewBox="0 0 28 28"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="4"
            y="4"
            width="9"
            height="9"
            rx="2"
            fill="currentColor"
          />
          <rect
            x="15"
            y="4"
            width="9"
            height="9"
            rx="2"
            stroke="currentColor"
            strokeWidth="2.2"
          />
          <rect
            x="4"
            y="15"
            width="9"
            height="9"
            rx="2"
            stroke="currentColor"
            strokeWidth="2.2"
          />
          <rect
            x="15"
            y="15"
            width="9"
            height="9"
            rx="2"
            fill="currentColor"
          />
        </svg>
      );
    case 2:
      return (
        <svg
          className="demo-logo-mark"
          viewBox="0 0 28 28"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M14 3L25 14L14 25L3 14L14 3Z"
            stroke="currentColor"
            strokeWidth="2.4"
          />
          <path d="M14 9L19 14L14 19L9 14L14 9Z" fill="currentColor" />
        </svg>
      );
    case 3:
      return (
        <svg
          className="demo-logo-mark"
          viewBox="0 0 28 28"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 9H24M4 14H20M4 19H15"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case 4:
      return (
        <svg
          className="demo-logo-mark"
          viewBox="0 0 28 28"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 6H23L14 16V23M9 23H19"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return (
        <svg
          className="demo-logo-mark"
          viewBox="0 0 28 28"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 18V9C4 7.34315 5.34315 6 7 6H18V18H4Z"
            stroke="currentColor"
            strokeWidth="2.3"
          />
          <path
            d="M18 11H22L24 14.5V18H18V11Z"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="20" r="2.5" fill="currentColor" />
          <circle cx="20" cy="20" r="2.5" fill="currentColor" />
        </svg>
      );
  }
}

export function DemoVenues({ copy }: { copy: DemoCopy }) {
  const [paused, setPaused] = useState(false);
  return (
    <section className="demo-venues" aria-label={copy.demoTitle}>
      <div className="demo-heading">
        <div>
          <h2>{copy.demoTitle}</h2>
        </div>
        <button
          type="button"
          className="button button-secondary carousel-toggle"
          onClick={() => setPaused(!paused)}
          aria-label={paused ? copy.resumeLogos : copy.pauseLogos}
        >
          {paused ? (
            <Play size={20} aria-hidden />
          ) : (
            <Pause size={20} aria-hidden />
          )}
        </button>
      </div>
      <div className="logo-window">
        <div className="logo-track" data-paused={paused}>
          {[false, true].map((duplicate) => (
            <ul
              className="demo-logo-list"
              key={String(duplicate)}
              aria-hidden={duplicate || undefined}
            >
              {copy.demoVenues.map((name, i) => (
                <li key={name} className={`demo-logo demo-logo-${i}`}>
                  <DemoLogoMark index={i} />
                  <span className="demo-logo-wordmark">{name}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
