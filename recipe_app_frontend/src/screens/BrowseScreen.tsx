import React, { useMemo } from 'react';
import { FlatList, ListRenderItem, SafeAreaView, StyleSheet, View } from 'react-native';
import { mockRecipes } from '../data/mockRecipes';
import { Recipe } from '../types';
import { RecipeCard } from '../components/RecipeCard';
import { theme } from '../theme/theme';
import { CardSkeleton } from '../components/CardSkeleton';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

const BrowseScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  const data = useMemo(() => mockRecipes, []);

  const renderItem: ListRenderItem<Recipe> = ({ item }) => (
    <View style={styles.cardWrap}>
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
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing.lg }} />}
        ListEmptyComponent={
          <View style={{ padding: theme.spacing.lg }}>
            <CardSkeleton />
            <CardSkeleton />
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default BrowseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
  cardWrap: {
    // subtle separation
  },
});
