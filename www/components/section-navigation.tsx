"use client";

import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { content, resolveLocaleFromPathname } from "@/lib/content";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ComponentProps,
  type ReactNode,
} from "react";

function scrollToSection(id: string) {
  const section = document.getElementById(id);
  if (!section) return false;
  const target =
    id === "main"
      ? section
      : (section.querySelector<HTMLElement>("h1, h2") ?? section);
  const offset = innerWidth < 800 ? 24 : 40;
  const top = Math.max(
    0,
    scrollY + target.getBoundingClientRect().top - offset,
  );
  if (!target.hasAttribute("tabindex")) {
    target.setAttribute("tabindex", "-1");
    target.addEventListener("blur", () => target.removeAttribute("tabindex"), {
      once: true,
    });
  }
  target.focus({ preventScroll: true });
  window.scrollTo({
    top,
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
  });
  return true;
}

const SectionNavigationContext = createContext<((url: URL) => void) | null>(
  null,
);

export function SectionNavigationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const pending = useRef<{ pathname: string; id: string } | null>(null);

  useEffect(() => {
    const destination = pending.current;
    if (!destination || destination.pathname !== pathname) return;
    const finish = () => {
      if (!scrollToSection(destination.id)) return false;
      pending.current = null;
      return true;
    };
    if (finish()) return;
    const observer = new MutationObserver(() => {
      if (finish()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const timeout = setTimeout(() => {
      observer.disconnect();
      pending.current = null;
    }, 5000);
    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [pathname]);

  function navigate(url: URL) {
    const id = decodeURIComponent(url.hash.slice(1));
    if (url.pathname === location.pathname && scrollToSection(id)) return;
    pending.current = { pathname: url.pathname, id };
    router.push(url.pathname + url.search, { scroll: false });
  }

  return (
    <SectionNavigationContext.Provider value={navigate}>
      {children}
    </SectionNavigationContext.Provider>
  );
}

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  decoration?: boolean;
  deferNavigation?: (navigate: () => void) => void;
};

export function WebsiteLink({
  onClick,
  deferNavigation,
  decoration = true,
  href,
  children,
  className,
  ...props
}: Props) {
  const navigate = useContext(SectionNavigationContext);
  const pathname = usePathname();
  const destination = new URL(href, "https://zackisch.com");
  const external =
    /^https?:$/.test(destination.protocol) &&
    destination.host !== "zackisch.com";
  const section = Boolean(destination.hash) && !external;
  const copy = content[resolveLocaleFromPathname(pathname)];
  const arrow = decoration && !section;

  return (
    <Link
      {...props}
      href={href}
      className={[
        className,
        decoration ? (section ? "section-link" : "page-link") : "",
      ]
        .filter(Boolean)
        .join(" ")}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-description={external ? copy.newTab : undefined}
      title={external ? copy.newTab : props.title}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.currentTarget.target === "_blank"
        )
          return;
        const url = new URL(event.currentTarget.href);
        if (!url.hash || url.origin !== location.origin || !navigate) return;
        event.preventDefault();
        const follow = () => navigate(url);
        if (deferNavigation) deferNavigation(follow);
        else follow();
      }}
    >
      {arrow ? (
        <>
          <span className="navigation-label">{children}</span>
          <ArrowUpRight className="navigation-arrow" aria-hidden size={18} />
        </>
      ) : (
        children
      )}
    </Link>
  );
}
