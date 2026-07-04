import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Calendar, Cake, FileText, X, Check } from 'lucide-react-native';
import { useTheme } from '../../context';
import { useBirthdays } from '../../hooks';
import { SPACING, FONT_SIZE, BORDER_RADIUS, MONTHS } from '../../constants';
import { generateId } from '../../utils';

export default function AddBirthdayModal() {
  const router = useRouter();
  const { isDark, colors } = useTheme();
  const { addBirthday } = useBirthdays();

  const [name, setName] = useState('');
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [day, setDay] = useState<number>(new Date().getDate());
  const [year, setYear] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);

  const daysInMonth = (m: number, y?: number) => {
    const yearValue = y || 2024;
    return new Date(yearValue, m, 0).getDate();
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }

    if (day < 1 || day > daysInMonth(month)) {
      Alert.alert('Error', 'Please enter a valid day');
      return;
    }

    setIsLoading(true);

    try {
      const yearValue = year ? parseInt(year) : undefined;
      await addBirthday({
        name: name.trim(),
        date: yearValue ? `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '',
        month,
        day,
        year: yearValue,
        notes: notes.trim() || undefined,
      });

      router.back();
    } catch {
      Alert.alert('Error', 'Failed to save birthday');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMonthPicker = () => (
    <View style={styles.pickerContainer}>
      <View style={[styles.pickerHeader, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : colors.border }]}>
        <TouchableOpacity onPress={() => setShowMonthPicker(false)}>
          <Text style={[styles.pickerCancel, { color: colors.textSecondary }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.pickerTitle, { color: colors.text }]}>Select Month</Text>
        <TouchableOpacity onPress={() => setShowMonthPicker(false)}>
          <Text style={[styles.pickerDone, { color: colors.primary }]}>Done</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.monthGrid}>
        {MONTHS.map((m, index) => (
          <TouchableOpacity
            key={m}
            style={[
              styles.monthButton,
              month === index + 1 && styles.monthButtonSelected,
              { backgroundColor: month === index + 1 ? colors.primary : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
            ]}
            onPress={() => {
              setMonth(index + 1);
              setDay(1);
              setShowMonthPicker(false);
            }}
          >
            <Text
              style={[
                styles.monthText,
                { color: month === index + 1 ? '#FFFFFF' : colors.text },
              ]}
            >
              {m}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderDayPicker = () => {
    const days = daysInMonth(month, year ? parseInt(year) : undefined);
    const daysArray = Array.from({ length: days }, (_, i) => i + 1);

    return (
      <View style={styles.pickerContainer}>
        <View style={[styles.pickerHeader, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : colors.border }]}>
          <TouchableOpacity onPress={() => setShowDayPicker(false)}>
            <Text style={[styles.pickerCancel, { color: colors.textSecondary }]}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.pickerTitle, { color: colors.text }]}>Select Day</Text>
          <TouchableOpacity onPress={() => setShowDayPicker(false)}>
            <Text style={[styles.pickerDone, { color: colors.primary }]}>Done</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.dayScrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.dayGrid}>
            {daysArray.map((d) => (
              <TouchableOpacity
                key={d}
                style={[
                  styles.dayButton,
                  day === d && styles.dayButtonSelected,
                  { backgroundColor: day === d ? colors.primary : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
                ]}
                onPress={() => {
                  setDay(d);
                  setShowDayPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.dayText,
                    { color: day === d ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {d}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={isDark ? ['#1A1A2E', '#0F0F1A'] : ['#FFFFFF', '#F8F9FA']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Placeholder */}
          <View style={styles.avatarSection}>
            <View style={[styles.avatarPlaceholder, { backgroundColor: isDark ? 'rgba(255,107,107,0.2)' : 'rgba(255,107,107,0.1)' }]}>
              <Cake size={40} color={colors.primary} />
            </View>
            <Text style={[styles.avatarHint, { color: colors.textSecondary }]}>Tap to add photo</Text>
          </View>

          {/* Name Input */}
          <View style={styles.inputGroup}>
            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <User size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Name"
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={setName}
                autoFocus
              />
            </View>
          </View>

          {/* Birthday Date */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Birthday</Text>
            <View style={styles.dateRow}>
              <TouchableOpacity
                style={[styles.dateButton, styles.dateButtonLarge, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => setShowMonthPicker(true)}
              >
                <Calendar size={18} color={colors.textSecondary} />
                <Text style={[styles.dateButtonText, { color: colors.text }]}>{MONTHS[month - 1]}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dateButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => setShowDayPicker(true)}
              >
                <Text style={[styles.dateButtonText, { color: colors.text }]}>{day}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Year (Optional) */}
          <View style={styles.inputGroup}>
            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Birth year (optional)"
                placeholderTextColor={colors.textSecondary}
                value={year}
                onChangeText={setYear}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
            <Text style={[styles.hint, { color: colors.textMuted }]}>Adding the year shows their age</Text>
          </View>

          {/* Notes */}
          <View style={styles.inputGroup}>
            <View style={[styles.notesContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <FileText size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.notesInput, { color: colors.text }]}
                placeholder="Notes (optional)"
                placeholderTextColor={colors.textSecondary}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={styles.spacer} />
        </ScrollView>

        {/* Save Button */}
        <View style={styles.saveContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#FF6B6B', '#FF8E53']}
              style={styles.saveButtonGradient}
            >
              {isLoading ? (
                <Text style={styles.saveButtonText}>Saving...</Text>
              ) : (
                <>
                  <Check size={20} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>Save Birthday</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Month Picker Modal */}
        {showMonthPicker && (
          <View style={styles.pickerOverlay}>
            {renderMonthPicker()}
          </View>
        )}

        {/* Day Picker Modal */}
        {showDayPicker && (
          <View style={styles.pickerOverlay}>
            {renderDayPicker()}
          </View>
        )}
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  avatarHint: {
    fontSize: FONT_SIZE.sm,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.md,
  },
  dateRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  dateButtonLarge: {
    flex: 2,
  },
  dateButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
  },
  hint: {
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  notesContainer: {
    flexDirection: 'row',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    minHeight: 100,
  },
  notesInput: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    marginLeft: SPACING.sm,
    paddingTop: 0,
  },
  spacer: {
    height: 100,
  },
  saveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  saveButton: {
    overflow: 'hidden',
    borderRadius: BORDER_RADIUS.md,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  pickerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  pickerTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  pickerCancel: {
    fontSize: FONT_SIZE.sm,
  },
  pickerDone: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.sm,
  },
  monthButton: {
    width: '30%',
    margin: '1.5%',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthButtonSelected: {},
  monthText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
  },
  dayScrollView: {
    maxHeight: 400,
    padding: SPACING.sm,
  },
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayButton: {
    width: 52,
    height: 52,
    margin: 4,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonSelected: {},
  dayText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
  },
});
