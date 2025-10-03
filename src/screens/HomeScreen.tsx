// src/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, MenuItemType, NewItemType, FiltersType } from '../navigation/types';



type HomeRouteProp = RouteProp<RootStackParamList, 'Home'>;
type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;


const initialMenuItems: MenuItemType[] = [
  { id: '1', name: 'Grilled Salmon', description: 'With lemon and herbs', price: 'R250', image: require('../../assets/salmon.jpeg'), vegetarian: false, vegan: false },
  { id: '2', name: 'Mushroom Risotto', description: 'Creamy risotto with wild mushrooms', price: 'R180', image: require('../../assets/risotto.jpeg'), vegetarian: true, vegan: true },
  { id: '3', name: 'Chocolate Lava Cake', description: 'Warm cake with a molten center', price: 'R95', image: require('../../assets/lava-cake.jpeg'), vegetarian: true, vegan: false },
  { id: '4', name: 'Lobster and Pasta', description: 'Fresh Atlantic lobster with linguine in a rich butter-garlic sauce', price: 'R450', image: require('../../assets/lobster-pasta.jpeg'), vegetarian: false, vegan: false },
  { id: '5', name: 'Coconut Rice Bowls', description: 'Fluffy coconut rice topped with pan-seared tofu and fresh vegetables', price: 'R160', image: require('../../assets/Coconut Rice Bowls.jpeg'), vegetarian: true, vegan: true },
  { id: '6', name: 'Veg Pizza', description: 'Classic stone-baked pizza topped with fresh seasonal vegetables and mozzarella.', price: 'R250', image: require('../../assets/Veg Pizza.jpeg'), vegetarian: true, vegan: false }
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavProp>();
  const route = useRoute<HomeRouteProp>();

  const [menuItems, setMenuItems] = useState<MenuItemType[]>(initialMenuItems);
  const [filteredItems, setFilteredItems] = useState<MenuItemType[]>(initialMenuItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilters, setCurrentFilters] = useState<FiltersType | null>(null);


  useEffect(() => {
    if (route.params?.newItem) {
      const newItem: MenuItemType = {
        ...route.params.newItem,
        id: Date.now().toString(),
        // Placeholder image for user-added items
        image: require('../../assets/placeholder.jpeg')
      };
      setMenuItems(prev => [newItem, ...prev]);
    }
  }, [route.params?.newItem]);

  //  Handling filtering and searching
  useEffect(() => {
    let items = [...menuItems];

    // Applying search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      items = items.filter(i =>
        i.name.toLowerCase().includes(term) ||
        i.description.toLowerCase().includes(term)
      );
    }

    // Applying navigation filters
    const filters = route.params?.filters || currentFilters;
    if (filters) {
      setCurrentFilters(filters);
      const { isVegetarian, isVegan, priceRange } = filters;

      if (isVegetarian) items = items.filter(i => i.vegetarian);
      if (isVegan) items = items.filter(i => i.vegan);

      items = items.filter(i => {
        const numericPrice = parseInt(String(i.price).replace('R', ''), 10) || 0;
        return numericPrice <= priceRange;
      });
    }

    setFilteredItems(items);
  }, [route.params?.filters, menuItems, searchTerm]);

  const renderItem = ({ item }: { item: MenuItemType }) => (
    <View style={styles.menuItem}>
      {item.image && <Image source={item.image} style={styles.menuImage} />}
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription} numberOfLines={2} ellipsizeMode="tail">{item.description}</Text>
        <Text style={styles.itemPrice}>R{item.price.replace('R', '')}</Text>
        <View style={styles.tagContainer}>
          {item.vegetarian && <Text style={styles.tag}>🌱 Veg</Text>}
          {item.vegan && <Text style={styles.tag}>Vgn</Text>}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search menu items..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>No items found matching your criteria.</Text>
          )}
        />

        {/* Fixed Footer/Button Container */}
        <View style={styles.buttonContainer}>
          {/* Filter Button */}
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => navigation.navigate('Filter', { currentFilters: currentFilters || { isVegetarian: false, isVegan: false, priceRange: 500 } as FiltersType })}
          >
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>

          {/* Adding Item Button */}
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => navigation.navigate('AddItem')}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: 15, paddingVertical: 5 },
  searchBar: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f5f5f5',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuImage: { width: 80, height: 80, borderRadius: 8, marginRight: 15, resizeMode: 'cover' },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  itemDescription: { fontSize: 14, color: '#666', marginTop: 2 },
  itemPrice: { fontSize: 16, color: '#8800C7', fontWeight: 'bold', marginTop: 5 },
  tagContainer: { flexDirection: 'row', marginTop: 5 },
  tag: { fontSize: 12, color: '#fff', backgroundColor: '#00C788', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, marginRight: 5 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#888' },

  // Floating Buttons
  buttonContainer: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    alignItems: 'flex-end',
  },
  floatingButton: {
    backgroundColor: '#8800C7',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  buttonText: { color: '#fff', fontSize: 30, lineHeight: 30 },
  filterButton: {
    backgroundColor: '#8800C7',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 10,
    elevation: 4,
  },
  filterButtonText: { color: '#fff', fontWeight: 'bold' },

});

export default HomeScreen;