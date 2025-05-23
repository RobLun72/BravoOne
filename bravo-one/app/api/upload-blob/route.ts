import { NextRequest, NextResponse } from "next/server";
import { BlobServiceClient } from "@azure/storage-blob";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Get your connection string or SAS token from environment variables
  const AZURE_STORAGE_CONNECTION_STRING =
    process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING!;
  const containerName = "kalkyler";
  const blobName = "Exempelkalkyl_1_Small.xlsx";

  const blobServiceClient = new BlobServiceClient(
    AZURE_STORAGE_CONNECTION_STRING
  );
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  // Convert File to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: file.type },
  });

  return NextResponse.json({ message: "Blob uploaded/updated successfully" });
}
