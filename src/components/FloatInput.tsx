import React, { useState, useRef } from 'react';
import {
  View, TextInput, Text, Pressable, StyleSheet, Animated,
} from 'react-native';
import { Colors } from '../theme/colors';

interface FloatInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  suffix?: React.ReactNode;
  c: Colors;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  autoComplete?: 'name' | 'email' | 'password' | 'new-password' | 'off';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export function FloatInput({
  label, value, onChange, icon, suffix, c,
  secureTextEntry = false,
  keyboardType = 'default',
  autoComplete = 'off',
  autoCapitalize = 'none',
}: FloatInputProps) {
  const [focused, setFocused] = useState(false);
  const labelAnim = useRef(new Animated.Value(value.length > 0 ? 1 : 0)).current;
  const active = focused || value.length > 0;

  const handleFocus = () => {
    setFocused(true);
    Animated.timing(labelAnim, {
      toValue: 1,
      duration: 180,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setFocused(false);
    if (value.length === 0) {
      Animated.timing(labelAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: false,
      }).start();
    }
  };

  const labelTop = labelAnim.interpolate({ inputRange: [0, 1], outputRange: [18, 8] });
  const labelFontSize = labelAnim.interpolate({ inputRange: [0, 1], outputRange: [14, 10.5] });
  const labelColor = active ? c.primary : c.textSub;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: c.inputBg,
          borderColor: focused ? c.primary : c.border,
          // iOS shadow for focus glow
          shadowColor: focused ? c.primary : 'transparent',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: focused ? 0.25 : 0,
          shadowRadius: focused ? 6 : 0,
          elevation: focused ? 2 : 0,
        },
      ]}
    >
      {/* Leading icon */}
      <View style={[styles.icon, { opacity: focused ? 1 : 0.5 }]}>
        {icon}
      </View>

      {/* Input + floating label */}
      <View style={styles.inputWrap}>
        <Animated.Text
          style={[
            styles.label,
            {
              top: labelTop,
              fontSize: labelFontSize,
              color: labelColor,
              letterSpacing: active ? 0.6 : 0,
              textTransform: active ? 'uppercase' : 'none',
              fontFamily: active ? 'PlusJakartaSans_700Bold' : 'PlusJakartaSans_500Medium',
            },
          ]}
        >
          {label}
        </Animated.Text>
        <TextInput
          value={value}
          onChangeText={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoComplete={autoComplete}
          autoCapitalize={autoCapitalize}
          style={[styles.input, { color: c.text }]}
          selectionColor={c.primary}
          placeholderTextColor="transparent"
          placeholder=" "
        />
      </View>

      {/* Trailing suffix (e.g. eye toggle) */}
      {suffix != null && (
        <View style={styles.suffix}>{suffix}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    height: 58,
    overflow: 'hidden',
  },
  icon: {
    paddingLeft: 14,
    paddingRight: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrap: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    left: 12,
    pointerEvents: 'none',
  },
  input: {
    paddingTop: 20,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 4,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_500Medium',
    height: 58,
  },
  suffix: {
    paddingRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
