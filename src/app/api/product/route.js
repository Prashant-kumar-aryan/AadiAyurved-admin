import connectDB from "@/lib/connectDB.js";
import Product from "@/models/Product.js";
import { validateProductData } from "@/utils/validateProduct.js";
import { NextResponse } from "next/server";
import deleteFromCloudinary from "@/lib/CloudinaryDelete.js";

export async function POST(request) {
  try {
    await connectDB();

    const data = await request.json();

    // Validate the product data
    const validation = validateProductData(data);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    const product = new Product(data);
    await product.save();

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const data = await request.json();
    console.log("Received data for update:", data);

    // Validate product
    const validation = validateProductData(data);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    // 🗑️ Handle Cloudinary deletions if toBeDeleted exists
    if (data.toBeDeleted && Array.isArray(data.toBeDeleted)) {
      const deletionResults = await deleteFromCloudinary(data.toBeDeleted);
      console.log("Cloudinary deletion results:", deletionResults);
    }

    // Update the product
    const { toBeDeleted, ...updateFields } = data; // exclude toBeDeleted from update
    const product = await Product.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // 🔎 Find product first so we can get image URLs
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // 🗑️ Collect all images to be deleted
    const urlsToDelete = [
      product.heroImageUrl,
      ...(product.productImageUrls || []),
    ].filter(Boolean);

    // Delete images from Cloudinary
    if (urlsToDelete.length > 0) {
      const deletionResults = await deleteFromCloudinary(urlsToDelete);
      console.log("Cloudinary deletion results:", deletionResults);
    }

    // Finally, delete the product from DB
    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Product and images deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
