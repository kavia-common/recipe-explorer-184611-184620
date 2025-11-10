import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme/theme';

type Props = {
  title: string;
  subtitle?: string;
};

export const EmptyState: React.FC<Props> = ({ title, subtitle }) => {
  return (
    <View style={styles.container}>
      <View style={styles.badge} />
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DBEAFE',
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.title,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.subtitle,
    textAlign: 'center',
  },
});
