export const colors = {
  bg: '#0f0f1a',
  card: '#1a1a2e',
  cardAlt: '#16213e',
  accent: '#e94560',
  accentBlue: '#0f3460',
  text: '#ffffff',
  textMuted: '#a0a0b0',
  border: '#2a2a4a',
  success: '#4caf50',
  warning: '#ff9800',
  danger: '#f44336',
  planned: '#607d8b',
  purchased: '#2196f3',
  installed: '#4caf50',
  removed: '#9e9e9e',
};

export const statusColor: Record<string, string> = {
  Planned: colors.planned,
  Purchased: colors.purchased,
  Installed: colors.installed,
  Removed: colors.removed,
};

export const categoryIcon: Record<string, string> = {
  Engine: 'gear',
  Suspension: 'car',
  Brakes: 'car-sport',
  Exhaust: 'flame',
  Intake: 'speedometer',
  Transmission: 'settings',
  Wheels: 'ellipse',
  Exterior: 'color-palette',
  Interior: 'home',
  Electronics: 'flash',
  Fueling: 'water',
  'Forced Induction': 'thunderstorm',
  Other: 'cube',
};
