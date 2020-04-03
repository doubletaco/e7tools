import { Injectable } from '@angular/core';
import { IGearSetBonus } from '../interfaces/gear-set-bonus';
import { STAT_MAP, GEAR_SETS } from '../defs';
import { getEnabledCategories } from 'trace_events';
import { Hero, IHeroStats } from 'src/app/common/cls/hero';
import { ISubStat } from '../interfaces/sub-stat';
import { IGearStat } from '../interfaces/gear-stat';
import { GEAR_STATS } from 'src/defs.global';
import { BrowserStack } from 'protractor/built/driverProviders';

@Injectable({
  providedIn: 'root'
})
export class GearGoalsService {

  activeHero: Hero;
  heroId: String = '';
  baseStatsAtLevel: IHeroStats = null;
  gearSets: Array<IGearSetBonus> = [];
  subStats: Array<ISubStat> = [];

  constructor() { }

  public getMainStatOptions(slot): Array<IGearStat> {
    let ret: Array<IGearStat> = [];
    /*
      Stat slots:
      1 - Weapon
      2 - Helmet
      3 - Chest
      4 - Necklace
      5 - Ring
      6 - Boots
      7 - Artifact
      8 - Exclusive Equipment
    */
    switch(slot) {
      case 1: // Weapon
        ret = [{
          name: 'Attack (Flat)',
          value: GEAR_STATS.ATTACK_FLAT
        }];
        break;
      case 2:
        ret = [{
          name: 'Health (Flat)',
          value: GEAR_STATS.HEALTH_FLAT
        }];
        break;
      case 3:
        ret = [{
          name: 'Defense (Flat)',
          value: GEAR_STATS.DEFENSE_FLAT
        }];
        break;
      case 4: // necklace
        ret = [{
          name: 'Attack (Flat)',
          value: GEAR_STATS.ATTACK_FLAT
        },
        {
          name: 'Attack (%)',
          value: GEAR_STATS.ATTACK_PERCENT
        },
        {
          name: 'Defense (Flat)',
          value: GEAR_STATS.DEFENSE_FLAT
        },
        {
          name: 'Defense (%)',
          value: GEAR_STATS.DEFENSE_PERCENT
        },
        {
          name: 'Health (Flat)',
          value: GEAR_STATS.HEALTH_FLAT
        },
        {
          name: 'Health (%)',
          value: GEAR_STATS.HEALTH_PERCENT
        },
        {
          name: 'Critial Hit Rate',
          value: GEAR_STATS.CRITRATE
        },
        {
          name: 'Critial Hit Damage',
          value: GEAR_STATS.CRITDMG
        }];
        break;
      case 5: // Ring
        ret = [{
          name: 'Attack (Flat)',
          value: GEAR_STATS.ATTACK_FLAT
        },
        {
          name: 'Attack (%)',
          value: GEAR_STATS.ATTACK_PERCENT
        },
        {
          name: 'Defense (Flat)',
          value: GEAR_STATS.DEFENSE_FLAT
        },
        {
          name: 'Defense (%)',
          value: GEAR_STATS.DEFENSE_PERCENT
        },
        {
          name: 'Health (Flat)',
          value: GEAR_STATS.HEALTH_FLAT
        },
        {
          name: 'Health (%)',
          value: GEAR_STATS.HEALTH_PERCENT
        },
        {
          name: 'Effectiveness',
          value: GEAR_STATS.EFFECTIVENESS
        },
        {
          name: 'Effect Resistance',
          value: GEAR_STATS.EFFRES
        }];
        break;
      case 6: // Boots
        ret = [{
          name: 'Attack (Flat)',
          value: GEAR_STATS.ATTACK_FLAT
        },
        {
          name: 'Attack (%)',
          value: GEAR_STATS.ATTACK_PERCENT
        },
        {
          name: 'Defense (Flat)',
          value: GEAR_STATS.DEFENSE_FLAT
        },
        {
          name: 'Defense (%)',
          value: GEAR_STATS.DEFENSE_PERCENT
        },
        {
          name: 'Health (Flat)',
          value: GEAR_STATS.HEALTH_FLAT
        },
        {
          name: 'Health (%)',
          value: GEAR_STATS.HEALTH_PERCENT
        },
        {
          name: 'Speed',
          value: GEAR_STATS.SPEED
        }];
        break;
      default: break;
    }
    return ret;
  }

