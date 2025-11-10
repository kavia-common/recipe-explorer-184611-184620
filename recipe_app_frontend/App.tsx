import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { SavedRecipesProvider } from './src/store/SavedRecipesContext';
import AppNavigator from './src/navigation';
import { theme } from './src/theme/theme';

export default function App() {
  return (
    <SavedRecipesProvider>
      <SafeAreaView style={styles.container}>
        <AppNavigator />
        <StatusBar style="dark" />
      </SafeAreaView>
    </SavedRecipesProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
