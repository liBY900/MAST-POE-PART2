export type NewItemType = {
  name: string;
  description: string;
  price: string;
  vegetarian: boolean;
  vegan: boolean;
};

export type MenuItemType = NewItemType & {
  id: string;
  image: any;
};

export type FiltersType = {
  isVegetarian: boolean;
  isVegan: boolean;
  priceRange: number;
};

export type RootStackParamList = {
  Home: { newItem?: NewItemType; filters?: FiltersType } | undefined;
  AddItem: undefined;
  Filter: { currentFilters?: FiltersType } | undefined;
};