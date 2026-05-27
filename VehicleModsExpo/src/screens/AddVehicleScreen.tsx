import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert,
} from 'react-native';
import { loadVehicles, saveVehicles } from '../storage/vehicleStorage';
import { Vehicle } from '../types';
import { colors } from '../theme';

function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function AddVehicleScreen({ navigation }: any) {
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [trim, setTrim] = useState('');
  const [vin, setVin] = useState('');
  const [notes, setNotes] = useState('');

  const save = async () => {
    const y = parseInt(year, 10);
    if (!make.trim() || !model.trim() || isNaN(y) || y < 1900 || y > 2100) {
      Alert.alert('Missing Info', 'Year, make, and model are required.');
      return;
    }
    const vehicles = await loadVehicles();
    const newVehicle: Vehicle = {
      id: genId(),
      year: y,
      make: make.trim(),
      model: model.trim(),
      trim: trim.trim(),
      vin: vin.trim(),
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
      modifications: [],
      engineBlueprint: null,
    };
    await saveVehicles([newVehicle, ...vehicles]);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        <Field label="Year *" value={year} onChangeText={setYear} keyboardType="numeric" placeholder="e.g. 2020" />
        <Field label="Make *" value={make} onChangeText={setMake} placeholder="e.g. Toyota" />
        <Field label="Model *" value={model} onChangeText={setModel} placeholder="e.g. Supra" />
        <Field label="Trim" value={trim} onChangeText={setTrim} placeholder="e.g. GR Premium" />
        <Field label="VIN" value={vin} onChangeText={setVin} placeholder="Optional" />
        <Field label="Notes" value={notes} onChangeText={setNotes} placeholder="Optional" multiline />
        <TouchableOpacity style={styles.saveBtn} onPress={save} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>Add Vehicle</Text>
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
