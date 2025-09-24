import rawStates from './data/states.json';
import { StateDataSchema, type StateInfo } from './schema';

const parsed = StateDataSchema.parse(rawStates);

export type { StateInfo };

export const STATE_CODES = Object.keys(parsed).sort();

export const STATE_DATA: Record<string, StateInfo> = parsed;

export const DEFAULT_STATE = 'DE';

export function getStateInfo(code: string): StateInfo {
  const info = STATE_DATA[code];
  if (!info) {
    throw new Error(`Unknown state code: ${code}`);
  }
  return info;
}
