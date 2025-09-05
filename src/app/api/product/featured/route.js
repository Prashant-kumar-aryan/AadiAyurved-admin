import Product from "@/models/Product";
import connectDB from "@/lib/connectDB";
import { NextResponse } from "next/server";
export async function PUT(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const { featured } = await request.json();
    const product = await Product.findByIdAndUpdate(
      id,
      { featured: !featured },
      { new: true }
    );
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Featured status changed" });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
