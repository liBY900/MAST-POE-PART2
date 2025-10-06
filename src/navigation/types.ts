// src/navigation/types.ts

// Define the available course categories
export type CourseType = 'Starter' | 'Main Course' | 'Dessert' | 'Drink' | 'Side';

// --- New Item Structure (Used for passing data from AddItemScreen to HomeScreen) ---
export type NewItemType = {
  name: string;
  description: string;
  price: string; // e.g., '250' (before 'R' is added)
  vegetarian: boolean;
  vegan: boolean;
  // NEW FIELD: Course selection
  course: CourseType;
  // NEW FIELD: Image URI from the image upload
  imageUri?: string; 
};

// --- Menu Item Structure (Used for displaying existing items) ---
export type MenuItemType = NewItemType & {
  id: string;
  // NOTE: 'image' is used for local static assets (like require('...')). 
  // We keep it as 'any' for compatibility with existing local images, 
  // but for user-uploaded items, you'll use 'imageUri' from NewItemType.
  image: any; 
};

// --- Filter Structure (Used for passing data to/from FilterScreen) ---
export type FiltersType = {
  isVegetarian: boolean;
  isVegan: boolean;
  priceRange: number; // Max price to display
};

// --- Navigation Stack Parameters ---
export type RootStackParamList = {
  Home: { 
    newItem?: NewItemType; 
    filters?: FiltersType;
  } | undefined;
  AddItem: undefined;
  Filter: { currentFilters?: FiltersType } | undefined;
};