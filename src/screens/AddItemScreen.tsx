// src/screens/AddItemScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, SafeAreaView, Switch,TouchableOpacity, Image,} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, NewItemType, CourseType } from '../navigation/types.ts';


const COURSES: CourseType[] = ['Starter', 'Main Course', 'Dessert', 'Drink', 'Side'];
import * as ImagePicker from 'react-native-image-picker'; 



type AddItemNavProp = NativeStackNavigationProp<RootStackParamList, 'AddItem'>;

const AddItemScreen: React.FC = () => {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isVegan, setIsVegan] = useState(false);
  // NEW: State for course selection, defaulting to the first item
  const [selectedCourse, setSelectedCourse] = useState<CourseType>(COURSES[0]);
  // NEW: State for image URI
  const [imageUri, setImageUri] = useState<string | undefined>(undefined); 

  const navigation = useNavigation<AddItemNavProp>();

  // --- Image Picker Function ---
  const handleChoosePhoto = () => {
    const options: ImagePicker.ImageLibraryOptions = {
        mediaType: 'photo',
        quality: 0.5,
        maxWidth: 800,
        maxHeight: 800,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.errorMessage) {
            console.log('ImagePicker Error: ', response.errorMessage);
            Alert.alert('Error', 'Failed to pick image.');
        } else if (response.assets && response.assets.length > 0) {
            const uri = response.assets[0].uri;
            setImageUri(uri);
        }
    });
  };
  // -----------------------------

  const handleSave = () => {
    // Input Validation
    if (dishName.trim() === '' || description.trim() === '' || price.trim() === '') {
      Alert.alert('Missing Info', 'Please fill in the name, description, and price.');
      return;
    }

    if (!selectedCourse) {
        Alert.alert('Missing Info', 'Please select a course.');
        return;
    }

    // Validating price is a number
    const numericPrice = parseInt(price, 10);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      Alert.alert('Invalid Price', 'Price must be a valid number greater than zero.');
      return;
    }

    // UPDATED: Include course and imageUri
    const newItem: NewItemType = {
      name: dishName.trim(),
      description: description.trim(),
      price: price.trim(), // Stored as number string for display/math
      vegetarian: isVegetarian,
      vegan: isVegan,
      course: selectedCourse,
      imageUri: imageUri,
    };

    // Navigating back to Home and pass the new item via route params
    navigation.navigate('Home', { newItem });

    // Reset fields
    setDishName('');
    setDescription('');
    setPrice('');
    setIsVegetarian(false);
    setIsVegan(false);
    setSelectedCourse(COURSES[0]); // Reset course
    setImageUri(undefined); // Reset image
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        
        {/* --- Image Uploader Section --- */}
        <Text style={styles.label}>Dish Picture (Optional)</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={handleChoosePhoto}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.imagePickerText}>Tap to Select an Image 🖼️</Text>
          )}
        </TouchableOpacity>
        <View style={styles.spacerSmall} />
        {/* ----------------------------- */}

        {/* --- Course Selection Section --- */}
        <Text style={styles.label}>Course</Text>
        <ScrollView horizontal style={styles.courseScroll} showsHorizontalScrollIndicator={false}>
            {COURSES.map(course => (
                <TouchableOpacity
                    key={course}
                    style={[
                        styles.courseButton,
                        selectedCourse === course && styles.courseButtonActive
                    ]}
                    onPress={() => setSelectedCourse(course)}
                >
                    <Text style={[
                        styles.courseButtonText,
                        selectedCourse === course && styles.courseButtonTextActive
                    ]}>
                        {course}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
        <View style={styles.spacerSmall} />
        {/* ----------------------------- */}


        <Text style={styles.label}>Dish Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Grilled Salmon"
          value={dishName}
          onChangeText={setDishName}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="e.g., With lemon and herbs"
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
        />

        <Text style={styles.label}>Price (R)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 250"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <View style={styles.switchRow}>
          <Text style={styles.label}>Vegetarian</Text>
          <Switch
            value={isVegetarian}
            onValueChange={setIsVegetarian}
            trackColor={{ false: '#767577', true: '#00C788' }}
            thumbColor={isVegetarian ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.label}>Vegan</Text>
          <Switch
            value={isVegan}
            onValueChange={setIsVegan}
            trackColor={{ false: '#767577', true: '#00C788' }}
            thumbColor={isVegan ? '#fff' : '#f4f3f4'}
            disabled={!isVegetarian} // A vegan dish must also be vegetarian
          />
        </View>

        <View style={styles.spacer} />

        <Button
          title="Save Menu Item"
          onPress={handleSave}
          color="#8800C7"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 20 },
  contentContainer: { paddingBottom: 50 },
  label: { fontSize: 16, marginBottom: 5, fontWeight: 'bold', color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16
  },
  descriptionInput: { minHeight: 100, },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  spacer: { height: 30 },
  spacerSmall: { height: 10 },
  
  // --- NEW STYLES FOR IMAGE PICKER ---
  imagePicker: {
    borderWidth: 1,
    borderColor: '#8800C7',
    borderStyle: 'dashed',
    borderRadius: 8,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: '#f9f5ff',
  },
  imagePickerText: {
    color: '#8800C7',
    fontSize: 16,
    fontWeight: '600',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
  },

  // --- NEW STYLES FOR COURSE SELECTION ---
  courseScroll: { 
    marginBottom: 15, 
    maxHeight: 50 
  },
  courseButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
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
});

export default AddItemScreen;