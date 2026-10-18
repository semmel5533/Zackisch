import "server-only";
import { getAuthenticatedConvexClient, getOwnerCredentials } from "./auth";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { MAX_IMAGE_SIZE_BYTES, isAllowedImageFile } from "@/lib/constants";

export async function uploadFileToConvex(file: File, businessId: string): Promise<string> {
  if (!isAllowedImageFile(file)) {
    throw new Error("Only JPG and PNG images are allowed.");
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(`File exceeds maximum allowed size of 10 MB`);
  }
  const client = await getAuthenticatedConvexClient();
  const uploadUrl = await client.mutation(api.storage.generateUploadUrl, {
    businessId: businessId as Id<"businesses">,
    ...(await getOwnerCredentials()),
  });
  const arrayBuffer = await file.arrayBuffer();
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    body: arrayBuffer,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload to Convex storage: ${response.statusText}`);
  }

  const { storageId } = await response.json();
  return storageId;
}
