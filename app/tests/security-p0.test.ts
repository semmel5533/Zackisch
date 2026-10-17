import { describe, expect, it } from "vitest";
import { convexTest } from "convex-test";
import schema from "../convex/schema";
import { api } from "../convex/_generated/api";

const modules = import.meta.glob("../convex/**/*.ts");

async function setupSecurityP0Fixture() {
  const t = convexTest(schema, modules);

  const fixture = await t.run(async (ctx) => {
    // 1. Regional Admin for Germany (DE)
    const deAdminId = await ctx.db.insert("adminUsers", {
      email: "admin@zackisch.de",
      name: "DE Admin",
      role: "regional_admin",
      regionId: "de",
      permissions: [
        "restaurants:read",
        "restaurants:write",
        "orders:read",
        "orders:write",
        "tickets:read",
        "tickets:write",
        "tickets:note",
        "newsletter:read",
        "newsletter:write",
        "newsletter:send",
        "partners:read",
        "partners:write",
        "audit:read",
        "staff:manage",
      ],
      isActive: true,
      password: "secure_password_1",
      createdAt: Date.now(),
    });

    // 2. Staff user for DE with restricted permissions (e.g. only orders:read, tickets:read)
    const deStaffRestrictedId = await ctx.db.insert("adminUsers", {
      email: "staff@zackisch.de",
      name: "DE Restricted Staff",
      role: "staff",
      regionId: "de",
      permissions: ["orders:read", "tickets:read"],
      isActive: true,
      password: "secure_password_2",
      createdAt: Date.now(),
    });

    // 3. Regional Admin for Austria (AT)
    const atAdminId = await ctx.db.insert("adminUsers", {
      email: "admin@zackisch.at",
      name: "AT Admin",
      role: "regional_admin",
      regionId: "at",
      permissions: ["restaurants:read", "orders:read", "tickets:read", "staff:manage"],
      isActive: true,
      password: "secure_password_3",
      createdAt: Date.now(),
    });

    // 4. Inactive Admin
    const inactiveAdminId = await ctx.db.insert("adminUsers", {
      email: "inactive@zackisch.de",
      name: "Inactive Admin",
      role: "regional_admin",
      regionId: "de",
      permissions: ["restaurants:read"],
      isActive: false,
      createdAt: Date.now(),
    });

    // Sessions in verificationCodes
    await ctx.db.insert("verificationCodes", {
      identifier: "ops_session_valid_de_admin",
      code: deAdminId,
      expires: Date.now() + 3600000,
    });

    await ctx.db.insert("verificationCodes", {
      identifier: "ops_session_valid_de_staff",
      code: deStaffRestrictedId,
      expires: Date.now() + 3600000,
    });

    await ctx.db.insert("verificationCodes", {
      identifier: "ops_session_valid_at_admin",
      code: atAdminId,
      expires: Date.now() + 3600000,
    });

    await ctx.db.insert("verificationCodes", {
      identifier: "ops_session_inactive",
      code: inactiveAdminId,
      expires: Date.now() + 3600000,
    });

    await ctx.db.insert("verificationCodes", {
      identifier: "ops_session_expired",
      code: deAdminId,
      expires: Date.now() - 1000,
    });

    // Seed sample business in DE
    const businessId = await ctx.db.insert("businesses", {
      name: "Bistro Berlin",
      ownerId: "user_owner_1",
      region: "de",
      currency: "EUR",
      taxId: "DE123456789",
      stripeAccountId: "acct_test123",
      stripeOnboardingComplete: true,
    });

    // Seed sample partner in DE
    const partnerId = await ctx.db.insert("partners", {
      code: "PARTNER01",
      name: "Partner Eins",
      email: "partner@example.de",
      regionId: "de",
      commissionRate: 0.5,
      status: "active",
      totalEarnedCents: 1000,
      totalPaidCents: 0,
      createdAt: Date.now(),
    });

    // Seed sample customer user & merchant support session
    const merchantUserId = await ctx.db.insert("users", {
      email: "merchant@bistro.de",
      name: "Bistro Owner",
    });

    await ctx.db.insert("supportSessions", {
      token: "support_session_merchant",
      userId: merchantUserId,
      businessId,
      businessName: "Bistro Berlin",
      email: "merchant@bistro.de",
      name: "Bistro Owner",
      regionId: "de",
      expiresAt: Date.now() + 3600000,
    });

    return {
      deAdminId,
      deStaffRestrictedId,
      atAdminId,
      businessId,
      partnerId,
      merchantUserId,
    };
  });

  return { t, fixture };
}

