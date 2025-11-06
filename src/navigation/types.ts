// src/navigation/types.ts

export type CourseType = 'Starter' | 'Main Course' | 'Dessert';

export type NewItemType = {
  name: string;
  description: string;
  price: string;
  vegetarian: boolean;
  vegan: boolean;
  course: CourseType; // 'Starter' | 'Main Course' | 'Dessert'
  imageUri?: string;
};

export type MenuItemType = NewItemType & {
  id: string;
  image: any;
};

// --- Filter Structure ---
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
    editedItem?: MenuItemType;
    selectedCourse?: CourseType | null | undefined; 
  } | undefined;

  // ✅ FIXED: Allow AddItem to receive an editItem param
  AddItem: { 
    editItem?: MenuItemType;
  } | undefined;

  Filter: { 
    currentFilters?: FiltersType;
    currentCourse?: CourseType | null;
  } | undefined;
};
