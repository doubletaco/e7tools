import { IStatGain } from './stat-gain';

export interface IGearSetBonus {
    id: number;
    name: String;
    slots: number; // 2 or 4
    bonus: IStatGain;
}
