export default function validateProductData(data, isUpdate = false) {
  const errors = [];

  const {
    productName,
    shortDescription,
    category,
    subcategory,
    price,
    sizes,
    benefits,
    features,
    heroImageUrl,
  } = data;

  // required fields (skip if update and field not provided)
  if (!isUpdate || productName !== undefined) {
    if (!productName) errors.push("Product name is required");
  }
  if (!isUpdate || shortDescription !== undefined) {
    if (!shortDescription) errors.push("Short description is required");
  }
  if (!isUpdate || category !== undefined) {
    if (!category) errors.push("Category is required");
  }
  if (!isUpdate || subcategory !== undefined) {
    if (!subcategory) errors.push("Subcategory is required");
  }
  if (!isUpdate || price !== undefined) {
    if (typeof price !== "number" || price <= 0) {
      errors.push("Price must be a positive number");
    }
  }
  if (!isUpdate || sizes !== undefined) {
    if (!Array.isArray(sizes) || sizes.length === 0) {
      errors.push("At least one size is required");
    }
  }
  if (!isUpdate || benefits !== undefined) {
    if (!Array.isArray(benefits) || benefits.length === 0) {
      errors.push("At least one benefit is required");
    }
  }
  if (!isUpdate || features !== undefined) {
    if (!Array.isArray(features) || features.length === 0) {
      errors.push("At least one feature is required");
    }
  }
  if (!isUpdate || heroImageUrl !== undefined) {
    if (!heroImageUrl) errors.push("Hero image URL is required");
  }

  return errors;
}
