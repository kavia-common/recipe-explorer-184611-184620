import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Recipe } from '../types';
import { theme } from '../theme/theme';
import { useSavedRecipes } from '../store/SavedRecipesContext';

type Props = {
  item: Recipe;
  onPress?: () => void;
};

export const RecipeCard: React.FC<Props> = ({ item, onPress }) => {
  const { isSaved, toggleSaved } = useSavedRecipes();
  const saved = isSaved(item.id);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            toggleSaved(item.id);
          }}
          style={({ pressed }) => [styles.saveBtn, saved ? styles.saveBtnSaved : undefined, pressed && { opacity: 0.9 }]}
          accessibilityLabel={saved ? 'Unsave recipe' : 'Save recipe'}
        >
          <Text style={[styles.saveText, saved ? styles.saveTextSaved : undefined]}>{saved ? 'Saved' : 'Save'}</Text>
        </Pressable>
      </View>
      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>{item.cuisine} • {item.time}m</Text>
        <View style={styles.tags}>
          {item.tags.slice(0, 2).map((t) => (
            <View key={t} style={styles.tag}>
              <Text style={styles.tagText}>{t}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    ...theme.shadows.card,
  },
  pressed: {
    opacity: 0.96,
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 140,
  },
  saveBtn: {
    position: 'absolute',
    right: theme.spacing.md,
    top: theme.spacing.md,
    backgroundColor: '#ffffffee',
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  saveBtnSaved: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  saveText: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  saveTextSaved: {
    color: '#fff',
  },
  content: {
    padding: theme.spacing.md,
  },
  title: {
    ...theme.typography.title,
    marginBottom: 2,
  },
  meta: {
    ...theme.typography.subtitle,
    marginBottom: theme.spacing.sm,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  tag: {
    backgroundColor: theme.colors.chipBg,
    borderRadius: 999,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tagText: {
    fontSize: 12,
    color: theme.colors.text,
  },
});
