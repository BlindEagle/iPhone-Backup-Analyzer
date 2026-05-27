export type ModCategory =
  | 'Engine' | 'Suspension' | 'Brakes' | 'Exhaust' | 'Intake'
  | 'Transmission' | 'Wheels' | 'Exterior' | 'Interior'
  | 'Electronics' | 'Fueling' | 'Forced Induction' | 'Other';

export type ModStatus = 'Planned' | 'Purchased' | 'Installed' | 'Removed';

export type EngineLayout =
  | 'Inline-4' | 'Inline-6' | 'V6' | 'V8' | 'V10' | 'V12'
  | 'Flat-4' | 'Flat-6' | 'Rotary' | 'Other';

export type AspirationKind =
  | 'Naturally Aspirated' | 'Turbocharged' | 'Supercharged'
  | 'Twin Turbo' | 'Tri Turbo' | 'Electric Supercharger' | 'Other';

export type FuelType =
  | 'Gasoline' | 'Diesel' | 'E85' | 'Electric' | 'Hybrid' | 'Hydrogen';

export type InjectionType =
  | 'Carburetor' | 'Port Injection' | 'Direct Injection'
  | 'Dual Injection' | 'Throttle Body';

export interface Modification {
  id: string;
  name: string;
  brand: string;
  partNumber: string;
  category: ModCategory;
  status: ModStatus;
  installDate: string | null;
  cost: number | null;
  notes: string;
  createdAt: string;
}

export interface EngineBlueprint {
  layout: EngineLayout;
  displacement: number | null;
  bore: number | null;
  stroke: number | null;
  compressionRatio: number | null;
  blockMaterial: string;
  headMaterial: string;
  valvesPerCylinder: number | null;
  camshaftType: string;
  aspiration: AspirationKind;
  boostPressure: number | null;
  intercooled: boolean;
  fuelType: FuelType;
  injectionType: InjectionType;
  targetAfr: number | null;
  whpMeasured: number | null;
  wtqMeasured: number | null;
  crankHp: number | null;
  crankTq: number | null;
  tunerName: string;
  tuneNotes: string;
  internalsNotes: string;
}

export interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  vin: string;
  notes: string;
  createdAt: string;
  modifications: Modification[];
  engineBlueprint: EngineBlueprint | null;
}
