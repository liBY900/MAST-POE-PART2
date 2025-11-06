import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; 
import type { RootStackParamList, MenuItemType, NewItemType, FiltersType, CourseType } from '../navigation/types';

export const COURSES: CourseType[] = ['Starter', 'Main Course', 'Dessert'];

type HomeRouteProp = RouteProp<RootStackParamList, 'Home'>;
type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const initialMenuItems: MenuItemType[] = [
  { id: '1', name: 'Grilled Salmon', description: 'With lemon and herbs', price: 'R250', image: require('../../assets/salmon.jpeg'), vegetarian: false, vegan: false, course: 'Main Course' },
  { id: '2', name: 'Mushroom Risotto', description: 'Creamy risotto with wild mushrooms', price: 'R180', image: require('../../assets/risotto.jpeg'), vegetarian: true, vegan: true, course: 'Main Course' },
  { id: '3', name: 'Chocolate Lava Cake', description: 'Warm cake with a molten center', price: 'R95', image: require('../../assets/lava-cake.jpeg'), vegetarian: true, vegan: false, course: 'Dessert' },
  { id: '4', name: 'Lobster and Pasta', description: 'Fresh Atlantic lobster with linguine in a rich butter-garlic sauce', price: 'R450', image: require('../../assets/lobster-pasta.jpeg'), vegetarian: false, vegan: false, course: 'Main Course' },
  { id: '5', name: 'Coconut Rice Bowls', description: 'Fluffy coconut rice topped with pan-seared tofu and fresh vegetables', price: 'R160', image: require('../../assets/Coconut Rice Bowls.jpeg'), vegetarian: true, vegan: true, course: 'Starter' },
  { id: '6', name: 'Veg Pizza', description: 'Classic stone-baked pizza topped with fresh seasonal vegetables and mozzarella.', price: 'R250', image: require('../../assets/Veg Pizza.jpeg'), vegetarian: true, vegan: false, course: 'Main Course' }
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavProp>();
  const route = useRoute<HomeRouteProp>();

  const [menuItems, setMenuItems] = useState<MenuItemType[]>(initialMenuItems);
  const [filteredItems, setFilteredItems] = useState<MenuItemType[]>(initialMenuItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilters, setCurrentFilters] = useState<FiltersType | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null);

  const calculateAveragePrice = (course: string) => {
    const items = menuItems.filter(item => item.course === course);
    const total = items.reduce((sum, i) => sum + parseInt(i.price.replace('R', ''), 10), 0);
    return items.length ? (total / items.length).toFixed(2) : '0.00';
  };

  useEffect(() => {
    if (route.params?.newItem) {
      const newImageSource = route.params.newItem.imageUri
        ? { uri: route.params.newItem.imageUri } as any 
        : require('../../assets/placeholder.jpeg');

      const newItem: MenuItemType = {
        ...route.params.newItem,
        id: Date.now().toString(),
        image: newImageSource
      };

      setMenuItems(prev => [newItem, ...prev]);
      navigation.setParams({ newItem: undefined });
    }
  }, [route.params?.newItem, navigation]);

  useEffect(() => {
    let items = [...menuItems];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      items = items.filter(i =>
        i.name.toLowerCase().includes(term) ||
        i.description.toLowerCase().includes(term)
      );
    }

    let filters = route.params?.filters || currentFilters;
    if (route.params?.filters !== undefined) {
      setCurrentFilters(route.params.filters || null); 
      filters = route.params.filters; 
      navigation.setParams({ filters: undefined });
    } 
    
    if (route.params?.selectedCourse !== undefined) {
        setSelectedCourse(route.params.selectedCourse);
        navigation.setParams({ selectedCourse: undefined });
    }

    if (filters) {
      const { isVegetarian, isVegan, priceRange } = filters;
      if (isVegetarian) items = items.filter(i => i.vegetarian);
      if (isVegan) items = items.filter(i => i.vegan);
      items = items.filter(i => {
        const numericPrice = parseInt(String(i.price).replace('R', ''), 10) || 0;
        return numericPrice <= priceRange;
      });
    }

    if (selectedCourse) {
      items = items.filter(i => i.course === selectedCourse);
    }

    setFilteredItems(items);
  }, [
    route.params?.filters, 
    route.params?.selectedCourse,
    menuItems, 
    searchTerm, 
    selectedCourse,
    currentFilters, 
    navigation
  ]);

  const handleCourseFilter = (course: CourseType) => {
    setSelectedCourse(prev => (prev === course ? null : course));
  };

  const renderItem = ({ item }: { item: MenuItemType }) => (
    <View style={styles.menuItem}>
      {item.image && (
        <Image
          source={typeof item.image === 'number' ? item.image : { uri: item.image.uri || item.image.name }}
          style={styles.menuImage}
        />
      )}
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.courseTag}>{item.course}</Text>
        <Text style={styles.itemDescription} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.itemPrice}>R{item.price.replace('R', '')}</Text>
        <View style={styles.tagContainer}>
          {item.vegetarian && <Text style={styles.dietTag}>🌱 Veg</Text>}
          {item.vegan && <Text style={styles.dietTag}>Vgn</Text>}
        </View>
      </View>
    </View>
  );

  const renderCourseFilter = ({ item }: { item: CourseType }) => (
    <TouchableOpacity
      style={[styles.courseButton, selectedCourse === item && styles.courseButtonActive]}
      onPress={() => handleCourseFilter(item)}
    >
      <Text style={[styles.courseButtonText, selectedCourse === item && styles.courseButtonTextActive]}>
        {item}
      </Text>
    </TouchableOpacity>
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

        {/* Course Filter List */}
        <FlatList
          data={COURSES}
          renderItem={renderCourseFilter}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.courseList}
          contentContainerStyle={styles.courseListContent}
        />

        {/* --- Average Prices Section --- */}
        <View style={styles.averageContainer}>
          <Text style={styles.averageTitle}>Average Prices by Course</Text>
          <View style={styles.averageRow}>
            <Text style={styles.averageLabel}>Starter:</Text>
            <Text style={styles.averageValue}>R{calculateAveragePrice('Starter')}</Text>
          </View>
          <View style={styles.averageRow}>
            <Text style={styles.averageLabel}>Main Course:</Text>
            <Text style={styles.averageValue}>R{calculateAveragePrice('Main Course')}</Text>
          </View>
          <View style={styles.averageRow}>
            <Text style={styles.averageLabel}>Dessert:</Text>
            <Text style={styles.averageValue}>R{calculateAveragePrice('Dessert')}</Text>
          </View>
        </View>
        {/* --- End Average Prices Section --- */}

        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>No items found matching your criteria.</Text>
          )}
          style={{ flex: 1 }} 
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => navigation.navigate('Filter', { 
                currentFilters: currentFilters || { isVegetarian: false, isVegan: false, priceRange: 500 } as FiltersType,
                currentCourse: selectedCourse 
            })}
          >
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>

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
  courseList: { marginBottom: 10, marginTop: 5, maxHeight: 40 },
  courseListContent: { paddingRight: 30 },
  courseButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  courseButtonActive: { backgroundColor: '#8800C7', borderColor: '#8800C7' },
  courseButtonText: { color: '#333', fontWeight: '600', fontSize: 14 },
  courseButtonTextActive: { color: '#fff' },
  courseTag: { fontSize: 12, color: '#8800C7', fontWeight: 'bold', marginBottom: 5 },
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
  dietTag: {
    fontSize: 12,
    color: '#fff',
    backgroundColor: '#00C788',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 5,
  },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#888' },
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
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 30, lineHeight: 30 },
  filterButton: {
    backgroundColor: '#8800C7',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 4,
  },
  filterButtonText: { color: '#fff', fontWeight: 'bold' },

  // --- NEW STYLES FOR AVERAGES ---
  averageContainer: {
    backgroundColor: '#f9f5ff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e8d4ff',
  },
  averageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8800C7',
    marginBottom: 10,
  },
  averageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  averageLabel: {
    fontSize: 14,
    color: '#555',
  },
  averageValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default HomeScreen;
