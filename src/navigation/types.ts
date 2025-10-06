// src/navigation/types.ts

export type CourseType = 'Starter' | 'Main Course' | 'Dessert';

export type NewItemType = {
  name: string;
  description: string;
  price: string;
  vegetarian: boolean;
  vegan: boolean;
  course: CourseType; // This is for 'Starter' | 'Main Course' | 'Dessert'
  imageUri?: string;
};


export type MenuItemType = NewItemType & {
  id: string;
  
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
    filters?: FiltersType | undefined;
    
    // ✅ FIX 1: Add parameter to accept the course filter state from FilterScreen
    selectedCourse?: CourseType | null | undefined; 
  } | undefined; // Keep the whole route optional if needed, but parameter is now defined.
  
  AddItem: undefined;
  
  Filter: { 
    currentFilters?: FiltersType;
    
    // ✅ FIX 2: Add parameter to pass the current course filter state TO FilterScreen
    currentCourse?: CourseType | null;
  } | undefined;
};