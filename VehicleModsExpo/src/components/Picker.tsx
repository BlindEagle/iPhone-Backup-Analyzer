import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, FlatList, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

interface Props {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}

export default function Picker({ label, value, options, onChange }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.trigger} onPress={() => setOpen(true)} activeOpacity={0.8}>
        <Text style={styles.triggerText}>{value}</Text>
        <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
      </TouchableOpacity>
      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setOpen(false)} />
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>{label}</Text>
          <FlatList
            data={options}
            keyExtractor={x => x}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.option, item === value && styles.optionActive]}
                onPress={() => { onChange(item); setOpen(false); }}
              >
                <Text style={[styles.optionText, item === value && styles.optionTextActive]}>{item}</Text>
                {item === value && <Ionicons name="checkmark" size={18} color={colors.accent} />}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 16 },
  label: { color: colors.textMuted, fontSize: 13, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  trigger: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.card, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: colors.border,
  },
  triggerText: { color: colors.text, fontSize: 16 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 16, maxHeight: '70%',
  },
  sheetTitle: { color: colors.text, fontSize: 17, fontWeight: '600', marginBottom: 12, textAlign: 'center' },
  option: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  optionActive: { backgroundColor: colors.accent + '22', borderRadius: 8 },
  optionText: { color: colors.text, fontSize: 16 },
  optionTextActive: { color: colors.accent, fontWeight: '600' },
});
