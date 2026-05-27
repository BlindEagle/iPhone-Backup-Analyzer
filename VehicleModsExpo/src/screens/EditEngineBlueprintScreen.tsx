import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Switch,
} from 'react-native';
import { loadVehicles, saveVehicles } from '../storage/vehicleStorage';
import {
  EngineBlueprint, EngineLayout, AspirationKind, FuelType, InjectionType,
} from '../types';
import { colors } from '../theme';
import Picker from '../components/Picker';

const LAYOUTS: EngineLayout[] = ['Inline-4','Inline-6','V6','V8','V10','V12','Flat-4','Flat-6','Rotary','Other'];
const ASPIRATIONS: AspirationKind[] = ['Naturally Aspirated','Turbocharged','Supercharged','Twin Turbo','Tri Turbo','Electric Supercharger','Other'];
const FUELS: FuelType[] = ['Gasoline','Diesel','E85','Electric','Hybrid','Hydrogen'];
const INJECTIONS: InjectionType[] = ['Carburetor','Port Injection','Direct Injection','Dual Injection','Throttle Body'];
const CAM_TYPES = ['SOHC','DOHC','OHV','Pushrod','Other'];

const defaultBlueprint = (): EngineBlueprint => ({
  layout: 'Inline-4', displacement: null, bore: null, stroke: null,
  compressionRatio: null, blockMaterial: '', headMaterial: '', valvesPerCylinder: null,
  camshaftType: 'DOHC', aspiration: 'Naturally Aspirated', boostPressure: null,
  intercooled: false, fuelType: 'Gasoline', injectionType: 'Direct Injection',
  targetAfr: null, whpMeasured: null, wtqMeasured: null, crankHp: null,
  crankTq: null, tunerName: '', tuneNotes: '', internalsNotes: '',
});

