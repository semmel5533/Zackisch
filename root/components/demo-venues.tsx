"use client";

import { useState } from "react";
import { Pause, Play } from "@phosphor-icons/react";

const examples = [
  "CAFÉ NORDA",
  "bistro lumo",
  "TISCHZEIT",
  "morgenrot",
  "BAR VELA",
  "Korn & Kanne",
];

type DemoCopy = {
  demoTitle: string;
  demoNote: string;
  pauseLogos: string;
  resumeLogos: string;
};

export function DemoVenues({ copy }: { copy: DemoCopy }) {
  const [paused, setPaused] = useState(false);
  return (
    <section className="demo-venues container" aria-label={copy.demoTitle}>
      <div className="demo-heading">
        <div>
          <h2>{copy.demoTitle}</h2>
          <p>{copy.demoNote}</p>
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
              {examples.map((name, i) => (
                <li key={name} className={`demo-logo demo-logo-${i}`}>
                  {name}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
