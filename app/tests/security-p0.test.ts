import { describe, expect, it } from "vitest";
import { convexTest } from "convex-test";
import schema from "../convex/schema";
import { api } from "../convex/_generated/api";

const modules = import.meta.glob("../convex/**/*.ts");

async function setupP0Fixtures() {
  const t = convexTest(schema, modules);
  const data = await t.run(async (ctx) => {
    // 1. Seed regions
    await ctx.db.insert("regions", {
      code: "de",
      name: "Deutschland",
      currency: "EUR",
      taxRates: [7, 19],
      platformFeePercent: 2,
      partnerCommissionPercent: 50,
      status: "active",
      defaultLocale: "de",
      supportedLocales: ["de", "en"],
      createdAt: Date.now(),
    });

    await ctx.db.insert("regions", {
      code: "at",
      name: "Österreich",
      currency: "EUR",
      taxRates: [10, 20],
      platformFeePercent: 2,
      partnerCommissionPercent: 50,
      status: "planned",
      defaultLocale: "de",
      supportedLocales: ["de", "en"],
      createdAt: Date.now(),
    });

    // 2. Seed DE regional admin
    const deAdminId = await ctx.db.insert("adminUsers", {
      email: "admin-de@zackisch.com",
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
        "staff:read",
        "staff:manage",
        "emails:read",
      ],
      isActive: true,
      password: "initial-password-123",
      createdAt: Date.now(),
    });

    // 3. Seed Limited Staff (no staff:manage)
    const limitedStaffId = await ctx.db.insert("adminUsers", {
      email: "limited-staff@zackisch.com",
      name: "Limited Staff",
      role: "staff",
      regionId: "de",
      permissions: ["orders:read", "tickets:read"],
      isActive: true,
      password: "staff-password-123",
      createdAt: Date.now(),
    });

    // 4. Seed Tokens in verificationCodes
    const deAdminToken = "ops_session_valid_de_admin";
    await ctx.db.insert("verificationCodes", {
      identifier: deAdminToken,
      code: deAdminId,
      expires: Date.now() + 3600000,
    });

    const limitedStaffToken = "ops_session_limited_staff";
    await ctx.db.insert("verificationCodes", {
      identifier: limitedStaffToken,
      code: limitedStaffId,
      expires: Date.now() + 3600000,
    });

    const expiredToken = "ops_session_expired";
    await ctx.db.insert("verificationCodes", {
      identifier: expiredToken,
      code: deAdminId,
      expires: Date.now() - 1000,
    });

    // 5. Seed merchant and business for support tests
    const merchantUserId = await ctx.db.insert("users", {
      name: "Cafe Owner",
      email: "owner@cafe-berlin.de",
    });

    const businessId = await ctx.db.insert("businesses", {
      name: "Cafe Berlin",
      ownerId: merchantUserId,
      region: "de",
    });

    // 6. Seed valid support session
    const validSupportToken = "support_valid_token_xyz";
    await ctx.db.insert("supportSessions", {
      token: validSupportToken,
      userId: merchantUserId,
      businessId,
      businessName: "Cafe Berlin",
      email: "owner@cafe-berlin.de",
      name: "Cafe Owner",
      regionId: "de",
      expiresAt: Date.now() + 3600000,
    });

    return {
      deAdminId,
      deAdminToken,
      limitedStaffToken,
      expiredToken,
      merchantUserId,
      businessId,
      validSupportToken,
    };
  });

  return { t, data };
}

