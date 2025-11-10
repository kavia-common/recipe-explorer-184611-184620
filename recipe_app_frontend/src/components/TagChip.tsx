import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '../theme/theme';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export const TagChip: React.FC<Props> = ({ label, selected, onPress }) => {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.chip, selected ? styles.selected : undefined, pressed && styles.pressed]}>
      <Text style={[styles.chipText, selected ? styles.selectedText : undefined]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.chipBg,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  chipText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '500',
  },
  selected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  selectedText: {
    color: '#fff',
  },
  pressed: {
    opacity: 0.9,
  },
});