  public getAllSetBonuses(): Array<IGearSetBonus> {
    let res: Array<IGearSetBonus> = [];

    // Eventually I'll get these from the back-end so I can have translatable strings

    // Attack Set - 30%
    res = [
      {
        id: GEAR_SETS.NO_SET,
        name: 'No set effect',
        slots: 0,
        bonus: {
          stat: STAT_MAP.NO_STAT,
          gain: 0
        }
      },
      
      {
      id: GEAR_SETS.ATTACK_SET,
      name: 'Attack Set',
      slots: 4,
      bonus: {
        stat: STAT_MAP.ATTACK,
        gain: 30
      }
    },

    // Defense set - 15%
    {
      id: GEAR_SETS.DEFENSE_SET,
      name: 'Defense Set',
      slots: 2,
      bonus: {
        stat: STAT_MAP.DEFENSE,
        gain: 15
      }
    },

    // Health set - 15%
    {
      id: GEAR_SETS.HEALTH_SET,
      name: 'Health Set',
      slots: 2,
      bonus: {
        stat: STAT_MAP.HEALTH,
        gain: 15
      }
    },

    // Speed Set - 25%
    {
      id: GEAR_SETS.SPEED_SET,
      name: 'Speed Set',
      slots: 4,
      bonus: {
        stat: STAT_MAP.SPEED,
        gain: 25
      }
    },

    // Crit Set - 12%
    {
      id: GEAR_SETS.CRIT_SET,
      name: 'Cricial Set',
      slots: 2,
      bonus: {
        stat: STAT_MAP.CRITRATE,
        gain: 12
      }
    },

    // Hit Set  - 20%
    {
      id: GEAR_SETS.HIT_SET,
      name: 'Hit Set',
      slots: 2,
      bonus: {
        stat: STAT_MAP.EFFECTIVENESS,
        gain: 20
      }
    },

    // Destruction Set - 40%
    {
      id: GEAR_SETS.DESTRUCTION_SET,
      name: 'Destruction Set',
      slots: 4,
      bonus: {
        stat: STAT_MAP.CRITDMG,
        gain: 40
      }
    },

    // Resist Set - 20%
    {
      id: GEAR_SETS.RESIST_SET,
      name: 'Resist Set',
      slots: 2,
      bonus: {
        stat: STAT_MAP.EFFRES,
        gain: 20
      }
    },

    // Counter Set - 0%
    {
      id: GEAR_SETS.COUNTER_SET,
      name: 'Counter Set',
      slots: 4,
      bonus: {
        stat: STAT_MAP.NO_STAT,
        gain: 0
      }
    },

    // Lifesteal Set - 0%
    {
      id: GEAR_SETS.LIFESTEAL_SET,
      name: 'Lifesteal Set',
      slots: 4,
      bonus: {
        stat: STAT_MAP.NO_STAT,
        gain: 0
      }
    },

    // Unity Set
    {
      id: GEAR_SETS.UNITY_SET,
      name: 'Unity Set',
      slots: 2,
      bonus: {
        stat: STAT_MAP.DUALATTACK,
        gain: 4
      }
    },

    // Rage Set
    {
      id: GEAR_SETS.RAGE_SET,
      name: 'Rage Set',
      slots: 4,
      bonus: {
        stat: STAT_MAP.NO_STAT,
        gain: 0
      }
    },

    // Immunity Set
    {
      id: GEAR_SETS.IMMUNITY_SET,
      name: 'Immunity Set',
      slots: 2,
      bonus: {
        stat: STAT_MAP.NO_STAT,
        gain: 0
      }
    }];

    return res;
  }

  public mapGearStatToRealStat(mainstat:number) {
    let realStat = STAT_MAP.NO_STAT;

    switch (mainstat) {
      case GEAR_STATS.ATTACK_FLAT:
      case GEAR_STATS.ATTACK_PERCENT:
        realStat = STAT_MAP.ATTACK;
        break;
      case GEAR_STATS.DEFENSE_FLAT:
      case GEAR_STATS.DEFENSE_PERCENT:
        realStat = STAT_MAP.DEFENSE;
        break;
      case GEAR_STATS.HEALTH_FLAT:
      case GEAR_STATS.HEALTH_PERCENT:
        realStat = STAT_MAP.HEALTH;
        break;
      case GEAR_STATS.SPEED:
        realStat = STAT_MAP.SPEED;
        break;
      case GEAR_STATS.CRITRATE:
        realStat = STAT_MAP.CRITRATE;
        break;
      case GEAR_STATS.CRITDMG:
        realStat = STAT_MAP.CRITDMG;
        break;
      case GEAR_STATS.EFFECTIVENESS:
        realStat = STAT_MAP.EFFECTIVENESS;
        break;
      case GEAR_STATS.EFFRES:
        realStat = STAT_MAP.EFFRES;
        break;
      default: break;
    }
    return realStat;
  }
}
