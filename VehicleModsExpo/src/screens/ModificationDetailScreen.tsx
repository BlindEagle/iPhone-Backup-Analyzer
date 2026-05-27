import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { loadVehicles, saveVehicles } from '../storage/vehicleStorage';
import { ModCategory, ModStatus } from '../types';
import { colors, statusColor } from '../theme';
import Picker from '../components/Picker';

const CATEGORIES: ModCategory[] = [
  'Engine', 'Suspension', 'Brakes', 'Exhaust', 'Intake',
  'Transmission', 'Wheels', 'Exterior', 'Interior',
  'Electronics', 'Fueling', 'Forced Induction', 'Other',
];
const STATUSES: ModStatus[] = ['Planned', 'Purchased', 'Installed', 'Removed'];

export default function ModificationDetailScreen({ route, navigation }: any) {
  const { vehicleId, modId } = route.params;
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [category, setCategory] = useState<ModCategory>('Engine');
  const [status, setStatus] = useState<ModStatus>('Planned');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    loadVehicles().then(all => {
      const v = all.find(x => x.id === vehicleId);
      const m = v?.modifications.find(x => x.id === modId);
      if (m) {
        setName(m.name); setBrand(m.brand); setPartNumber(m.partNumber);
        setCategory(m.category); setStatus(m.status);
        setCost(m.cost != null ? String(m.cost) : '');
        setNotes(m.notes);
      }
    });
  }, [vehicleId, modId]);

  const save = async () => {
    if (!name.trim()) { Alert.alert('Name required'); return; }
    const all = await loadVehicles();
    const vidx = all.findIndex(v => v.id === vehicleId);
    if (vidx === -1) return;
    const midx = all[vidx].modifications.findIndex(m => m.id === modId);
    if (midx === -1) return;
    all[vidx].modifications[midx] = {
      ...all[vidx].modifications[midx],
      name: name.trim(), brand: brand.trim(), partNumber: partNumber.trim(),
      category, status, cost: cost ? parseFloat(cost) : null, notes: notes.trim(),
    };
    await saveVehicles(all);
    setDirty(false);
    navigation.goBack();
  };

  const mark = (fn: (v: any) => void) => (v: any) => { fn(v); setDirty(true); };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        <View style={[styles.statusBadge, { backgroundColor: statusColor[status] + '33' }]}>
          <View style={[styles.dot, { backgroundColor: statusColor[status] }]} />
          <Text style={[styles.statusText, { color: statusColor[status] }]}>{status}</Text>
        </View>
        <Field label="Name *" value={name} onChangeText={mark(setName)} placeholder="e.g. Cold Air Intake" />
        <Field label="Brand" value={brand} onChangeText={mark(setBrand)} placeholder="e.g. AEM" />
        <Field label="Part Number" value={partNumber} onChangeText={mark(setPartNumber)} placeholder="Optional" />
        <Picker label="Category" value={category} options={CATEGORIES} onChange={mark(v => setCategory(v as ModCategory))} />
        <Picker label="Status" value={status} options={STATUSES} onChange={mark(v => setStatus(v as ModStatus))} />
        <Field label="Cost ($)" value={cost} onChangeText={mark(setCost)} placeholder="0.00" keyboardType="decimal-pad" />
        <Field label="Notes" value={notes} onChangeText={mark(setNotes)} placeholder="Optional" multiline />
        {dirty && (
          <TouchableOpacity style={styles.saveBtn} onPress={save} activeOpacity={0.85}>
            <Ionicons name="checkmark" size={20} color="#fff" />
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        )}
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
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginBottom: 20,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 7 },
  statusText: { fontSize: 14, fontWeight: '600' },
  field: { marginBottom: 16 },
  label: { color: colors.textMuted, fontSize: 13, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: colors.card, color: colors.text, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 16,
    borderWidth: 1, borderColor: colors.border,
  },
  inputMulti: { minHeight: 80, textAlignVertical: 'top' },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.accent, borderRadius: 12,
    paddingVertical: 16, marginTop: 8, gap: 8,
  },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
