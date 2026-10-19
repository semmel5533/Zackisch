import "server-only";
import { getOwnerCredentials, requireOwner } from "./auth";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { MAX_IMAGE_SIZE_BYTES } from "@/lib/constants";

export async function uploadFileToConvex(file: File, businessId: string): Promise<string> {
  if (!["image/jpeg", "image/png"].includes(file.type)) throw new Error("INVALID_IMAGE_TYPE");
  if (file.size === 0 || file.size > MAX_IMAGE_SIZE_BYTES) throw new Error("INVALID_IMAGE_SIZE");
  await requireOwner(businessId);
  const configuredSite = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
  const deployment = new URL(process.env.NEXT_PUBLIC_CONVEX_URL!);
  if (!configuredSite && !deployment.hostname.endsWith(".convex.cloud")) {
    throw new Error("CONVEX_SITE_URL_REQUIRED");
  }
  const site = configuredSite || `https://${deployment.hostname.replace(/\.convex\.cloud$/, ".convex.site")}`;
  const headers = new Headers({ "Content-Type": file.type, "X-Business-Id": businessId });
  const { sessionToken } = await getOwnerCredentials();
  if (sessionToken) headers.set("X-Merchant-Session", sessionToken);
  const token = await convexAuthNextjsToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(new URL("/merchant-media", site), {
    method: "POST", headers, body: file, cache: "no-store", redirect: "error",
  });
  if (!response.ok) throw new Error(`MEDIA_UPLOAD_FAILED_${response.status}`);
  const result: unknown = await response.json();
  if (!result || typeof result !== "object" || !("storageId" in result) || typeof result.storageId !== "string") {
    throw new Error("INVALID_UPLOAD_RESPONSE");
  }
  return result.storageId;
}
