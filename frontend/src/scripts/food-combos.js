/**
 * Food Combos Database
 * 
 * This file contains combo meals from various fast food chains
 * with their component items. When a combo is requested, it will
 * be broken down into individual items.
 */

export const FOOD_COMBOS = {
  // McDonald's Combos
  "big mac combo": {
    items: [
      { name: "Big Mac", calories: 550, protein_g: 25, carbohydrates_g: 45, fat_g: 33 },
      { name: "Medium Fries", calories: 320, protein_g: 4, carbohydrates_g: 43, fat_g: 15 },
      { name: "Medium Coke", calories: 210, protein_g: 0, carbohydrates_g: 58, fat_g: 0 }
    ],
    company: "McDonald's",
    totalCalories: 1080
  },
  "big mac meal": {
    items: [
      { name: "Big Mac", calories: 550, protein_g: 25, carbohydrates_g: 45, fat_g: 33 },
      { name: "Medium Fries", calories: 320, protein_g: 4, carbohydrates_g: 43, fat_g: 15 },
      { name: "Medium Coke", calories: 210, protein_g: 0, carbohydrates_g: 58, fat_g: 0 }
    ],
    company: "McDonald's",
    totalCalories: 1080
  },
  "quarter pounder combo": {
    items: [
      { name: "Quarter Pounder with Cheese", calories: 520, protein_g: 26, carbohydrates_g: 42, fat_g: 26 },
      { name: "Medium Fries", calories: 320, protein_g: 4, carbohydrates_g: 43, fat_g: 15 },
      { name: "Medium Coke", calories: 210, protein_g: 0, carbohydrates_g: 58, fat_g: 0 }
    ],
    company: "McDonald's",
    totalCalories: 1050
  },
  "quarter pounder meal": {
    items: [
      { name: "Quarter Pounder with Cheese", calories: 520, protein_g: 26, carbohydrates_g: 42, fat_g: 26 },
      { name: "Medium Fries", calories: 320, protein_g: 4, carbohydrates_g: 43, fat_g: 15 },
      { name: "Medium Coke", calories: 210, protein_g: 0, carbohydrates_g: 58, fat_g: 0 }
    ],
    company: "McDonald's",
    totalCalories: 1050
  },
  "mcchicken combo": {
    items: [
      { name: "McChicken", calories: 400, protein_g: 14, carbohydrates_g: 36.5, fat_g: 22 },
      { name: "Medium Fries", calories: 320, protein_g: 4, carbohydrates_g: 43, fat_g: 15 },
      { name: "Medium Coke", calories: 210, protein_g: 0, carbohydrates_g: 58, fat_g: 0 }
    ],
    company: "McDonald's",
    totalCalories: 930
  },
  "mc chicken combo": {
    items: [
      { name: "McChicken", calories: 400, protein_g: 14, carbohydrates_g: 36.5, fat_g: 22 },
      { name: "Medium Fries", calories: 320, protein_g: 4, carbohydrates_g: 43, fat_g: 15 },
      { name: "Medium Coke", calories: 210, protein_g: 0, carbohydrates_g: 58, fat_g: 0 }
    ],
    company: "McDonald's",
    totalCalories: 930
  },
  "mcchicken meal": {
    items: [
      { name: "McChicken", calories: 400, protein_g: 14, carbohydrates_g: 36.5, fat_g: 22 },
      { name: "Medium Fries", calories: 320, protein_g: 4, carbohydrates_g: 43, fat_g: 15 },
      { name: "Medium Coke", calories: 210, protein_g: 0, carbohydrates_g: 58, fat_g: 0 }
    ],
    company: "McDonald's",
    totalCalories: 930
  },
  "mc chicken meal": {
    items: [
      { name: "McChicken", calories: 400, protein_g: 14, carbohydrates_g: 36.5, fat_g: 22 },
      { name: "Medium Fries", calories: 320, protein_g: 4, carbohydrates_g: 43, fat_g: 15 },
      { name: "Medium Coke", calories: 210, protein_g: 0, carbohydrates_g: 58, fat_g: 0 }
    ],
    company: "McDonald's",
    totalCalories: 930
  },
  "filet o fish combo": {
    items: [
      { name: "Filet-O-Fish", calories: 390, protein_g: 15, carbohydrates_g: 38, fat_g: 19 },
      { name: "Medium Fries", calories: 320, protein_g: 4, carbohydrates_g: 43, fat_g: 15 },
      { name: "Medium Coke", calories: 210, protein_g: 0, carbohydrates_g: 58, fat_g: 0 }
    ],
    company: "McDonald's",
    totalCalories: 920
  },
  "filet o fish meal": {
    items: [
      { name: "Filet-O-Fish", calories: 390, protein_g: 15, carbohydrates_g: 38, fat_g: 19 },
      { name: "Medium Fries", calories: 320, protein_g: 4, carbohydrates_g: 43, fat_g: 15 },
      { name: "Medium Coke", calories: 210, protein_g: 0, carbohydrates_g: 58, fat_g: 0 }
    ],
    company: "McDonald's",
    totalCalories: 920
  },
  "filetofish combo": {
    items: [
      { name: "Filet-O-Fish", calories: 390, protein_g: 15, carbohydrates_g: 38, fat_g: 19 },
      { name: "Medium Fries", calories: 320, protein_g: 4, carbohydrates_g: 43, fat_g: 15 },
      { name: "Medium Coke", calories: 210, protein_g: 0, carbohydrates_g: 58, fat_g: 0 }
    ],
    company: "McDonald's",
    totalCalories: 920
  },
  "filetofish meal": {
    items: [
      { name: "Filet-O-Fish", calories: 390, protein_g: 15, carbohydrates_g: 38, fat_g: 19 },
      { name: "Medium Fries", calories: 320, protein_g: 4, carbohydrates_g: 43, fat_g: 15 },
      { name: "Medium Coke", calories: 210, protein_g: 0, carbohydrates_g: 58, fat_g: 0 }
    ],
    company: "McDonald's",
    totalCalories: 920
  },
  
  // KFC Combos
  "kfc zinger combo": {
    items: [
      { name: "Zinger Burger", calories: 450, protein_g: 22, carbohydrates_g: 38, fat_g: 22 },
      { name: "Regular Fries", calories: 280, protein_g: 3, carbohydrates_g: 35, fat_g: 14 },
      { name: "Regular Pepsi", calories: 150, protein_g: 0, carbohydrates_g: 41, fat_g: 0 }
    ],
    company: "KFC",
    totalCalories: 880
  },
  "kfc zinger meal": {
    items: [
      { name: "Zinger Burger", calories: 450, protein_g: 22, carbohydrates_g: 38, fat_g: 22 },
      { name: "Regular Fries", calories: 280, protein_g: 3, carbohydrates_g: 35, fat_g: 14 },
      { name: "Regular Pepsi", calories: 150, protein_g: 0, carbohydrates_g: 41, fat_g: 0 }
    ],
    company: "KFC",
    totalCalories: 880
  },
  "kfc quarter pack combo": {
    items: [
      { name: "2-Piece Original Recipe Chicken", calories: 480, protein_g: 28, carbohydrates_g: 18, fat_g: 32 },
      { name: "Regular Fries", calories: 280, protein_g: 3, carbohydrates_g: 35, fat_g: 14 },
      { name: "Regular Pepsi", calories: 150, protein_g: 0, carbohydrates_g: 41, fat_g: 0 }
    ],
    company: "KFC",
    totalCalories: 910
  },
  "kfc quarter pack meal": {
    items: [
      { name: "2-Piece Original Recipe Chicken", calories: 480, protein_g: 28, carbohydrates_g: 18, fat_g: 32 },
      { name: "Regular Fries", calories: 280, protein_g: 3, carbohydrates_g: 35, fat_g: 14 },
      { name: "Regular Pepsi", calories: 150, protein_g: 0, carbohydrates_g: 41, fat_g: 0 }
    ],
    company: "KFC",
    totalCalories: 910
  },
  "kfc lunch box": {
    items: [
      { name: "Original Recipe Chicken (1 piece)", calories: 320, protein_g: 20, carbohydrates_g: 11, fat_g: 22 },
      { name: "Regular Fries", calories: 280, protein_g: 3, carbohydrates_g: 35, fat_g: 14 },
      { name: "Regular Pepsi", calories: 150, protein_g: 0, carbohydrates_g: 41, fat_g: 0 }
    ],
    company: "KFC",
    totalCalories: 750
  },
  "kfc lunch box meal": {
    items: [
      { name: "Original Recipe Chicken (1 piece)", calories: 320, protein_g: 20, carbohydrates_g: 11, fat_g: 22 },
      { name: "Regular Fries", calories: 280, protein_g: 3, carbohydrates_g: 35, fat_g: 14 },
      { name: "Regular Pepsi", calories: 150, protein_g: 0, carbohydrates_g: 41, fat_g: 0 }
    ],
    company: "KFC",
    totalCalories: 750
  },
  "lunch box kfc": {
    items: [
      { name: "Original Recipe Chicken (1 piece)", calories: 320, protein_g: 20, carbohydrates_g: 11, fat_g: 22 },
      { name: "Regular Fries", calories: 280, protein_g: 3, carbohydrates_g: 35, fat_g: 14 },
      { name: "Regular Pepsi", calories: 150, protein_g: 0, carbohydrates_g: 41, fat_g: 0 }
    ],
    company: "KFC",
    totalCalories: 750
  },
  
  // Subway Combos
  "subway footlong combo": {
    items: [
      { name: "Footlong BMT", calories: 410, protein_g: 20, carbohydrates_g: 46, fat_g: 14 },
      { name: "Cookie", calories: 220, protein_g: 2, carbohydrates_g: 30, fat_g: 10 },
      { name: "Regular Drink", calories: 150, protein_g: 0, carbohydrates_g: 39, fat_g: 0 }
    ],
    company: "Subway",
    totalCalories: 780
  },
  "subway footlong meal": {
    items: [
      { name: "Footlong BMT", calories: 410, protein_g: 20, carbohydrates_g: 46, fat_g: 14 },
      { name: "Cookie", calories: 220, protein_g: 2, carbohydrates_g: 30, fat_g: 10 },
      { name: "Regular Drink", calories: 150, protein_g: 0, carbohydrates_g: 39, fat_g: 0 }
    ],
    company: "Subway",
    totalCalories: 780
  }
};