describe("Gate 0: P0 Security & Authorization Enforcement", () => {
  it("rejects unauthenticated and cross-region access to getRegionalOverview", async () => {
    const { t, data } = await setupP0Fixtures();

    // 1. Unauthenticated -> fails
    await expect(
      t.query(api.admin.getRegionalOverview, { regionId: "de" })
    ).rejects.toThrow(/UNAUTHORIZED/);

    // 2. Expired token -> fails
    await expect(
      t.query(api.admin.getRegionalOverview, {
        regionId: "de",
        sessionToken: data.expiredToken,
      })
    ).rejects.toThrow(/UNAUTHORIZED/);

    // 3. Cross-region access (DE admin requesting AT) -> fails
    await expect(
      t.query(api.admin.getRegionalOverview, {
        regionId: "at",
        sessionToken: data.deAdminToken,
      })
    ).rejects.toThrow(/FORBIDDEN/);

    // 4. Authorized DE admin in DE -> succeeds
    const overview = await t.query(api.admin.getRegionalOverview, {
      regionId: "de",
      sessionToken: data.deAdminToken,
    });
    expect(overview.totalBusinesses).toBeDefined();
  });

  it("rejects unauthorized access to listRegionalBusinesses and listRegionalOrders", async () => {
    const { t, data } = await setupP0Fixtures();

    // listRegionalBusinesses
    await expect(
      t.query(api.admin.listRegionalBusinesses, { regionId: "de" })
    ).rejects.toThrow(/UNAUTHORIZED/);

    await expect(
      t.query(api.admin.listRegionalBusinesses, {
        regionId: "at",
        sessionToken: data.deAdminToken,
      })
    ).rejects.toThrow(/FORBIDDEN/);

    const businesses = await t.query(api.admin.listRegionalBusinesses, {
      regionId: "de",
      sessionToken: data.deAdminToken,
    });
    expect(businesses).toBeDefined();

    // listRegionalOrders
    await expect(
      t.query(api.admin.listRegionalOrders, { regionId: "de" })
    ).rejects.toThrow(/UNAUTHORIZED/);

    await expect(
      t.query(api.admin.listRegionalOrders, {
        regionId: "at",
        sessionToken: data.deAdminToken,
      })
    ).rejects.toThrow(/FORBIDDEN/);

    const orders = await t.query(api.admin.listRegionalOrders, {
      regionId: "de",
      sessionToken: data.deAdminToken,
    });
    expect(orders).toBeDefined();
  });

  it("enforces staff:manage permissions for inviteStaff and updateStaffStatus", async () => {
    const { t, data } = await setupP0Fixtures();

    // Limited staff lacks "staff:manage"
    await expect(
      t.mutation(api.admin.inviteStaff, {
        email: "new-hire@zackisch.com",
        name: "New Hire",
        role: "staff",
        regionId: "de",
        permissions: ["orders:read"],
        sessionToken: data.limitedStaffToken,
      })
    ).rejects.toThrow(/FORBIDDEN/);

    // DE Admin has "staff:manage" and succeeds
    const newStaffId = await t.mutation(api.admin.inviteStaff, {
      email: "new-hire@zackisch.com",
      name: "New Hire",
      role: "staff",
      regionId: "de",
      permissions: ["orders:read"],
      sessionToken: data.deAdminToken,
    });
    expect(newStaffId).toBeDefined();

    // Check that audit log has actorId derived from server session, not client
    const logs = await t.query(api.audit.getAuditLogs, {
      regionId: "de",
      sessionToken: data.deAdminToken,
    });
    const inviteLog = logs.find((l) => l.action === "staff.invite");
    expect(inviteLog?.actorId).toBe("admin-de@zackisch.com");
  });

  it("prevents arbitrary password resets in setAdminPassword", async () => {
    const { t, data } = await setupP0Fixtures();

    // Wrong current password -> rejected
    await expect(
      t.mutation(api.admin.setAdminPassword, {
        sessionToken: data.deAdminToken,
        currentPassword: "wrong-password",
        newPassword: "BrandNewSecurePassword2026!",
      })
    ).rejects.toThrow(/UNAUTHORIZED: Aktuelles Passwort ist nicht korrekt/);

    // Password too short -> rejected
    await expect(
      t.mutation(api.admin.setAdminPassword, {
        sessionToken: data.deAdminToken,
        currentPassword: "initial-password-123",
        newPassword: "short",
      })
    ).rejects.toThrow(/mindestens 8 Zeichen/);

    // Correct current password -> succeeds
    const success = await t.mutation(api.admin.setAdminPassword, {
      sessionToken: data.deAdminToken,
      currentPassword: "initial-password-123",
      newPassword: "BrandNewSecurePassword2026!",
    });
    expect(success).toBe(true);
  });

  it("protects partners queries and mutations with server authorization", async () => {
    const { t, data } = await setupP0Fixtures();

    // listPartners requires sessionToken
    await expect(
      t.query(api.partners.listPartners, { regionId: "de" })
    ).rejects.toThrow(/UNAUTHORIZED/);

    // createPartner requires sessionToken and partners:write
    await expect(
      t.mutation(api.partners.createPartner, {
        code: "PARTNER10",
        name: "Partner 10",
        email: "p10@partner.com",
        regionId: "de",
        sessionToken: data.limitedStaffToken,
      })
    ).rejects.toThrow(/FORBIDDEN/);

    // DE admin succeeds
    const partnerId = await t.mutation(api.partners.createPartner, {
      code: "PARTNER10",
      name: "Partner 10",
      email: "p10@partner.com",
      regionId: "de",
      sessionToken: data.deAdminToken,
    });
    expect(partnerId).toBeDefined();

    // recordPayout requires sessionToken and partners:write
    const payoutId = await t.mutation(api.partners.recordPayout, {
      partnerId,
      regionId: "de",
      amountCents: 10000,
      period: "2026-10",
      sessionToken: data.deAdminToken,
    });
    expect(payoutId).toBeDefined();
  });

  it("protects audit and emailLogs from unauthenticated and cross-region inspection", async () => {
    const { t, data } = await setupP0Fixtures();

    // audit:getAuditLogs
    await expect(
      t.query(api.audit.getAuditLogs, { regionId: "de" })
    ).rejects.toThrow(/UNAUTHORIZED/);

    await expect(
      t.query(api.audit.getAuditLogs, {
        regionId: "at",
        sessionToken: data.deAdminToken,
      })
    ).rejects.toThrow(/FORBIDDEN/);

    // emailLogs:listEmailLogs
    await expect(
      t.query(api.emailLogs.listEmailLogs, { regionId: "de" })
    ).rejects.toThrow(/UNAUTHORIZED/);

    await expect(
      t.query(api.emailLogs.listEmailLogs, {
        regionId: "at",
        sessionToken: data.deAdminToken,
      })
    ).rejects.toThrow(/FORBIDDEN/);

    const emailLogs = await t.query(api.emailLogs.listEmailLogs, {
      regionId: "de",
      sessionToken: data.deAdminToken,
    });
    expect(emailLogs).toBeDefined();
  });

  it("rejects anonymous and unauthenticated ticket creation in support.createTicket", async () => {
    const { t, data } = await setupP0Fixtures();

    // 1. Anonymous ticket creation without sessionToken -> rejected
    await expect(
      t.mutation(api.support.createTicket, {
        requesterEmail: "random-guest@gmail.com",
        requesterName: "Anonymous Guest",
        category: "other",
        subject: "Guest Inquiry",
        body: "I have a question about this restaurant.",
      })
    ).rejects.toThrow(/UNAUTHORIZED: Support-Tickets können ausschließlich von verifizierten Zackisch-Betriebskonten erstellt werden/);

    // 2. Anonymous ticket with spoofed invalid session -> rejected
    await expect(
      t.mutation(api.support.createTicket, {
        sessionToken: "fake_token_123",
        requesterEmail: "random-guest@gmail.com",
        requesterName: "Anonymous Guest",
        category: "other",
        subject: "Guest Inquiry",
        body: "I have a question about this restaurant.",
      })
    ).rejects.toThrow(/UNAUTHORIZED/);

    // 3. Valid merchant account session -> succeeds, and requesterEmail is enforced from verified account
    const result = await t.mutation(api.support.createTicket, {
      sessionToken: data.validSupportToken,
      requesterEmail: "attacker-spoofed-email@evil.com",
      requesterName: "Spoofed Name",
      category: "payments_payouts",
      subject: "Stripe payout question",
      body: "Need help verifying my payout settings for Cafe Berlin.",
    });

    expect(result.ticketId).toBeDefined();
    expect(result.ticketNumber).toBeDefined();

    // Verify ticket in DB has the genuine merchant email, NOT the attacker spoofed email
    const ticket = await t.run(async (ctx) => ctx.db.get(result.ticketId));
    expect(ticket?.requesterEmail).toBe("owner@cafe-berlin.de");
    expect(ticket?.businessId).toBe(data.businessId);
    expect(ticket?.regionId).toBe("de");
  });
});
