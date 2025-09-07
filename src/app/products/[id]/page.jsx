"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import React from "react";

export default function ProductDetailsPage({ params }) {
  const unwrappedParams = React.use(params);
  const productId = unwrappedParams.id;

  const router = useRouter();
  const [productData, setProductData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingFeature, setIsTogglingFeature] = useState(false);

  // Form inputs for editing
  const [benefitInput, setBenefitInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [faqQuestionInput, setFaqQuestionInput] = useState("");
  const [faqAnswerInput, setFaqAnswerInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [ayurvedicNameInput, setAyurvedicNameInput] = useState("");
  const [symptomInput, setSymptomInput] = useState("");
  const [causeInput, setCauseInput] = useState("");
  const [treatmentInput, setTreatmentInput] = useState("");
  const [herbInput, setHerbInput] = useState("");
  const [formulationInput, setFormulationInput] = useState("");
  const [precautionInput, setPrecautionInput] = useState("");

  useEffect(() => {
    fetchProductData();
  }, [productId]);

  const fetchProductData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/product?id=${productId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }
      const data = await response.json();
      setProductData(data);
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Error loading product data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/product?id=${productId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      alert("Product deleted successfully!");
      router.push("/products"); // Redirect to products page
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleFeatureToggle = async () => {
    try {
      setIsTogglingFeature(true);
      const response = await fetch(`/api/product/featured?id=${productId}`, {
        method: "PUT",
        body: JSON.stringify({ featured: productData.featured }),
      });
      if (!response.ok) {
        throw new Error("Failed to toggle feature status");
      }
      // Update local state
      setProductData((prev) => ({
        ...prev,
        featured: !prev.featured,
      }));
      alert(
        `Product ${
          productData.featured ? "unfeatured" : "featured"
        } successfully!`
      );
    } catch (error) {
      console.error("Error toggling feature status:", error);
      alert("Error updating feature status. Please try again.");
    } finally {
      setIsTogglingFeature(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/product?id=${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        throw new Error("Failed to update product");
      }
      alert("Product updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error updating product. Please try again.");
    }
  };

  // Helper functions for array operations
  const addBenefit = () => {
    if (benefitInput.trim()) {
      setProductData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, benefitInput.trim()],
      }));
      setBenefitInput("");
    }
  };

  const removeBenefit = (index) => {
    setProductData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setProductData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput("");
    }
  };

  const removeFeature = (index) => {
    setProductData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addSizePrice = () => {
    if (sizeInput.trim() && priceInput.trim() && !isNaN(priceInput)) {
      setProductData((prev) => ({
        ...prev,
        sizePrices: [
          ...prev.sizePrices,
          { size: sizeInput.trim(), price: Number(priceInput) },
        ],
      }));
      setSizeInput("");
      setPriceInput("");
    }
  };

  const removeSizePrice = (index) => {
    setProductData((prev) => ({
      ...prev,
      sizePrices: prev.sizePrices.filter((_, i) => i !== index),
    }));
  };

  const addFaq = () => {
    if (faqQuestionInput.trim() && faqAnswerInput.trim()) {
      setProductData((prev) => ({
        ...prev,
        faqs: [
          ...prev.faqs,
          { question: faqQuestionInput.trim(), answer: faqAnswerInput.trim() },
        ],
      }));
      setFaqQuestionInput("");
      setFaqAnswerInput("");
    }
  };

  const removeFaq = (index) => {
    setProductData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  const addAyurvedicName = () => {
    if (ayurvedicNameInput.trim()) {
      setProductData((prev) => ({
        ...prev,
        ayurvedicNames: [...prev.ayurvedicNames, ayurvedicNameInput.trim()],
      }));
      setAyurvedicNameInput("");
    }
  };

  const removeAyurvedicName = (index) => {
    setProductData((prev) => ({
      ...prev,
      ayurvedicNames: prev.ayurvedicNames.filter((_, i) => i !== index),
    }));
  };

  const addSymptom = () => {
    if (symptomInput.trim()) {
      setProductData((prev) => ({
        ...prev,
        keySymptoms: [...prev.keySymptoms, symptomInput.trim()],
      }));
      setSymptomInput("");
    }
  };

  const removeSymptom = (index) => {
    setProductData((prev) => ({
      ...prev,
      keySymptoms: prev.keySymptoms.filter((_, i) => i !== index),
    }));
  };

  const addCause = () => {
    if (causeInput.trim()) {
      setProductData((prev) => ({
        ...prev,
        ayurvedicCauses: [...prev.ayurvedicCauses, causeInput.trim()],
      }));
      setCauseInput("");
    }
  };

  const removeCause = (index) => {
    setProductData((prev) => ({
      ...prev,
      ayurvedicCauses: prev.ayurvedicCauses.filter((_, i) => i !== index),
    }));
  };

  const addTreatment = () => {
    if (treatmentInput.trim()) {
      setProductData((prev) => ({
        ...prev,
        treatmentPrinciples: [
          ...prev.treatmentPrinciples,
          treatmentInput.trim(),
        ],
      }));
      setTreatmentInput("");
    }
  };

  const removeTreatment = (index) => {
    setProductData((prev) => ({
      ...prev,
      treatmentPrinciples: prev.treatmentPrinciples.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const addHerb = () => {
    if (herbInput.trim()) {
      setProductData((prev) => ({
        ...prev,
        effectiveHerbs: [...prev.effectiveHerbs, herbInput.trim()],
      }));
      setHerbInput("");
    }
  };

  const removeHerb = (index) => {
    setProductData((prev) => ({
      ...prev,
      effectiveHerbs: prev.effectiveHerbs.filter((_, i) => i !== index),
    }));
  };

  const addFormulation = () => {
    if (formulationInput.trim()) {
      setProductData((prev) => ({
        ...prev,
        classicalFormulations: [
          ...prev.classicalFormulations,
          formulationInput.trim(),
        ],
      }));
      setFormulationInput("");
    }
  };

  const removeFormulation = (index) => {
    setProductData((prev) => ({
      ...prev,
      classicalFormulations: prev.classicalFormulations.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const addPrecaution = () => {
    if (precautionInput.trim()) {
      setProductData((prev) => ({
        ...prev,
        precautions: [...prev.precautions, precautionInput.trim()],
      }));
      setPrecautionInput("");
    }
  };

  const removePrecaution = (index) => {
    setProductData((prev) => ({
      ...prev,
      precautions: prev.precautions.filter((_, i) => i !== index),
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-medium">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-black min-h-screen bg-gray-50 py-8 font-sans">
      <div className="w-full px-4">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          {/* Action Buttons */}
          <div className="mb-8 flex flex-wrap gap-4 justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 font-sans">
              {productData.productName}
            </h1>
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-semibold"
              >
                {isEditing ? "Cancel Edit" : "Edit"}
              </button>
              <button
                onClick={handleFeatureToggle}
                disabled={isTogglingFeature}
                className={`px-4 py-2 rounded-md font-semibold ${
                  productData.featured
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                } ${isTogglingFeature ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isTogglingFeature
                  ? "Updating..."
                  : productData.featured
                  ? "Unfeature"
                  : "Feature"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold"
              >
                Delete
              </button>
            </div>
          </div>

          {isEditing && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-blue-700 font-medium">
                  You are now editing this product. Make your changes and click
                  Save.
                </span>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Product Images */}
          <div className="space-y-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 font-sans">
              Product Images
            </h2>

            {productData.heroImageUrl && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Hero Image
                </label>
                <img
                  src={productData.heroImageUrl || "/placeholder.svg"}
                  alt="Hero image"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
            )}

            {productData.productImageUrls &&
              productData.productImageUrls.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                    Additional Product Images
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {productData.productImageUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url || "/placeholder.svg"}
                        alt={`Product image ${index + 1}`}
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Kit-specific fields */}
          {productData.productType === "kit" && (
            <div className="space-y-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 font-sans">
                Condition Information
              </h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Local/Modern Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="localName"
                    value={productData.localName || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">
                    {productData.localName || "Not specified"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Ayurvedic Names
                </label>
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={ayurvedicNameInput}
                        onChange={(e) => setAyurvedicNameInput(e.target.value)}
                        placeholder="Enter Ayurvedic/Sanskrit name"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                      />
                      <button
                        type="button"
                        onClick={addAyurvedicName}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 whitespace-nowrap font-semibold"
                      >
                        Add Name
                      </button>
                    </div>
                    {productData.ayurvedicNames &&
                      productData.ayurvedicNames.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {productData.ayurvedicNames.map((name, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md"
                            >
                              <span className="text-sm font-medium">
                                {name}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeAyurvedicName(index)}
                                className="text-red-500 hover:text-red-700 font-bold text-sm"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {productData.ayurvedicNames &&
                    productData.ayurvedicNames.length > 0 ? (
                      productData.ayurvedicNames.map((name, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                        >
                          {name}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">
                        No Ayurvedic names specified
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Short Intro
                </label>
                {isEditing ? (
                  <textarea
                    name="shortIntro"
                    value={productData.shortIntro || ""}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                  />
                ) : (
                  <p className="text-gray-800">
                    {productData.shortIntro || "Not specified"}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 font-sans">
              Basic Information
            </h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                {productData.productType === "product" ? "Product" : "Kit"} Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="productName"
                  value={productData.productName || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                />
              ) : (
                <p className="text-gray-800 font-medium">
                  {productData.productName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                Short Description
              </label>
              {isEditing ? (
                <textarea
                  name="shortDescription"
                  value={productData.shortDescription || ""}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                />
              ) : (
                <p className="text-gray-800">{productData.shortDescription}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Category
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="category"
                    value={productData.category || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">
                    {productData.category}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Subcategory
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="subcategory"
                    value={productData.subcategory || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">
                    {productData.subcategory}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Microcategory
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="microcategory"
                    value={productData.microcategory || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">
                    {productData.microcategory || "Not specified"}
                  </p>
                )}
              </div>
            </div>

            {/* Pricing */}
            {productData.productType === "product" ? (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Size - Price Combinations
                </label>
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={sizeInput}
                        onChange={(e) => setSizeInput(e.target.value)}
                        placeholder="e.g., 250g, 500g, 1kg"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                      />
                      <input
                        type="number"
                        value={priceInput}
                        onChange={(e) => setPriceInput(e.target.value)}
                        placeholder="Price (INR)"
                        className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                      />
                      <button
                        type="button"
                        onClick={addSizePrice}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 whitespace-nowrap font-semibold"
                      >
                        Add
                      </button>
                    </div>
                    {productData.sizePrices &&
                      productData.sizePrices.length > 0 && (
                        <div className="space-y-2">
                          {productData.sizePrices.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md"
                            >
                              <span className="text-sm font-medium">
                                {item.size} - ₹{item.price}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeSizePrice(index)}
                                className="text-red-500 hover:text-red-700 font-bold text-sm"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {productData.sizePrices &&
                    productData.sizePrices.length > 0 ? (
                      productData.sizePrices.map((item, index) => (
                        <div
                          key={index}
                          className="bg-gray-100 px-3 py-2 rounded-md"
                        >
                          <span className="text-sm font-medium">
                            {item.size} - ₹{item.price}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">
                        No pricing information available
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Price (INR)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="price"
                    value={productData.price || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">
                    ₹{productData.price}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Kit-specific symptoms and causes */}
          {productData.productType === "kit" && (
            <div className="space-y-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 font-sans">
                Symptoms & Causes
              </h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Key Symptoms
                </label>
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={symptomInput}
                        onChange={(e) => setSymptomInput(e.target.value)}
                        placeholder="Enter a key symptom"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                      />
                      <button
                        type="button"
                        onClick={addSymptom}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 whitespace-nowrap font-semibold"
                      >
                        Add Symptom
                      </button>
                    </div>
                    {productData.keySymptoms &&
                      productData.keySymptoms.length > 0 && (
                        <div className="space-y-2">
                          {productData.keySymptoms.map((symptom, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md"
                            >
                              <span className="flex-1 text-sm font-medium">
                                • {symptom}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeSymptom(index)}
                                className="text-red-500 hover:text-red-700 font-bold text-sm"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {productData.keySymptoms &&
                    productData.keySymptoms.length > 0 ? (
                      productData.keySymptoms.map((symptom, index) => (
                        <div
                          key={index}
                          className="bg-gray-100 px-3 py-2 rounded-md"
                        >
                          <span className="text-sm font-medium">
                            • {symptom}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No symptoms specified</p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Ayurvedic Causes
                </label>
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={causeInput}
                        onChange={(e) => setCauseInput(e.target.value)}
                        placeholder="Enter an Ayurvedic cause"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                      />
                      <button
                        type="button"
                        onClick={addCause}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 whitespace-nowrap font-semibold"
                      >
                        Add Cause
                      </button>
                    </div>
                    {productData.ayurvedicCauses &&
                      productData.ayurvedicCauses.length > 0 && (
                        <div className="space-y-2">
                          {productData.ayurvedicCauses.map((cause, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md"
                            >
                              <span className="flex-1 text-sm font-medium">
                                • {cause}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeCause(index)}
                                className="text-red-500 hover:text-red-700 font-bold text-sm"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {productData.ayurvedicCauses &&
                    productData.ayurvedicCauses.length > 0 ? (
                      productData.ayurvedicCauses.map((cause, index) => (
                        <div
                          key={index}
                          className="bg-gray-100 px-3 py-2 rounded-md"
                        >
                          <span className="text-sm font-medium">• {cause}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No causes specified</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Detailed Information */}
          <div className="space-y-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 font-sans">
              Detailed Information
            </h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                Long Description
              </label>
              {isEditing ? (
                <textarea
                  name="longDescription"
                  value={productData.longDescription || ""}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                />
              ) : (
                <p className="text-gray-800">
                  {productData.longDescription || "Not specified"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                Benefits
              </label>
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={benefitInput}
                      onChange={(e) => setBenefitInput(e.target.value)}
                      placeholder="Enter a key benefit"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                    />
                    <button
                      type="button"
                      onClick={addBenefit}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 whitespace-nowrap font-semibold"
                    >
                      Add Benefit
                    </button>
                  </div>
                  {productData.benefits && productData.benefits.length > 0 && (
                    <div className="space-y-2">
                      {productData.benefits.map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md"
                        >
                          <span className="flex-1 text-sm font-medium">
                            • {benefit}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeBenefit(index)}
                            className="text-red-500 hover:text-red-700 font-bold text-sm"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {productData.benefits && productData.benefits.length > 0 ? (
                    productData.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="bg-gray-100 px-3 py-2 rounded-md"
                      >
                        <span className="text-sm font-medium">• {benefit}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No benefits specified</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                Product Features
              </label>
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      placeholder="Enter a key feature"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 whitespace-nowrap font-semibold"
                    >
                      Add Feature
                    </button>
                  </div>
                  {productData.features && productData.features.length > 0 && (
                    <div className="space-y-2">
                      {productData.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md"
                        >
                          <span className="flex-1 text-sm font-medium">
                            • {feature}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="text-red-500 hover:text-red-700 font-bold text-sm"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {productData.features && productData.features.length > 0 ? (
                    productData.features.map((feature, index) => (
                      <div
                        key={index}
                        className="bg-gray-100 px-3 py-2 rounded-md"
                      >
                        <span className="text-sm font-medium">• {feature}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No features specified</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                Key Ingredients
              </label>
              {isEditing ? (
                <textarea
                  name="keyIngredients"
                  value={productData.keyIngredients || ""}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                />
              ) : (
                <p className="text-gray-800">
                  {productData.keyIngredients || "Not specified"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                How to Use
              </label>
              {isEditing ? (
                <textarea
                  name="howToUse"
                  value={productData.howToUse || ""}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                />
              ) : (
                <p className="text-gray-800">
                  {productData.howToUse || "Not specified"}
                </p>
              )}
            </div>
          </div>

          {/* Kit-specific treatment information */}
          {productData.productType === "kit" && (
            <div className="space-y-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 font-sans">
                Ayurvedic Treatment Information
              </h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Treatment Principles
                </label>
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={treatmentInput}
                        onChange={(e) => setTreatmentInput(e.target.value)}
                        placeholder="Enter a treatment principle"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                      />
                      <button
                        type="button"
                        onClick={addTreatment}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 whitespace-nowrap font-semibold"
                      >
                        Add Principle
                      </button>
                    </div>
                    {productData.treatmentPrinciples &&
                      productData.treatmentPrinciples.length > 0 && (
                        <div className="space-y-2">
                          {productData.treatmentPrinciples.map(
                            (principle, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md"
                              >
                                <span className="flex-1 text-sm font-medium">
                                  • {principle}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeTreatment(index)}
                                  className="text-red-500 hover:text-red-700 font-bold text-sm"
                                >
                                  ×
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {productData.treatmentPrinciples &&
                    productData.treatmentPrinciples.length > 0 ? (
                      productData.treatmentPrinciples.map(
                        (principle, index) => (
                          <div
                            key={index}
                            className="bg-gray-100 px-3 py-2 rounded-md"
                          >
                            <span className="text-sm font-medium">
                              • {principle}
                            </span>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-gray-500">
                        No treatment principles specified
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Effective Herbs
                </label>
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={herbInput}
                        onChange={(e) => setHerbInput(e.target.value)}
                        placeholder="Enter an effective herb"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                      />
                      <button
                        type="button"
                        onClick={addHerb}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 whitespace-nowrap font-semibold"
                      >
                        Add Herb
                      </button>
                    </div>
                    {productData.effectiveHerbs &&
                      productData.effectiveHerbs.length > 0 && (
                        <div className="space-y-2">
                          {productData.effectiveHerbs.map((herb, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md"
                            >
                              <span className="flex-1 text-sm font-medium">
                                • {herb}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeHerb(index)}
                                className="text-red-500 hover:text-red-700 font-bold text-sm"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {productData.effectiveHerbs &&
                    productData.effectiveHerbs.length > 0 ? (
                      productData.effectiveHerbs.map((herb, index) => (
                        <div
                          key={index}
                          className="bg-gray-100 px-3 py-2 rounded-md"
                        >
                          <span className="text-sm font-medium">• {herb}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No herbs specified</p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Classical Formulations
                </label>
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formulationInput}
                        onChange={(e) => setFormulationInput(e.target.value)}
                        placeholder="Enter a classical formulation"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                      />
                      <button
                        type="button"
                        onClick={addFormulation}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 whitespace-nowrap font-semibold"
                      >
                        Add Formulation
                      </button>
                    </div>
                    {productData.classicalFormulations &&
                      productData.classicalFormulations.length > 0 && (
                        <div className="space-y-2">
                          {productData.classicalFormulations.map(
                            (formulation, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md"
                              >
                                <span className="flex-1 text-sm font-medium">
                                  • {formulation}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeFormulation(index)}
                                  className="text-red-500 hover:text-red-700 font-bold text-sm"
                                >
                                  ×
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {productData.classicalFormulations &&
                    productData.classicalFormulations.length > 0 ? (
                      productData.classicalFormulations.map(
                        (formulation, index) => (
                          <div
                            key={index}
                            className="bg-gray-100 px-3 py-2 rounded-md"
                          >
                            <span className="text-sm font-medium">
                              • {formulation}
                            </span>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-gray-500">No formulations specified</p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Precautions
                </label>
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={precautionInput}
                        onChange={(e) => setPrecautionInput(e.target.value)}
                        placeholder="Enter a precaution"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                      />
                      <button
                        type="button"
                        onClick={addPrecaution}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 whitespace-nowrap font-semibold"
                      >
                        Add Precaution
                      </button>
                    </div>
                    {productData.precautions &&
                      productData.precautions.length > 0 && (
                        <div className="space-y-2">
                          {productData.precautions.map((precaution, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md"
                            >
                              <span className="flex-1 text-sm font-medium">
                                • {precaution}
                              </span>
                              <button
                                type="button"
                                onClick={() => removePrecaution(index)}
                                className="text-red-500 hover:text-red-700 font-bold text-sm"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {productData.precautions &&
                    productData.precautions.length > 0 ? (
                      productData.precautions.map((precaution, index) => (
                        <div
                          key={index}
                          className="bg-gray-100 px-3 py-2 rounded-md"
                        >
                          <span className="text-sm font-medium">
                            • {precaution}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No precautions specified</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Product Details */}
          <div className="space-y-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 font-sans">
              Product Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Shelf Life
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="shelfLife"
                    value={productData.shelfLife || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                  />
                ) : (
                  <p className="text-gray-800">
                    {productData.shelfLife || "Not specified"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Country of Origin
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="countryOfOrigin"
                    value={productData.countryOfOrigin || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                  />
                ) : (
                  <p className="text-gray-800">{productData.countryOfOrigin}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Expiry Date
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="expiryDate"
                    value={productData.expiryDate || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                  />
                ) : (
                  <p className="text-gray-800">
                    {productData.expiryDate || "Not specified"}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                Manufacturer
              </label>
              {isEditing ? (
                <textarea
                  name="manufacturer"
                  value={productData.manufacturer || ""}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                />
              ) : (
                <p className="text-gray-800">
                  {productData.manufacturer || "Not specified"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                Certifications
              </label>
              {isEditing ? (
                <textarea
                  name="certifications"
                  value={productData.certifications || ""}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                />
              ) : (
                <p className="text-gray-800">
                  {productData.certifications || "Not specified"}
                </p>
              )}
            </div>
          </div>

          {/* FAQs */}
          <div className="space-y-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 font-sans">
              Frequently Asked Questions
            </h2>

            {isEditing && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                      Question
                    </label>
                    <input
                      type="text"
                      value={faqQuestionInput}
                      onChange={(e) => setFaqQuestionInput(e.target.value)}
                      placeholder="Enter FAQ question"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                      Answer
                    </label>
                    <textarea
                      value={faqAnswerInput}
                      onChange={(e) => setFaqAnswerInput(e.target.value)}
                      placeholder="Enter FAQ answer"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addFaq}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-semibold"
                  >
                    Add FAQ
                  </button>
                </div>
              </div>
            )}

            {productData.faqs && productData.faqs.length > 0 ? (
              <div className="space-y-3">
                {productData.faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-bold text-gray-700">
                          Q:{" "}
                        </span>
                        <span className="text-sm font-medium">
                          {faq.question}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-bold text-gray-700">
                          A:{" "}
                        </span>
                        <span className="text-sm font-medium">
                          {faq.answer}
                        </span>
                      </div>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => removeFaq(index)}
                          className="text-red-500 hover:text-red-700 text-sm font-semibold"
                        >
                          Remove FAQ
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No FAQs available</p>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold ${
                  isDeleting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
