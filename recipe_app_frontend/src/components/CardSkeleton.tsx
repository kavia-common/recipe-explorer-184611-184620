import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '../theme/theme';

export const CardSkeleton: React.FC = () => {
  return (
    <View style={styles.card}>
      <View style={styles.image} />
      <View style={styles.line} />
      <View style={[styles.line, { width: '60%' }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    ...theme.shadows.card,
  },
  image: {
    height: 140,
    backgroundColor: '#E5E7EB',
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
  },
  line: {
    height: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    marginBottom: theme.spacing.sm,
  },
});
