import React, { useMemo } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { theme } from '../theme/theme';
import { useSavedRecipes } from '../store/SavedRecipesContext';
import { mockRecipes } from '../data/mockRecipes';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';

type DetailRoute = RouteProp<RootStackParamList, 'RecipeDetail'>;

const RecipeDetailScreen: React.FC = () => {
  const route = useRoute<DetailRoute>();
  const { id } = route.params;
  const { isSaved, toggleSaved } = useSavedRecipes();

  const recipe = useMemo(() => mockRecipes.find((r) => r.id === id), [id]);

  if (!recipe) {
    return (
      <SafeAreaView style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={styles.title}>Recipe not found</Text>
      </SafeAreaView>
    );
  }

  const saved = isSaved(recipe.id);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: theme.spacing.xl }}>
        <Image source={{ uri: recipe.image }} style={styles.image} />
        <View style={styles.header}>
          <Text style={styles.title}>{recipe.title}</Text>
          <Pressable
            onPress={() => toggleSaved(recipe.id)}
            style={[styles.saveBtn, saved ? styles.saveBtnSaved : undefined]}
            accessibilityLabel={saved ? 'Unsave recipe' : 'Save recipe'}
          >
            <Text style={[styles.saveText, saved ? styles.saveTextSaved : undefined]}>{saved ? 'Saved' : 'Save'}</Text>
          </Pressable>
        </View>
        <Text style={styles.meta}>{recipe.cuisine} • {recipe.time}m</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {recipe.ingredients.map((ing, idx) => (
            <Text key={idx} style={styles.item}>• {ing}</Text>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Steps</Text>
          {recipe.steps.map((step, idx) => (
            <Text key={idx} style={styles.item}>{idx + 1}. {step}</Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RecipeDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  image: {
    width: '100%',
    height: 240,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...theme.typography.title,
    fontSize: 22,
  },
  meta: {
    ...theme.typography.subtitle,
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  saveBtn: {
    backgroundColor: '#ffffffee',
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  saveBtnSaved: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  saveText: {
    color: theme.colors.text,
    fontWeight: '700',
  },
  saveTextSaved: {
    color: '#fff',
  },
  section: {
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.title,
    marginBottom: theme.spacing.sm,
  },
  item: {
    ...theme.typography.body,
    marginBottom: 6,
  },
});
