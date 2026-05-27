import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vehicle } from '../types';

const KEY = 'vehicles_v1';

export async function loadVehicles(): Promise<Vehicle[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveVehicles(vehicles: Vehicle[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(vehicles));
}
