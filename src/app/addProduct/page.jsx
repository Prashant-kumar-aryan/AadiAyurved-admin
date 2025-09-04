"use client";

import { useState } from "react";

export default function AddProductPage() {
  const initialFormData = {
    productName: "",
    shortDescription: "",
    category: "",
    subcategory: "",
    price: 0,
    sizes: [],
    longDescription: "",
    benefits: [],
    features: [],
    keyIngredients: "",
    shelfLife: "",
    manufacturer: "",
    countryOfOrigin: "",
    expiryDate: "",
    howToUse: "",
    certifications: "",
    faqs: [],
  };
  const [formData, setFormData] = useState(initialFormData);

  const [sizeInput, setSizeInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [faqQuestionInput, setFaqQuestionInput] = useState("");
  const [faqAnswerInput, setFaqAnswerInput] = useState("");

  const [heroImage, setHeroImage] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [heroPreview, setHeroPreview] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productName.trim())
      newErrors.productName = "Product name is required";
    if (!formData.shortDescription.trim())
      newErrors.shortDescription = "Short description is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.subcategory.trim())
      newErrors.subcategory = "Subcategory is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!heroImage) newErrors.heroImage = "Hero image is required";

    if (formData.sizes.length === 0)
      newErrors.sizes = "At least one size is required";
    if (formData.benefits.length === 0)
      newErrors.benefits = "At least one benefit is required";
    if (formData.features.length === 0)
      newErrors.features = "At least one feature is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleHeroImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroPreview(reader.result);
      };
      reader.readAsDataURL(file);
      if (errors.heroImage) {
        setErrors((prev) => ({ ...prev, heroImage: "" }));
      }
    }
  };

  const handleProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setProductImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const addSize = () => {
    if (sizeInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, sizeInput.trim()],
      }));
      setSizeInput("");
      if (errors.sizes) {
        setErrors((prev) => ({ ...prev, sizes: "" }));
      }
    }
  };

  const removeSize = (index) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

  const addBenefit = () => {
    if (benefitInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, benefitInput.trim()],
      }));
      setBenefitInput("");
      if (errors.benefits) {
        setErrors((prev) => ({ ...prev, benefits: "" }));
      }
    }
  };

  const removeBenefit = (index) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput("");
      if (errors.features) {
        setErrors((prev) => ({ ...prev, features: "" }));
      }
    }
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addFaq = () => {
    if (faqQuestionInput.trim() && faqAnswerInput.trim()) {
      setFormData((prev) => ({
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
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  const removeImage = (index) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    ); // Replace with your actual upload preset
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.log("Form has errors:", errors);
      return;
    }

    setIsUploading(true);

    try {
      // Upload hero image to Cloudinary
      let heroImageUrl = "";
      if (heroImage) {
        console.log("[v0] Uploading hero image...");
        heroImageUrl = await uploadToCloudinary(heroImage);
        console.log("[v0] Hero image uploaded:", heroImageUrl);
      }

      // Upload additional product images to Cloudinary
      const productImageUrls = [];
      if (productImages.length > 0) {
        console.log("[v0] Uploading product images...");
        for (const image of productImages) {
          const url = await uploadToCloudinary(image);
          productImageUrls.push(url);
        }
        console.log("[v0] Product images uploaded:", productImageUrls);
      }

      // Prepare form data with image URLs
      const finalFormData = {
        ...formData,
        heroImageUrl,
        productImageUrls,
      };
      finalFormData.price = Number(finalFormData.price);
      console.log("[v0] Sending form data to backend:", finalFormData);

      // Send to backend API
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalFormData),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      const result = await response.json();
      console.log("[v0] Product created successfully:", result);
      setFormData(initialFormData);
      setSizeInput("");
      setBenefitInput("");
      setFeatureInput("");
      setFaqQuestionInput("");
      setFaqAnswerInput("");
      setHeroImage(null);
      setProductImages([]);
      setHeroPreview("");
      setImagePreviews([]);
      setErrors({});
      setIsUploading(false);
      // Reset form or redirect
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Error creating product. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className=" text-black min-h-screen bg-gray-50 py-8 font-sans">
      <div className="w-full px-4">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8 font-sans">
            Add New Product
          </h1>

          {isUploading && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-blue-700 font-medium">
                  Uploading images and creating product...
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 font-sans">
                Product Images
              </h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Hero Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroImageChange}
                  className="block w-full text-sm text-gray-500 font-sans file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {errors.heroImage && (
                  <p className="text-red-500 text-sm mt-1 font-medium">
                    {errors.heroImage}
                  </p>
                )}
                {heroPreview && (
                  <div className="mt-4">
                    <img
                      src={heroPreview || "/placeholder.svg"}
                      alt="Hero preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Additional Product Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleProductImagesChange}
                  className="block w-full text-sm text-gray-500 font-sans file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {imagePreviews.length > 0 && (
                  <div className="mt-4 flex flax-wrap  gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative bg-gray-900">
                        <img
                          src={preview || "/placeholder.svg"}
                          alt={`Preview ${index}`}
                          className="w-30 h-30 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 font-sans">
                Basic Information
              </h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans ${
                    errors.productName ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.productName && (
                  <p className="text-red-500 text-sm mt-1 font-medium">
                    {errors.productName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Short Description *
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans ${
                    errors.shortDescription
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  required
                />
                {errors.shortDescription && (
                  <p className="text-red-500 text-sm mt-1 font-medium">
                    {errors.shortDescription}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1 font-medium">
                    {errors.category}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Subcategory *
                </label>
                <input
                  type="text"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans ${
                    errors.subcategory ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.subcategory && (
                  <p className="text-red-500 text-sm mt-1 font-medium">
                    {errors.subcategory}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Price (INR) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1 font-medium">
                    {errors.price}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Available Sizes *
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={sizeInput}
                      onChange={(e) => setSizeInput(e.target.value)}
                      placeholder="e.g., 250g, 500g, 1kg"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addSize())
                      }
                    />
                    <button
                      type="button"
                      onClick={addSize}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 whitespace-nowrap font-semibold"
                    >
                      Add Size
                    </button>
                  </div>
                  {errors.sizes && (
                    <p className="text-red-500 text-sm font-medium">
                      {errors.sizes}
                    </p>
                  )}
                  {formData.sizes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.sizes.map((size, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md"
                        >
                          <span className="text-sm font-medium">{size}</span>
                          <button
                            type="button"
                            onClick={() => removeSize(index)}
                            className="text-red-500 hover:text-red-700 font-bold text-sm"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 font-sans">
                Detailed Information
              </h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Long Description
                </label>
                <textarea
                  name="longDescription"
                  value={formData.longDescription}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Benefits (Key Points) *
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={benefitInput}
                      onChange={(e) => setBenefitInput(e.target.value)}
                      placeholder="Enter a key benefit"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addBenefit())
                      }
                    />
                    <button
                      type="button"
                      onClick={addBenefit}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 whitespace-nowrap font-semibold"
                    >
                      Add Benefit
                    </button>
                  </div>
                  {errors.benefits && (
                    <p className="text-red-500 text-sm font-medium">
                      {errors.benefits}
                    </p>
                  )}
                  {formData.benefits.length > 0 && (
                    <div className="space-y-2">
                      {formData.benefits.map((benefit, index) => (
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
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Product Features (Key Points) *
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      placeholder="Enter a key feature"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addFeature())
                      }
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 whitespace-nowrap font-semibold"
                    >
                      Add Feature
                    </button>
                  </div>
                  {errors.features && (
                    <p className="text-red-500 text-sm font-medium">
                      {errors.features}
                    </p>
                  )}
                  {formData.features.length > 0 && (
                    <div className="space-y-2">
                      {formData.features.map((feature, index) => (
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
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Key Ingredients
                </label>
                <textarea
                  name="keyIngredients"
                  value={formData.keyIngredients}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  How to Use
                </label>
                <textarea
                  name="howToUse"
                  value={formData.howToUse}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 font-sans">
                Product Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                    Shelf Life
                  </label>
                  <input
                    type="text"
                    name="shelfLife"
                    value={formData.shelfLife}
                    onChange={handleInputChange}
                    placeholder="e.g., 24 months"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                    Country of Origin
                  </label>
                  <input
                    type="text"
                    name="countryOfOrigin"
                    value={formData.countryOfOrigin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                    Product Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="e.g., MM/YYYY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Manufactured & Packed By
                </label>
                <textarea
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                  Organization and Certification
                </label>
                <textarea
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 font-sans">
                Frequently Asked Questions
              </h2>

              <div className="space-y-4">
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

                {formData.faqs.length > 0 && (
                  <div className="space-y-3">
                    {formData.faqs.map((faq, index) => (
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
                          <button
                            type="button"
                            onClick={() => removeFaq(index)}
                            className="text-red-500 hover:text-red-700 text-sm font-semibold"
                          >
                            Remove FAQ
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isUploading}
                className={`w-full py-3 px-4 rounded-md font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 font-sans ${
                  isUploading
                    ? "bg-gray-400 cursor-not-allowed text-gray-700"
                    : "bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white"
                }`}
              >
                {isUploading ? "Adding Product..." : "Add Product"}
              </button>
              {Object.keys(errors).length > 0 && (
                <div className="text-red-500">
                  <p>The form has errors. Fix them before upload.</p>
                  <ul className="text-red-500 list-disc pl-5">
                    {Object.keys(errors).map((field) => (
                      <li key={field}>{field}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
