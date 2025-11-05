/**
 * Standardized Nutritional Database
 * 
 * This file contains globally accepted, standardized nutritional data
 * for common restaurant items. These values are used to ensure consistency
 * when the same item is requested multiple times.
 * 
 * All values are per single serving/item unless otherwise noted.
 */

export const STANDARDIZED_FOODS = {
  // McDonald's
  "big mac": { calories: 550, protein_g: 25, carbohydrates_g: 45, fat_g: 33, company: "McDonald's" },
  "big mac (mcdonald's)": { calories: 550, protein_g: 25, carbohydrates_g: 45, fat_g: 33, company: "McDonald's" },
  "mcdonald's big mac": { calories: 550, protein_g: 25, carbohydrates_g: 45, fat_g: 33, company: "McDonald's" },
  "quarter pounder": { calories: 520, protein_g: 26, carbohydrates_g: 42, fat_g: 26, company: "McDonald's" },
  "quarter pounder with cheese": { calories: 520, protein_g: 26, carbohydrates_g: 42, fat_g: 26, company: "McDonald's" },
  "mcdonald's fries large": { calories: 510, protein_g: 6, carbohydrates_g: 66, fat_g: 24, company: "McDonald's" },
  "large fries mcdonald's": { calories: 510, protein_g: 6, carbohydrates_g: 66, fat_g: 24, company: "McDonald's" },
  "mcdonald's large fries": { calories: 510, protein_g: 6, carbohydrates_g: 66, fat_g: 24, company: "McDonald's" },
  "mcchicken": { calories: 400, protein_g: 14, carbohydrates_g: 39, fat_g: 22, company: "McDonald's" },
  "mcdonald's mcchicken": { calories: 400, protein_g: 14, carbohydrates_g: 39, fat_g: 22, company: "McDonald's" },
  "filet o fish": { calories: 390, protein_g: 15, carbohydrates_g: 38, fat_g: 19, company: "McDonald's" },
  "mcdonald's filet o fish": { calories: 390, protein_g: 15, carbohydrates_g: 38, fat_g: 19, company: "McDonald's" },
  
  // KFC
  "kfc zinger burger": { calories: 450, protein_g: 22, carbohydrates_g: 38, fat_g: 22, company: "KFC" },
  "zinger burger kfc": { calories: 450, protein_g: 22, carbohydrates_g: 38, fat_g: 22, company: "KFC" },
  "kfc original recipe chicken": { calories: 320, protein_g: 20, carbohydrates_g: 11, fat_g: 22, company: "KFC" },
  "kfc wicked wings 3 piece": { calories: 350, protein_g: 18, carbohydrates_g: 12, fat_g: 25, company: "KFC" },
  
  // Subway
  "subway footlong bmt": { calories: 410, protein_g: 20, carbohydrates_g: 46, fat_g: 14, company: "Subway" },
  "subway 6 inch bmt": { calories: 290, protein_g: 14, carbohydrates_g: 33, fat_g: 10, company: "Subway" },
  
  // Starbucks
  "starbucks caffe latte grande": { calories: 190, protein_g: 13, carbohydrates_g: 18, fat_g: 7, company: "Starbucks" },
  "starbucks grande latte": { calories: 190, protein_g: 13, carbohydrates_g: 18, fat_g: 7, company: "Starbucks" },
};

/**
 * Normalizes food item names for matching
 * @param {string} foodName - The food item name to normalize
 * @returns {string} - Normalized name for lookup
 */
export function normalizeFoodName(foodName) {
  return foodName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Checks if a food item exists in the standardized database
 * @param {string} foodName - The food item name to check
 * @returns {object|null} - The standardized food data with displayName or null
 */
export function getStandardizedFood(foodName) {
  const normalized = normalizeFoodName(foodName);
  
  // Direct match
  if (STANDARDIZED_FOODS[normalized]) {
    return {
      ...STANDARDIZED_FOODS[normalized],
      displayName: foodName // Preserve original for display
    };
  }
  
  // Partial match (e.g., "big mac" matches "big mac (mcdonald's)")
  for (const [key, value] of Object.entries(STANDARDIZED_FOODS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return {
        ...value,
        displayName: foodName // Preserve original for display
      };
    }
  }
  
  return null;
}

