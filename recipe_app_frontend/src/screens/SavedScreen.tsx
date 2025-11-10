import React, { useMemo } from 'react';
import { FlatList, ListRenderItem, SafeAreaView, StyleSheet, View } from 'react-native';
import { useSavedRecipes } from '../store/SavedRecipesContext';
import { mockRecipes } from '../data/mockRecipes';
import { Recipe } from '../types';
import { RecipeCard } from '../components/RecipeCard';
import { theme } from '../theme/theme';
import { EmptyState } from '../components/EmptyState';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

const SavedScreen: React.FC = () => {
  const { savedIds } = useSavedRecipes();
  const navigation = useNavigation<Nav>();

  const data = useMemo<Recipe[]>(() => mockRecipes.filter((r) => savedIds.has(r.id)), [savedIds]);

  const renderItem: ListRenderItem<Recipe> = ({ item }) => (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <RecipeCard item={item} onPress={() => navigation.navigate('RecipeDetail', { id: item.id })} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(it) => it.id}
        contentContainerStyle={styles.content}
        renderItem={renderItem}
        ListEmptyComponent={
          <EmptyState
            title="No saved recipes yet"
            subtitle="Save recipes to see them here."
          />
        }
      />
    </SafeAreaView>
  );
};

export default SavedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
});
