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
  "mcdonald's fries large": { calories: 510, protein_g: 6, carbohydrates_g: 67.5, fat_g: 24, company: "McDonald's" },
  "large fries mcdonald's": { calories: 510, protein_g: 6, carbohydrates_g: 67.5, fat_g: 24, company: "McDonald's" },
  "mcdonald's large fries": { calories: 510, protein_g: 6, carbohydrates_g: 67.5, fat_g: 24, company: "McDonald's" },
  "large fries": { calories: 510, protein_g: 6, carbohydrates_g: 67.5, fat_g: 24, company: "McDonald's" },
  "mcchicken": { calories: 400, protein_g: 14, carbohydrates_g: 36.5, fat_g: 22, company: "McDonald's" },
  "mcdonald's mcchicken": { calories: 400, protein_g: 14, carbohydrates_g: 36.5, fat_g: 22, company: "McDonald's" },
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
  
  // Combo component items
  // McDonald's
  "medium fries": { calories: 320, protein_g: 4, carbohydrates_g: 43, fat_g: 15, company: "McDonald's" },
  "med fries": { calories: 320, protein_g: 4, carbohydrates_g: 43, fat_g: 15, company: "McDonald's" },
  "medium fry": { calories: 320, protein_g: 4, carbohydrates_g: 43, fat_g: 15, company: "McDonald's" },
  "med fry": { calories: 320, protein_g: 4, carbohydrates_g: 43, fat_g: 15, company: "McDonald's" },
  "mcdonald's medium fries": { calories: 320, protein_g: 4, carbohydrates_g: 43, fat_g: 15, company: "McDonald's" },
  "mcdonald's med fries": { calories: 320, protein_g: 4, carbohydrates_g: 43, fat_g: 15, company: "McDonald's" },
  "medium coke": { calories: 210, protein_g: 0, carbohydrates_g: 58, fat_g: 0, company: "McDonald's" },
  "medium coca cola": { calories: 210, protein_g: 0, carbohydrates_g: 58, fat_g: 0, company: "McDonald's" },
  "mcdonald's medium coke": { calories: 210, protein_g: 0, carbohydrates_g: 58, fat_g: 0, company: "McDonald's" },
  
  // KFC
  "regular fries": { calories: 280, protein_g: 3, carbohydrates_g: 35, fat_g: 14, company: "KFC" },
  "kfc regular fries": { calories: 280, protein_g: 3, carbohydrates_g: 35, fat_g: 14, company: "KFC" },
  "regular pepsi": { calories: 150, protein_g: 0, carbohydrates_g: 41, fat_g: 0, company: "KFC" },
  "kfc regular pepsi": { calories: 150, protein_g: 0, carbohydrates_g: 41, fat_g: 0, company: "KFC" },
  "2 piece original recipe chicken": { calories: 480, protein_g: 28, carbohydrates_g: 18, fat_g: 32, company: "KFC" },
  "kfc 2 piece chicken": { calories: 480, protein_g: 28, carbohydrates_g: 18, fat_g: 32, company: "KFC" },
  
  // Subway
  "cookie": { calories: 220, protein_g: 2, carbohydrates_g: 30, fat_g: 10, company: "Subway" },
  "subway cookie": { calories: 220, protein_g: 2, carbohydrates_g: 30, fat_g: 10, company: "Subway" },
  "regular drink": { calories: 150, protein_g: 0, carbohydrates_g: 39, fat_g: 0, company: "Subway" },
  "subway regular drink": { calories: 150, protein_g: 0, carbohydrates_g: 39, fat_g: 0, company: "Subway" },
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

