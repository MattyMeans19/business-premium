'use server';

import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// configure using environment variables from your .env
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const { publicId } = await req.json();

    if (!publicId) {
      return NextResponse.json({ error: "Missing publicId" }, { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return NextResponse.json(result);
  } catch (err) {
    console.error("/api/delete-photo error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}