import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { loadVehicles, saveVehicles } from '../storage/vehicleStorage';
import { Vehicle, Modification, ModCategory } from '../types';
import { colors, statusColor, categoryIcon } from '../theme';

const ALL_CATEGORIES: ModCategory[] = [
  'Engine', 'Suspension', 'Brakes', 'Exhaust', 'Intake',
  'Transmission', 'Wheels', 'Exterior', 'Interior',
  'Electronics', 'Fueling', 'Forced Induction', 'Other',
];

export default function VehicleDetailScreen({ route, navigation }: any) {
  const { vehicleId } = route.params;
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [filterCat, setFilterCat] = useState<ModCategory | null>(null);

  useFocusEffect(useCallback(() => {
    loadVehicles().then(all => {
      const v = all.find(x => x.id === vehicleId) ?? null;
      setVehicle(v);
      if (v) navigation.setOptions({ title: `${v.year} ${v.make} ${v.model}` });
    });
  }, [vehicleId]));

  if (!vehicle) return <View style={styles.container} />;

  const totalSpend = vehicle.modifications.reduce((s, m) => s + (m.cost ?? 0), 0);
  const installedCount = vehicle.modifications.filter(m => m.status === 'Installed').length;

  const visibleMods = filterCat
    ? vehicle.modifications.filter(m => m.category === filterCat)
    : vehicle.modifications;

  const grouped: Record<string, Modification[]> = {};
  for (const m of visibleMods) {
    (grouped[m.category] = grouped[m.category] ?? []).push(m);
  }

  const deleteMod = (modId: string) => {
    Alert.alert('Delete Mod', 'Remove this modification?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          const all = await loadVehicles();
          const idx = all.findIndex(v => v.id === vehicleId);
          if (idx === -1) return;
          all[idx].modifications = all[idx].modifications.filter(m => m.id !== modId);
          await saveVehicles(all);
          setVehicle({ ...all[idx] });
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Stats row */}
      <View style={styles.statsRow}>
        <StatTile label="Total Mods" value={String(vehicle.modifications.length)} />
        <StatTile label="Installed" value={String(installedCount)} color={colors.success} />
        <StatTile label="Total Spend" value={`$${totalSpend.toLocaleString()}`} color={colors.accent} />
      </View>

      {/* Engine Blueprint */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Engine Blueprint</Text>
        {vehicle.engineBlueprint ? (
          <TouchableOpacity
            style={styles.blueprintCard}
            onPress={() => navigation.navigate('EditEngineBlueprint', { vehicleId })}
            activeOpacity={0.8}
          >
            <Ionicons name="construct" size={20} color={colors.accent} />
            <View style={styles.blueprintInfo}>
              <Text style={styles.blueprintLayout}>{vehicle.engineBlueprint.layout}</Text>
              <Text style={styles.blueprintSub}>
                {vehicle.engineBlueprint.aspiration}
                {vehicle.engineBlueprint.whpMeasured ? `  ·  ${vehicle.engineBlueprint.whpMeasured} WHP` : ''}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.addBlueprintBtn}
            onPress={() => navigation.navigate('EditEngineBlueprint', { vehicleId })}
          >
            <Ionicons name="add-circle-outline" size={18} color={colors.accent} />
            <Text style={styles.addBlueprintText}>Add Engine Blueprint</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Edit vehicle */}
      <TouchableOpacity
        style={styles.editVehicleBtn}
        onPress={() => navigation.navigate('EditVehicle', { vehicleId })}
      >
        <Ionicons name="create-outline" size={16} color={colors.textMuted} />
        <Text style={styles.editVehicleText}>Edit Vehicle Info</Text>
      </TouchableOpacity>

      {/* Category filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll} contentContainerStyle={styles.chips}>
        <TouchableOpacity
          style={[styles.chip, !filterCat && styles.chipActive]}
          onPress={() => setFilterCat(null)}
        >
          <Text style={[styles.chipText, !filterCat && styles.chipTextActive]}>All</Text>
        </TouchableOpacity>
        {ALL_CATEGORIES.filter(c => vehicle.modifications.some(m => m.category === c)).map(c => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, filterCat === c && styles.chipActive]}
            onPress={() => setFilterCat(filterCat === c ? null : c)}
          >
            <Text style={[styles.chipText, filterCat === c && styles.chipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modifications */}
      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Modifications</Text>
          <TouchableOpacity
            style={styles.addModBtn}
            onPress={() => navigation.navigate('AddModification', { vehicleId })}
          >
            <Ionicons name="add" size={18} color={colors.accent} />
            <Text style={styles.addModText}>Add</Text>
          </TouchableOpacity>
        </View>

        {Object.keys(grouped).length === 0 ? (
          <Text style={styles.emptyText}>No modifications yet</Text>
        ) : (
          Object.entries(grouped).map(([cat, mods]) => (
            <View key={cat} style={styles.catGroup}>
              <View style={styles.catHeader}>
                <Ionicons name={(categoryIcon[cat] ?? 'cube') as any} size={15} color={colors.textMuted} />
                <Text style={styles.catTitle}>{cat}</Text>
              </View>
              {mods.map(m => (
                <TouchableOpacity
                  key={m.id}
                  style={styles.modRow}
                  onPress={() => navigation.navigate('ModificationDetail', { vehicleId, modId: m.id })}
                  activeOpacity={0.8}
                >
                  <View style={[styles.statusDot, { backgroundColor: statusColor[m.status] }]} />
                  <View style={styles.modBody}>
                    <Text style={styles.modName}>{m.name}</Text>
                    {m.brand ? <Text style={styles.modSub}>{m.brand}</Text> : null}
                  </View>
                  <View style={styles.modRight}>
                    {m.cost != null && <Text style={styles.modCost}>${m.cost.toLocaleString()}</Text>}
                    <TouchableOpacity onPress={() => deleteMod(m.id)} style={styles.deleteModBtn}>
                      <Ionicons name="trash-outline" size={15} color={colors.textMuted} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))
        )}
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function StatTile({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.statTile}>
      <Text style={[styles.statValue, color ? { color } : null]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  statsRow: { flexDirection: 'row', padding: 12, gap: 10 },
  statTile: {
    flex: 1, backgroundColor: colors.card, borderRadius: 12,
    padding: 14, alignItems: 'center', borderWidth: 1, borderColor: colors.border,
  },
  statValue: { color: colors.text, fontSize: 22, fontWeight: '700' },
  statLabel: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  section: { paddingHorizontal: 12, marginBottom: 8 },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 8 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  blueprintCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border,
  },
  blueprintInfo: { flex: 1, marginLeft: 12 },
  blueprintLayout: { color: colors.text, fontSize: 15, fontWeight: '600' },
  blueprintSub: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  addBlueprintBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed',
  },
  addBlueprintText: { color: colors.accent, fontSize: 15, marginLeft: 8 },
  editVehicleBtn: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 12, marginBottom: 12,
  },
  editVehicleText: { color: colors.textMuted, fontSize: 14, marginLeft: 6 },
  chipScroll: { marginBottom: 12 },
  chips: { paddingHorizontal: 12, gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.textMuted, fontSize: 13 },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  addModBtn: { flexDirection: 'row', alignItems: 'center' },
  addModText: { color: colors.accent, fontSize: 15, marginLeft: 4 },
  emptyText: { color: colors.textMuted, textAlign: 'center', paddingVertical: 24 },
  catGroup: { marginBottom: 16 },
  catHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  catTitle: { color: colors.textMuted, fontSize: 13, fontWeight: '600', marginLeft: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  modRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: 10, padding: 12, marginBottom: 6,
    borderWidth: 1, borderColor: colors.border,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  modBody: { flex: 1 },
  modName: { color: colors.text, fontSize: 15 },
  modSub: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  modRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  modCost: { color: colors.textMuted, fontSize: 13 },
  deleteModBtn: { padding: 4 },
});
