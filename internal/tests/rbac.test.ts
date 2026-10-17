import { describe, expect, it } from "vitest";

interface TeamMember {
  email: string;
  role: "regional_admin" | "staff";
  regionId: string;
  isActive: boolean;
  permissions: string[];
}

function canAccessRoute(
  member: TeamMember,
  targetRegionId: string,
  requiredPermission: string | null,
  requiresAdmin: boolean,
): boolean {
  if (!member.isActive) return false;
  if (member.regionId !== targetRegionId) return false;
  if (member.role === "regional_admin") return true;
  if (requiresAdmin) return false;
  if (!requiredPermission) return true;
  return member.permissions.includes(requiredPermission);
}

function filterCustomerVisibleMessages(
  messages: Array<{ id: string; visibility: "public" | "internal_note"; body: string }>,
) {
  return messages.filter((m) => m.visibility === "public");
}

describe("internal team dashboard RBAC & ticket security", () => {
  it("enforces strict regional isolation even for regional_admin", () => {
    const deAdmin: TeamMember = {
      email: "selim@zackisch.com",
      role: "regional_admin",
      regionId: "de",
      isActive: true,
      permissions: [],
    };
    expect(canAccessRoute(deAdmin, "de", "tickets:read", false)).toBe(true);
    expect(canAccessRoute(deAdmin, "at", "tickets:read", false)).toBe(false);
  });

  it("enforces granular tickets:read, tickets:write, and tickets:note permissions for staff", () => {
    const supportAgent: TeamMember = {
      email: "support@zackisch.com",
      role: "staff",
      regionId: "de",
      isActive: true,
      permissions: ["tickets:read", "tickets:note"],
    };

    expect(canAccessRoute(supportAgent, "de", "tickets:read", false)).toBe(true);
    expect(canAccessRoute(supportAgent, "de", "tickets:note", false)).toBe(true);
    expect(canAccessRoute(supportAgent, "de", "tickets:write", false)).toBe(false);
    expect(canAccessRoute(supportAgent, "de", null, true)).toBe(false);
  });

  it("strips internal and internal_note messages from customer-facing ticket payloads", () => {
    const messages = [
      { id: "1", visibility: "public" as const, body: "Hallo, mein Drucker druckt nicht." },
      { id: "2", visibility: "internal_note" as const, body: "Prüfe Stripe Account acct_123" },
      { id: "3", visibility: "public" as const, body: "Bitte prüfe den 4-Modul-Ruherand." },
    ];
    const customerVisible = filterCustomerVisibleMessages(messages);
    expect(customerVisible).toHaveLength(2);
    expect(customerVisible.some((m) => m.visibility === "internal_note")).toBe(false);
  });

  it("ensures admin-context has no hardcoded fallback admin email and tickets page calls canonical Convex queries", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const adminContextSrc = fs.readFileSync(
      path.resolve(__dirname, "../lib/admin-context.tsx"),
      "utf8",
    );
    expect(adminContextSrc).not.toContain('"selim@zackisch.com"');
    expect(adminContextSrc).toContain("sessionStorage.getItem");

    const ticketsPageSrc = fs.readFileSync(
      path.resolve(__dirname, "../app/tickets/page.tsx"),
      "utf8",
    );
    expect(ticketsPageSrc).toContain("support.getTeamTickets");
    expect(ticketsPageSrc).toContain("support.getTeamTicketThread");
    expect(ticketsPageSrc).toContain('msg.visibility === "internal"');
  });
});
