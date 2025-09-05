import connectDB from "@/lib/connectDB";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const product = await Product.find({}).select(
      "productName productType heroImageUrl featured category subcategory price sizePrices _id"
    );
    if (!product) {
      return NextResponse.json(
        { error: "Products not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ data: product });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
