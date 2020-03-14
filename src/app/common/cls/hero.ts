export class Hero {
    id: String = '';
    name: String = '';
    element: IIconInfo = null;
    class: IIconInfo = null;
    sign: IIconInfo = null;
    rarity: number = 0;
    baseStats: Array<IHeroStats> = [];
    awakenings: Array<IAwakening> = [];
}

interface IIconInfo {
    id: number;
    text: String;
}

export interface IHeroStatValue {
    id: number;
    text: String;
    value: number;
    type: number;
}

export interface IHeroStats {
    level: number;
    stats: Array<IHeroStatValue>;
}

export interface IAwakening {
    level: number;
    stat: number;
    effect: number;
}