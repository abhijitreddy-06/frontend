import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

export function Divider({ c }: { c: Colors }) {
  return (
    <View style={styles.row}>
      <View style={[styles.line, { backgroundColor: c.border }]} />
      <Text style={[styles.text, { color: c.textMuted }]}>or</Text>
      <View style={[styles.line, { backgroundColor: c.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  line: {
    flex: 1,
    height: 1,
  },
  text: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
});
