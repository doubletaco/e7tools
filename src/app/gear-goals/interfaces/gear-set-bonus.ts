import { StatGain } from './stat-gain';

export interface GearSetBonus {
    id: number;
    name: String;
    slots: number; // 2 or 4
    bonus: StatGain;
}
