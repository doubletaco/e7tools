export class Hero {
    id: String = '';
    name: String = '';
    element: IconInfo = null;
    class: IconInfo = null;
    sign: IconInfo = null;
    rarity: number = 0;
    baseStats: Array<HeroStats> = [];
    awakenings: Array<Awakening> = [];
}

interface IconInfo {
    id: number;
    text: String;
}

export interface HeroStatValue {
    id: number;
    text: String;
    value: number;
    type: number;
}

export interface HeroStats {
    level: number;
    stats: Array<HeroStatValue>;
}

export interface Awakening {
    level: number;
    stat: number;
    effect: number;
}