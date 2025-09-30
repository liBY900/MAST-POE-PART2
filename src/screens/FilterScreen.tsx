// src/screens/FilterScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Button, ScrollView, SafeAreaView } from 'react-native';
import Slider from '@react-native-community/slider'; // Requires installing '@react-native-community/slider'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, FiltersType } from '../navigation/types.ts';

type FilterNavProp = NativeStackNavigationProp<RootStackParamList, 'Filter'>;
type FilterRouteProp = RouteProp<RootStackParamList, 'Filter'>;

const FilterScreen: React.FC = () => {
  const navigation = useNavigation<FilterNavProp>();
  const route = useRoute<FilterRouteProp>();
  
  // Initialize state with current filters passed from Home Screen, or defaults
  const initialFilters = route.params?.currentFilters || { isVegetarian: false, isVegan: false, priceRange: 500 };
  
  const [isVegetarian, setIsVegetarian] = useState(initialFilters.isVegetarian);
  const [isVegan, setIsVegan] = useState(initialFilters.isVegan);
  const [priceRange, setPriceRange] = useState(initialFilters.priceRange);

  const handleApplyFilters = () => {
    const filters: FiltersType = { 
      isVegetarian, 
      isVegan, 
      priceRange 
    };
    
    // Navigate back to Home and pass the filters
    navigation.navigate('Home', { filters });
  };
  
  const handleClearFilters = () => {
      // Navigate back to Home with undefined filters to clear them
      navigation.navigate('Home', { filters: undefined });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        
        {/* Dietary Filters */}
        <Text style={styles.header}>Dietary Requirements</Text>
        
        <View style={styles.filterOption}>
          <Text style={styles.filterLabel}>Vegetarian</Text>
          <Switch 
            value={isVegetarian} 
            onValueChange={setIsVegetarian} 
            trackColor={{ false: '#767577', true: '#00C788' }}
            thumbColor={isVegetarian ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.filterOption}>
          <Text style={styles.filterLabel}>Vegan</Text>
          <Switch 
            value={isVegan} 
            onValueChange={setIsVegan} 
            trackColor={{ false: '#767577', true: '#00C788' }}
            thumbColor={isVegan ? '#fff' : '#f4f3f4'}
            disabled={!isVegetarian} // Must be vegetarian to be vegan
          />
        </View>

        {/* Price Filter */}
        <Text style={styles.header}>Price Range</Text>
        <Text style={styles.priceText}>Max Price: R{priceRange.toFixed(0)}</Text>
        <Slider
          style={styles.slider}
          minimumValue={50}
          maximumValue={500}
          step={10}
          value={priceRange}
          onValueChange={setPriceRange}
          minimumTrackTintColor="#8800C7"
          maximumTrackTintColor="#ccc"
        />

        <View style={styles.buttonGroup}>
          <Button 
            title="Clear Filters" 
            onPress={handleClearFilters} 
            color="#C70000" 
          />
          <View style={{ width: 10 }} />
          <Button 
            title="Apply Filters" 
            onPress={handleApplyFilters} 
            color="#8800C7" 
          />
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 15, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 },
  filterOption: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 15,
  },
  filterLabel: { fontSize: 16, color: '#444' },
  priceText: { fontSize: 16, marginBottom: 10, alignSelf: 'center', fontWeight: 'bold', color: '#8800C7' },
  slider: { width: '100%', height: 40, marginBottom: 30 },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
});

export default FilterScreen;