describe("Security P0: Complete Server-Side Access Control & Negative Tests", () => {
  it("denies unauthenticated, expired, inactive, and wrong-region access to admin:getRegionalOverview", async () => {
    const { t } = await setupSecurityP0Fixture();

    // 1. Unauthenticated (no sessionToken)
    await expect(
      t.query(api.admin.getRegionalOverview, { regionId: "de" })
    ).rejects.toThrow(/Authentifizierung erforderlich/);

    // 2. Expired session
    await expect(
      t.query(api.admin.getRegionalOverview, {
        regionId: "de",
        sessionToken: "ops_session_expired",
      })
    ).rejects.toThrow(/Sitzung ist abgelaufen/);

    // 3. Inactive admin
    await expect(
      t.query(api.admin.getRegionalOverview, {
        regionId: "de",
        sessionToken: "ops_session_inactive",
      })
    ).rejects.toThrow(/Kein aktives Team-Dashboard-Konto/);

    // 4. Wrong region (AT admin trying to read DE)
    await expect(
      t.query(api.admin.getRegionalOverview, {
        regionId: "de",
        sessionToken: "ops_session_valid_at_admin",
      })
    ).rejects.toThrow(/Kein Zugriff auf Daten außerhalb der zugewiesenen Region/);

    // 5. Authorized DE admin
    const res = await t.query(api.admin.getRegionalOverview, {
      regionId: "de",
      sessionToken: "ops_session_valid_de_admin",
    });
    expect(res).toBeDefined();
    expect(res.totalBusinesses).toBe(1);
  });

  it("denies unauthenticated and unauthorized access to admin:listRegionalBusinesses", async () => {
    const { t } = await setupSecurityP0Fixture();

    // Unauthenticated
    await expect(
      t.query(api.admin.listRegionalBusinesses, { regionId: "de" })
    ).rejects.toThrow(/Authentifizierung erforderlich/);

    // Staff lacking restaurants:read
    await expect(
      t.query(api.admin.listRegionalBusinesses, {
        regionId: "de",
        sessionToken: "ops_session_valid_de_staff",
      })
    ).rejects.toThrow(/Berechtigung 'restaurants:read' fehlt/);

    // Valid admin succeeds
    const businesses = await t.query(api.admin.listRegionalBusinesses, {
      regionId: "de",
      sessionToken: "ops_session_valid_de_admin",
    });
    expect(businesses).toHaveLength(1);
    expect(businesses[0].name).toBe("Bistro Berlin");
  });

  it("denies unauthenticated and unauthorized staff:manage mutations", async () => {
    const { t, fixture } = await setupSecurityP0Fixture();

    // 1. inviteStaff unauthenticated
    await expect(
      t.mutation(api.admin.inviteStaff, {
        email: "newstaff@zackisch.de",
        name: "New Staff",
        role: "staff",
        regionId: "de",
        permissions: ["orders:read"],
      })
    ).rejects.toThrow(/Authentifizierung erforderlich/);

    // 2. inviteStaff by restricted staff lacking staff:manage
    await expect(
      t.mutation(api.admin.inviteStaff, {
        email: "newstaff@zackisch.de",
        name: "New Staff",
        role: "staff",
        regionId: "de",
        permissions: ["orders:read"],
        sessionToken: "ops_session_valid_de_staff",
      })
    ).rejects.toThrow(/Berechtigung 'staff:manage' fehlt/);

    // 3. updateStaffStatus unauthenticated
    await expect(
      t.mutation(api.admin.updateStaffStatus, {
        staffId: fixture.deStaffRestrictedId,
        isActive: false,
        regionId: "de",
      })
    ).rejects.toThrow(/Authentifizierung erforderlich/);

    // 4. setAdminPassword unauthenticated
    await expect(
      t.mutation(api.admin.setAdminPassword, {
        email: "admin@zackisch.de",
        password: "new_hacked_password",
      })
    ).rejects.toThrow(/Authentifizierung erforderlich/);

    // 5. Authorized inviteStaff with valid admin
    const newStaffId = await t.mutation(api.admin.inviteStaff, {
      email: "newstaff@zackisch.de",
      name: "New Staff",
      role: "staff",
      regionId: "de",
      permissions: ["orders:read"],
      sessionToken: "ops_session_valid_de_admin",
    });
    expect(newStaffId).toBeDefined();
  });

  it("denies unauthenticated and unauthorized access to partners:listPartners and recordPayout", async () => {
    const { t, fixture } = await setupSecurityP0Fixture();

    // 1. listPartners unauthenticated
    await expect(
      t.query(api.partners.listPartners, { regionId: "de" })
    ).rejects.toThrow(/Authentifizierung erforderlich/);

    // 2. listPartners by staff lacking partners:read
    await expect(
      t.query(api.partners.listPartners, {
        regionId: "de",
        sessionToken: "ops_session_valid_de_staff",
      })
    ).rejects.toThrow(/Berechtigung 'partners:read' fehlt/);

    // 3. recordPayout unauthenticated
    await expect(
      t.mutation(api.partners.recordPayout, {
        partnerId: fixture.partnerId,
        regionId: "de",
        amountCents: 500,
        period: "2026-10",
      })
    ).rejects.toThrow(/Authentifizierung erforderlich/);

    // 4. recordPayout by staff lacking partners:write
    await expect(
      t.mutation(api.partners.recordPayout, {
        partnerId: fixture.partnerId,
        regionId: "de",
        amountCents: 500,
        period: "2026-10",
        sessionToken: "ops_session_valid_de_staff",
      })
    ).rejects.toThrow(/Berechtigung 'partners:write' fehlt/);

    // 5. recordPayout by authorized admin
    const payoutId = await t.mutation(api.partners.recordPayout, {
      partnerId: fixture.partnerId,
      regionId: "de",
      amountCents: 500,
      period: "2026-10",
      sessionToken: "ops_session_valid_de_admin",
    });
    expect(payoutId).toBeDefined();
  });

  it("denies unauthenticated and unauthorized access to audit and email logs", async () => {
    const { t } = await setupSecurityP0Fixture();

    // 1. audit:getAuditLogs unauthenticated
    await expect(
      t.query(api.audit.getAuditLogs, { regionId: "de" })
    ).rejects.toThrow(/Authentifizierung erforderlich/);

    // 2. audit:getAuditLogs by staff lacking audit:read
    await expect(
      t.query(api.audit.getAuditLogs, {
        regionId: "de",
        sessionToken: "ops_session_valid_de_staff",
      })
    ).rejects.toThrow(/Berechtigung 'audit:read' fehlt/);

    // 3. emailLogs:listEmailLogs unauthenticated
    await expect(
      t.query(api.emailLogs.listEmailLogs, { regionId: "de" })
    ).rejects.toThrow(/Authentifizierung erforderlich/);

    // 4. Authorized admin can read both
    const logs = await t.query(api.audit.getAuditLogs, {
      regionId: "de",
      sessionToken: "ops_session_valid_de_admin",
    });
    expect(logs).toBeDefined();

    const emails = await t.query(api.emailLogs.listEmailLogs, {
      regionId: "de",
      sessionToken: "ops_session_valid_de_admin",
    });
    expect(emails).toBeDefined();
  });

  it("denies anonymous support ticket creation and strictly requires verified merchant identity", async () => {
    const { t } = await setupSecurityP0Fixture();

    // 1. Anonymous createTicket (no sessionToken) must fail
    await expect(
      t.mutation(api.support.createTicket, {
        requesterEmail: "anonymous@random.com",
        requesterName: "Anonymous Guest",
        category: "onboarding",
        subject: "Need help",
        body: "I am an unauthenticated user trying to create a ticket.",
      })
    ).rejects.toThrow(/Authentifizierung erforderlich: Nur verifizierte Zackisch-Betriebskonten/);

    // 2. Forged invalid token must fail
    await expect(
      t.mutation(api.support.createTicket, {
        sessionToken: "forged_nonexistent_token_123",
        requesterEmail: "attacker@random.com",
        requesterName: "Attacker",
        category: "payments_payouts",
        subject: "Spoofed ticket",
        body: "Trying to forge a support ticket.",
      })
    ).rejects.toThrow(/Authentifizierung erforderlich: Nur verifizierte Zackisch-Betriebskonten/);

    // 3. Verified merchant session succeeds and binds to verified business
    const ticket = await t.mutation(api.support.createTicket, {
      sessionToken: "support_session_merchant",
      requesterEmail: "merchant@bistro.de",
      requesterName: "Bistro Owner",
      category: "pos_reconciliation",
      subject: "Frage zur Kassenerfassung",
      body: "Wie erfasse ich eine bezahlte Bestellung in unserer Kasse?",
    });

    expect(ticket.ticketNumber).toMatch(/^ZCK-\d+$/);
    expect(ticket.ticketId).toBeDefined();

    // Verify ticket in database has bound businessId and verified email
    const stored = await t.run(async (ctx) => {
      return await ctx.db.get(ticket.ticketId);
    });
    expect(stored?.businessName).toBe("Bistro Berlin");
    expect(stored?.requesterEmail).toBe("merchant@bistro.de");
  });
});
