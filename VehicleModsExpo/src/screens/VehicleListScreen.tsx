import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  StyleSheet, StatusBar, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { loadVehicles, saveVehicles } from '../storage/vehicleStorage';
import { Vehicle } from '../types';
import { colors } from '../theme';

export default function VehicleListScreen({ navigation }: any) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [query, setQuery] = useState('');

  useFocusEffect(useCallback(() => {
    loadVehicles().then(setVehicles);
  }, []));

  const filtered = vehicles.filter(v => {
    const q = query.toLowerCase();
    return (
      v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      String(v.year).includes(q)
    );
  });

  const deleteVehicle = (id: string) => {
    Alert.alert('Delete Vehicle', 'Remove this vehicle and all its data?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          const updated = vehicles.filter(v => v.id !== id);
          await saveVehicles(updated);
          setVehicles(updated);
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Vehicle }) => {
    const installed = item.modifications.filter(m => m.status === 'Installed').length;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('VehicleDetail', { vehicleId: item.id })}
        activeOpacity={0.8}
      >
        <View style={styles.cardLeft}>
          <Ionicons name="car-sport" size={32} color={colors.accent} />
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.vehicleName}>{item.year} {item.make} {item.model}</Text>
          {item.trim ? <Text style={styles.trim}>{item.trim}</Text> : null}
          <View style={styles.badges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.modifications.length} mods</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.success + '33' }]}>
              <Text style={[styles.badgeText, { color: colors.success }]}>{installed} installed</Text>
            </View>
            {item.engineBlueprint && (
              <View style={[styles.badge, { backgroundColor: colors.accent + '33' }]}>
                <Ionicons name="construct" size={11} color={colors.accent} />
                <Text style={[styles.badgeText, { color: colors.accent, marginLeft: 3 }]}>Blueprint</Text>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity onPress={() => deleteVehicle(item.id)} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.searchRow}>
        <Ionicons name="search" size={16} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by make, model, year..."
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={v => v.id}
        renderItem={renderItem}
        contentContainerStyle={filtered.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="car-outline" size={64} color={colors.border} />
            <Text style={styles.emptyTitle}>No Vehicles</Text>
            <Text style={styles.emptyText}>Tap + to add your first vehicle</Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddVehicle')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card, margin: 12, borderRadius: 10,
    paddingHorizontal: 12, borderWidth: 1, borderColor: colors.border,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: colors.text, height: 44, fontSize: 15 },
  list: { padding: 12, paddingBottom: 90 },
  emptyContainer: { flex: 1 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: 12, marginBottom: 10, padding: 14,
    borderWidth: 1, borderColor: colors.border,
  },
  cardLeft: { marginRight: 14 },
  cardBody: { flex: 1 },
  vehicleName: { color: colors.text, fontSize: 17, fontWeight: '600' },
  trim: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6, gap: 6 },
  badge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.accentBlue + '66', borderRadius: 6,
    paddingHorizontal: 7, paddingVertical: 2,
  },
  badgeText: { color: colors.textMuted, fontSize: 12 },
  deleteBtn: { padding: 6 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
  emptyTitle: { color: colors.text, fontSize: 20, fontWeight: '600', marginTop: 16 },
  emptyText: { color: colors.textMuted, fontSize: 14, marginTop: 6 },
  fab: {
    position: 'absolute', bottom: 28, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 8,
    elevation: 8,
  },
});