export default function EditEngineBlueprintScreen({ route, navigation }: any) {
  const { vehicleId } = route.params;
  const [bp, setBp] = useState<EngineBlueprint>(defaultBlueprint());

  useEffect(() => {
    loadVehicles().then(all => {
      const v = all.find(x => x.id === vehicleId);
      if (v?.engineBlueprint) setBp(v.engineBlueprint);
    });
  }, [vehicleId]);

  const set = (field: keyof EngineBlueprint) => (val: any) =>
    setBp(prev => ({ ...prev, [field]: val }));

  const setNum = (field: keyof EngineBlueprint) => (val: string) =>
    setBp(prev => ({ ...prev, [field]: val === '' ? null : parseFloat(val) }));

  const calcDisp = () => {
    if (bp.bore && bp.stroke) {
      const cyl = bp.layout.startsWith('V') ? parseInt(bp.layout.slice(1)) :
        bp.layout === 'Flat-4' ? 4 : bp.layout === 'Flat-6' ? 6 :
        bp.layout === 'Inline-4' ? 4 : bp.layout === 'Inline-6' ? 6 : null;
      if (cyl) {
        const cc = Math.PI / 4 * Math.pow(bp.bore, 2) * bp.stroke * cyl;
        setBp(prev => ({ ...prev, displacement: parseFloat((cc / 1000).toFixed(1)) }));
      }
    }
  };

  const save = async () => {
    const all = await loadVehicles();
    const idx = all.findIndex(v => v.id === vehicleId);
    if (idx === -1) return;
    all[idx].engineBlueprint = bp;
    await saveVehicles(all);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        <SectionHeader title="Engine Block" />
        <Picker label="Layout" value={bp.layout} options={LAYOUTS} onChange={set('layout')} />
        <NumField label="Displacement (L)" value={bp.displacement} onChange={setNum('displacement')} placeholder="e.g. 2.0" />
        <View style={styles.row}>
          <View style={styles.half}>
            <NumField label="Bore (mm)" value={bp.bore} onChange={setNum('bore')} placeholder="86" />
          </View>
          <View style={styles.halfGap} />
          <View style={styles.half}>
            <NumField label="Stroke (mm)" value={bp.stroke} onChange={setNum('stroke')} placeholder="86" />
          </View>
        </View>
        <TouchableOpacity style={styles.calcBtn} onPress={calcDisp}>
          <Text style={styles.calcBtnText}>Calculate Displacement from Bore/Stroke</Text>
        </TouchableOpacity>
        <NumField label="Compression Ratio" value={bp.compressionRatio} onChange={setNum('compressionRatio')} placeholder="10.5" />
        <StrField label="Block Material" value={bp.blockMaterial} onChange={set('blockMaterial')} placeholder="e.g. Cast Iron" />
        <StrField label="Head Material" value={bp.headMaterial} onChange={set('headMaterial')} placeholder="e.g. Aluminum" />

        <SectionHeader title="Valvetrain" />
        <NumField label="Valves per Cylinder" value={bp.valvesPerCylinder} onChange={setNum('valvesPerCylinder')} placeholder="4" />
        <Picker label="Camshaft Type" value={bp.camshaftType} options={CAM_TYPES} onChange={set('camshaftType')} />

        <SectionHeader title="Aspiration" />
        <Picker label="Aspiration" value={bp.aspiration} options={ASPIRATIONS} onChange={set('aspiration')} />
        {bp.aspiration !== 'Naturally Aspirated' && (
          <>
            <NumField label="Boost Pressure (psi)" value={bp.boostPressure} onChange={setNum('boostPressure')} placeholder="e.g. 18" />
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Intercooled</Text>
              <Switch
                value={bp.intercooled}
                onValueChange={set('intercooled')}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor="#fff"
              />
            </View>
          </>
        )}

        <SectionHeader title="Fuel System" />
        <Picker label="Fuel Type" value={bp.fuelType} options={FUELS} onChange={set('fuelType')} />
        <Picker label="Injection Type" value={bp.injectionType} options={INJECTIONS} onChange={set('injectionType')} />
        <NumField label="Target AFR" value={bp.targetAfr} onChange={setNum('targetAfr')} placeholder="e.g. 11.5" />

        <SectionHeader title="Power Output" />
        <View style={styles.row}>
          <View style={styles.half}>
            <NumField label="WHP" value={bp.whpMeasured} onChange={setNum('whpMeasured')} placeholder="300" />
          </View>
          <View style={styles.halfGap} />
          <View style={styles.half}>
            <NumField label="WTQ (lb-ft)" value={bp.wtqMeasured} onChange={setNum('wtqMeasured')} placeholder="280" />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.half}>
            <NumField label="Crank HP" value={bp.crankHp} onChange={setNum('crankHp')} placeholder="350" />
          </View>
          <View style={styles.halfGap} />
          <View style={styles.half}>
            <NumField label="Crank TQ" value={bp.crankTq} onChange={setNum('crankTq')} placeholder="320" />
          </View>
        </View>

        <SectionHeader title="Tune" />
        <StrField label="Tuner Name" value={bp.tunerName} onChange={set('tunerName')} placeholder="Optional" />
        <StrField label="Tune Notes" value={bp.tuneNotes} onChange={set('tuneNotes')} placeholder="Optional" multiline />
        <StrField label="Internals Notes" value={bp.internalsNotes} onChange={set('internalsNotes')} placeholder="Forged pistons, rods, etc." multiline />

        <TouchableOpacity style={styles.saveBtn} onPress={save} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>Save Blueprint</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

function NumField({ label, value, onChange, placeholder }: { label: string; value: number | null; onChange: (v: string) => void; placeholder: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value != null ? String(value) : ''}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType="decimal-pad"
      />
    </View>
  );
}

function StrField({ label, value, onChange, placeholder, multiline }: any) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMulti]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  form: { padding: 16 },
  sectionHeader: {
    color: colors.accent, fontSize: 14, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 1,
    marginTop: 16, marginBottom: 12, borderBottomWidth: 1,
    borderBottomColor: colors.border, paddingBottom: 6,
  },
  field: { marginBottom: 16 },
  label: { color: colors.textMuted, fontSize: 13, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: colors.card, color: colors.text, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 16,
    borderWidth: 1, borderColor: colors.border,
  },
  inputMulti: { minHeight: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row' },
  half: { flex: 1 },
  halfGap: { width: 12 },
  calcBtn: {
    borderRadius: 10, borderWidth: 1, borderColor: colors.accent,
    paddingVertical: 10, alignItems: 'center', marginBottom: 16,
  },
  calcBtnText: { color: colors.accent, fontSize: 14 },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.card, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, marginBottom: 16, borderWidth: 1, borderColor: colors.border,
  },
  toggleLabel: { color: colors.text, fontSize: 16 },
  saveBtn: {
    backgroundColor: colors.accent, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center', marginTop: 12, marginBottom: 32,
  },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
