export interface GuestQrParams {
  baseUrl?: string;
  organizationId: string;
  tableNumber?: string | null;
}

export interface QrPrintCardSpec {
  url: string;
  displayUrl: string;
  venueName: string;
  heading: string;
  subheading: string;
  tableLabel?: string;
  quietZoneModules: number;
  errorCorrectionLevel: "M" | "Q";
  foregroundColor: "#000000";
  backgroundColor: "#FFFFFF";
  minPrintSizeMm: number;
}

export function sanitizeTableIdentifier(raw: string): string {
  return raw.trim().replace(/[\r\n\t<>"]/g, "").slice(0, 24);
}

export function buildGuestQrUrl(params: GuestQrParams): string {
  const cleanBase = (params.baseUrl || "https://app.zackisch.com").replace(
    /\/+$/,
    "",
  );
  const orgId = encodeURIComponent(params.organizationId.trim());
  if (!orgId) {
    throw new Error("organizationId is required for QR URL generation");
  }

  const rawTable = params.tableNumber
    ? sanitizeTableIdentifier(params.tableNumber)
    : "";

  if (rawTable) {
    return `${cleanBase}/${orgId}/${encodeURIComponent(rawTable)}`;
  }
  return `${cleanBase}/${orgId}`;
}

export function createQrPrintCardSpec(options: {
  baseUrl?: string;
  organizationId: string;
  venueName: string;
  tableNumber?: string | null;
  locale?: "de" | "en";
}): QrPrintCardSpec {
  const isDe = (options.locale || "de") === "de";
  const cleanTable = options.tableNumber
    ? sanitizeTableIdentifier(options.tableNumber)
    : undefined;
  const url = buildGuestQrUrl({
    baseUrl: options.baseUrl,
    organizationId: options.organizationId,
    tableNumber: cleanTable,
  });

  const displayUrl = url.replace(/^https?:\/\//, "");
  const heading = cleanTable
    ? isDe
      ? `AN TISCH ${cleanTable.toUpperCase()} BESTELLEN`
      : `ORDER AT TABLE ${cleanTable.toUpperCase()}`
    : isDe
      ? "ZUM ABHOLEN BESTELLEN"
      : "ORDER FOR PICKUP";

  const subheading = isDe
    ? "QR-Code scannen, digital auswählen & direkt bezahlen"
    : "Scan QR code, choose items & pay directly";

  return {
    url,
    displayUrl,
    venueName: options.venueName.trim() || "Gastronomiebetrieb",
    heading,
    subheading,
    tableLabel: cleanTable,
    quietZoneModules: 4,
    errorCorrectionLevel: "M",
    foregroundColor: "#000000",
    backgroundColor: "#FFFFFF",
    minPrintSizeMm: 30,
  };
}
