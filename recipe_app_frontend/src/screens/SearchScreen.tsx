import React, { useMemo, useState } from 'react';
import { FlatList, ListRenderItem, SafeAreaView, StyleSheet, TextInput, View, Text } from 'react-native';
import { mockRecipes } from '../data/mockRecipes';
import { Recipe } from '../types';
import { RecipeCard } from '../components/RecipeCard';
import { theme } from '../theme/theme';
import { TagChip } from '../components/TagChip';
import { EmptyState } from '../components/EmptyState';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const cuisines = Array.from(new Set(mockRecipes.map((r) => r.cuisine)));
const times = [15, 30, 45, 60];

type Nav = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

const SearchScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const navigation = useNavigation<Nav>();

  const filtered = useMemo(() => {
    return mockRecipes.filter((r) => {
      const matchesQuery =
        !query ||
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      const matchesCuisine = !selectedCuisine || r.cuisine === selectedCuisine;
      const matchesTime = !selectedTime || r.time <= selectedTime;
      return matchesQuery && matchesCuisine && matchesTime;
    });
  }, [query, selectedCuisine, selectedTime]);

  const renderItem: ListRenderItem<Recipe> = ({ item }) => (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <RecipeCard item={item} onPress={() => navigation.navigate('RecipeDetail', { id: item.id })} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchWrap}>
        <TextInput
          placeholder="Search recipes..."
          placeholderTextColor={theme.colors.muted}
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />
      </View>

      <View style={styles.filters}>
        <Text style={styles.filterLabel}>Cuisine</Text>
        <View style={styles.row}>
          <TagChip label="Any" selected={!selectedCuisine} onPress={() => setSelectedCuisine(null)} />
          {cuisines.map((c) => (
            <TagChip key={c} label={c} selected={selectedCuisine === c} onPress={() => setSelectedCuisine(c)} />
          ))}
        </View>

        <Text style={[styles.filterLabel, { marginTop: theme.spacing.md }]}>Time</Text>
        <View style={styles.row}>
          <TagChip label="Any" selected={!selectedTime} onPress={() => setSelectedTime(null)} />
          {times.map((t) => (
            <TagChip key={t} label={`<= ${t}m`} selected={selectedTime === t} onPress={() => setSelectedTime(t)} />
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(it) => it.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        ListEmptyComponent={
          <EmptyState
            title="No recipes found"
            subtitle="Try adjusting your search or filters."
          />
        }
      />
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchWrap: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    color: theme.colors.text,
    ...theme.shadows.card,
  },
  filters: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  filterLabel: {
    ...theme.typography.subtitle,
    marginBottom: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  listContent: {
    padding: theme.spacing.lg,
  },
});
