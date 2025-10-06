import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Button, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, FiltersType, CourseType } from '../navigation/types.ts';


const COURSES: CourseType[] = ['Starter', 'Main Course', 'Dessert'];

type FilterNavProp = NativeStackNavigationProp<RootStackParamList, 'Filter'>;
type FilterRouteProp = RouteProp<RootStackParamList, 'Filter'>;


const FilterScreen: React.FC = () => {
  const navigation = useNavigation<FilterNavProp>();
  const route = useRoute<FilterRouteProp>();
  
  // Getting initial dietary/price filters
  const initialFilters = route.params?.currentFilters || { isVegetarian: false, isVegan: false, priceRange: 500 };
  
  // Getting initial course filter state from HomeScreen
  const initialCourse = route.params?.currentCourse || null;

  const [isVegetarian, setIsVegetarian] = useState(initialFilters.isVegetarian);
  const [isVegan, setIsVegan] = useState(initialFilters.isVegan);
  const [priceRange, setPriceRange] = useState(initialFilters.priceRange);
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(initialCourse); 
  
  const toggleCourseFilter = (course: CourseType) => {
    setSelectedCourse(prev => (prev === course ? null : course));
  };


  const handleApplyFilters = () => {
    const filters: FiltersType = {
      isVegetarian,
      isVegan,
      priceRange,
    };
selectedCourse
    // Navigating back to Home and pass BOTH the filters object AND the 
    navigation.navigate('Home', { filters, selectedCourse }); 
  };

  const handleClearFilters = () => {
    // Navigating back to Home with undefined filters to clear dietary/price
    navigation.navigate('Home', { filters: undefined, selectedCourse: null });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        
        {/* --- Course Filters --- */}
        <Text style={styles.header}>Course Type</Text>
        <View style={styles.courseContainer}>
            {COURSES.map(course => (
                <TouchableOpacity
                    key={course}
                    style={[
                        styles.courseButton,
                        selectedCourse === course && styles.courseButtonActive
                    ]}
                    onPress={() => toggleCourseFilter(course)}
                >
                    <Text style={[
                        styles.courseButtonText,
                        selectedCourse === course && styles.courseButtonTextActive
                    ]}>
                        {course}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>

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

// --- Styles  ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 15, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 },
  
  // STYLES FOR COURSE FILTER
  courseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    justifyContent: 'flex-start',
  },
  courseButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#eee',
  },
  courseButtonActive: {
    backgroundColor: '#8800C7',
    borderColor: '#8800C7',
  },
  courseButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  courseButtonTextActive: {
    color: '#fff',
  },
  
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