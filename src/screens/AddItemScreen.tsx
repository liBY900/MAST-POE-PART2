// src/screens/AddItemScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, SafeAreaView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, NewItemType } from '../navigation/types.ts';

type AddItemNavProp = NativeStackNavigationProp<RootStackParamList, 'AddItem'>;

const AddItemScreen: React.FC = () => {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isVegan, setIsVegan] = useState(false);
  
  const navigation = useNavigation<AddItemNavProp>();

  const handleSave = () => {
    // Input Validation
    if (dishName.trim() === '' || description.trim() === '' || price.trim() === '') {
      Alert.alert('Missing Info', 'Please fill in the name, description, and price.');
      return;
    }
    
    // Validating price is a number
    const numericPrice = parseInt(price, 10);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      Alert.alert('Invalid Price', 'Price must be a valid number greater than zero.');
      return;
    }

    const newItem: NewItemType = {
      name: dishName.trim(),
      description: description.trim(),
      price: price.trim(), // Stored as number string for display/math
      vegetarian: isVegetarian,
      vegan: isVegan,
    };

    // Navigating back to Home and pass the new item via route params
    navigation.navigate('Home', { newItem });

    // Reset fields
    setDishName('');
    setDescription('');
    setPrice('');
    setIsVegetarian(false);
    setIsVegan(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
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
});

export default AddItemScreen;