"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation"; // Added router for navigation

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductType, setSelectedProductType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const router = useRouter(); // Initialize router

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const result = await response.json();
        if (result.data) {
          setProducts(result.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(products.map((product) => product.category)),
    ];
    return uniqueCategories.filter(Boolean);
  }, [products]);

  // Get subcategories based on selected category
  const subcategories = useMemo(() => {
    if (selectedCategory === "all") return [];
    const filteredProducts = products.filter(
      (product) => product.category === selectedCategory
    );
    const uniqueSubcategories = [
      ...new Set(filteredProducts.map((product) => product.subcategory)),
    ];
    return uniqueSubcategories.filter(Boolean);
  }, [products, selectedCategory]);

  // Reset subcategory when category changes
  useEffect(() => {
    setSelectedSubcategory("all");
  }, [selectedCategory]);

  // Filter products based on selections
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const typeMatch =
        selectedProductType === "all" ||
        product.productType === selectedProductType;
      const categoryMatch =
        selectedCategory === "all" || product.category === selectedCategory;
      const subcategoryMatch =
        selectedSubcategory === "all" ||
        product.subcategory === selectedSubcategory;

      return typeMatch && categoryMatch && subcategoryMatch;
    });
  }, [products, selectedProductType, selectedCategory, selectedSubcategory]);

  const handleProductClick = (productId) => {
    router.push(`/products/${productId}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-slate-700">Loading products...</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-slate-900">
          Products
        </h1>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-4xl mx-auto">
          {/* Product Type Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-slate-700">
              Product Type
            </label>
            <select
              value={selectedProductType}
              onChange={(e) => setSelectedProductType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
            >
              <option value="all">All</option>
              <option value="kit">Kit</option>
              <option value="product">Product</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-slate-700">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-slate-700">
              Subcategory
            </label>
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              disabled={
                selectedCategory === "all" || subcategories.length === 0
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-slate-900"
            >
              <option value="all">All Subcategories</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" // Added cursor-pointer
              onClick={() => handleProductClick(product._id)} // Added click handler
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={
                    product.heroImageUrl ||
                    "/placeholder.svg?height=300&width=300&query=product" ||
                    "/placeholder.svg"
                  }
                  alt={product.productName}
                  className="w-full h-full object-cover"
                />
                {product.featured && (
                  <span className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Featured
                  </span>
                )}
                <span className="absolute top-2 right-2 bg-gray-200 text-slate-800 text-xs px-2 py-1 rounded-full font-medium capitalize">
                  {product.productType}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-slate-900">
                  {product.productName}
                </h3>
                <div className="text-sm text-slate-600 mb-2">
                  <span className="capitalize">{product.category}</span>
                  {product.subcategory && <span> • {product.subcategory}</span>}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900">
                    ₹{/* Changed $ to ₹ */}
                    {product.sizePrices && product.sizePrices.length > 0
                      ? product.sizePrices[0].price.toFixed(2)
                      : product.price.toFixed(2)}
                  </span>
                  {product.sizePrices && product.sizePrices.length > 0 && (
                    <span className="text-xs text-slate-500">
                      Multiple sizes
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Products Message */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-slate-600">
              No products found matching your filters.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
