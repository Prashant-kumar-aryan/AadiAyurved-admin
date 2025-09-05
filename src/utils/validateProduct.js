export function validateProductData(data) {
  const errors = [];

  // Common validations
  if (!data.productName || data.productName.trim().length === 0) {
    errors.push("Product name is required");
  }

  if (!data.shortDescription || data.shortDescription.trim().length === 0) {
    errors.push("Short description is required");
  }

  if (!data.category || data.category.trim().length === 0) {
    errors.push("Category is required");
  }

  if (!data.subcategory || data.subcategory.trim().length === 0) {
    errors.push("Subcategory is required");
  }

  if (!data.heroImageUrl || data.heroImageUrl.trim().length === 0) {
    errors.push("Hero image URL is required");
  }

  if (!data.productType || !["product", "kit"].includes(data.productType)) {
    errors.push('Product type must be either "product" or "kit"');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