/**
 * Normalizes combo name for matching
 * @param {string} comboName - The combo name to normalize
 * @returns {string} - Normalized name for lookup
 */
export function normalizeComboName(comboName) {
  // First remove parentheses and their content, then normalize
  let normalized = comboName
    .toLowerCase()
    .trim()
    .replace(/\([^)]*\)/g, '') // Remove parentheses and content first
    .trim();
  
  // Handle common word contractions and variations
  // "mc chicken" -> "mcchicken", "mc chicken combo" -> "mcchicken combo"
  normalized = normalized.replace(/\bmc\s+chicken\b/g, 'mcchicken');
  // "filet o fish" -> "filetofish" or keep as "filet o fish" (both work)
  normalized = normalized.replace(/\bfilet\s+o\s+fish\b/g, 'filetofish');
  
  // Then remove special characters (but keep spaces for word separation)
  normalized = normalized
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  return normalized;
}

/**
 * Checks if a food item is a combo and returns the component items
 * @param {string} foodName - The food item name to check
 * @returns {object|null} - The combo data with items array or null
 */
export function getComboItems(foodName) {
  const normalized = normalizeComboName(foodName);
  
  // Direct match
  if (FOOD_COMBOS[normalized]) {
    return FOOD_COMBOS[normalized];
  }
  
  // Handle variations like "mcchicken combo (mcdonald's)" or "mcdonald's mcchicken combo"
  // Remove company names and parentheses for matching
  const cleaned = normalized
    .replace(/\([^)]*\)/g, '') // Remove parentheses content
    .replace(/mcdonald's|kfc|subway|burger king|pizza hut|starbucks/gi, '') // Remove company names
    .trim()
    .replace(/\s+/g, ' '); // Normalize spaces
  
  if (FOOD_COMBOS[cleaned]) {
    return FOOD_COMBOS[cleaned];
  }
  
  // Partial match with improved normalization
  // First try to match the cleaned version against keys
  for (const [key, value] of Object.entries(FOOD_COMBOS)) {
    // Normalize the key for comparison
    const normalizedKey = normalizeComboName(key);
    
    // Check if cleaned version matches normalized key
    if (cleaned === normalizedKey || cleaned.includes(normalizedKey) || normalizedKey.includes(cleaned)) {
      return value;
    }
    // Also check original normalized against normalized key
    if (normalized === normalizedKey || normalized.includes(normalizedKey) || normalizedKey.includes(normalized)) {
      return value;
    }
  }
  
  // Final fallback: try direct partial matching without normalization
  for (const [key, value] of Object.entries(FOOD_COMBOS)) {
    // Check if cleaned version matches key
    if (cleaned.includes(key) || key.includes(cleaned)) {
      return value;
    }
    // Also check original normalized against key
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  
  return null;
}

/**
 * Expands a combo into individual food items
 * @param {string} comboName - The combo name
 * @param {number} quantity - How many times to repeat the combo
 * @returns {Array} - Array of individual food items from the combo
 */
export function expandCombo(comboName, quantity = 1) {
  const combo = getComboItems(comboName);
  
  if (!combo) {
    return null;
  }
  
  // Repeat all items in the combo for the specified quantity
  const expandedItems = [];
  for (let i = 0; i < quantity; i++) {
    combo.items.forEach(item => {
      expandedItems.push({
        foodName: item.name,
        quantity: 1
      });
    });
  }
  
  return expandedItems;
}

