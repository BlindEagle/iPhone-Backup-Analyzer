import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert,
} from 'react-native';
import { loadVehicles, saveVehicles } from '../storage/vehicleStorage';
import { ModCategory, ModStatus, Modification } from '../types';
import { colors } from '../theme';
import Picker from '../components/Picker';

const CATEGORIES: ModCategory[] = [
  'Engine', 'Suspension', 'Brakes', 'Exhaust', 'Intake',
  'Transmission', 'Wheels', 'Exterior', 'Interior',
  'Electronics', 'Fueling', 'Forced Induction', 'Other',
];
const STATUSES: ModStatus[] = ['Planned', 'Purchased', 'Installed', 'Removed'];

function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function AddModificationScreen({ route, navigation }: any) {
  const { vehicleId } = route.params;
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [category, setCategory] = useState<ModCategory>('Engine');
  const [status, setStatus] = useState<ModStatus>('Planned');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');

  const save = async () => {
    if (!name.trim()) { Alert.alert('Name required'); return; }
    const all = await loadVehicles();
    const idx = all.findIndex(v => v.id === vehicleId);
    if (idx === -1) return;
    const mod: Modification = {
      id: genId(),
      name: name.trim(),
      brand: brand.trim(),
      partNumber: partNumber.trim(),
      category,
      status,
      installDate: null,
      cost: cost ? parseFloat(cost) : null,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };
    all[idx].modifications = [mod, ...all[idx].modifications];
    await saveVehicles(all);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        <Field label="Name *" value={name} onChangeText={setName} placeholder="e.g. Cold Air Intake" />
        <Field label="Brand" value={brand} onChangeText={setBrand} placeholder="e.g. AEM" />
        <Field label="Part Number" value={partNumber} onChangeText={setPartNumber} placeholder="Optional" />
        <Picker label="Category" value={category} options={CATEGORIES} onChange={v => setCategory(v as ModCategory)} />
        <Picker label="Status" value={status} options={STATUSES} onChange={v => setStatus(v as ModStatus)} />
        <Field label="Cost ($)" value={cost} onChangeText={setCost} placeholder="0.00" keyboardType="decimal-pad" />
        <Field label="Notes" value={notes} onChangeText={setNotes} placeholder="Optional" multiline />
        <TouchableOpacity style={styles.saveBtn} onPress={save} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>Add Modification</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function Field({ label, value, onChangeText, placeholder, keyboardType, multiline }: any) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMulti]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboardType || 'default'}
        multiline={multiline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  form: { padding: 16 },
  field: { marginBottom: 16 },
  label: { color: colors.textMuted, fontSize: 13, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: colors.card, color: colors.text, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 16,
    borderWidth: 1, borderColor: colors.border,
  },
  inputMulti: { minHeight: 80, textAlignVertical: 'top' },
  saveBtn: {
    backgroundColor: colors.accent, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center', marginTop: 8,
  },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
