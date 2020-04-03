import { Injectable } from '@angular/core';
import { Hero, IHeroStatValue, IHeroStats, IIconInfo } from '../cls/hero';
import { Builder } from 'protractor';
import { HttpClient } from '@angular/common/http';
import { E7DB_API_ENDPOINTS, STAT_MAP } from 'src/app/gear-goals/defs';
import { IHeroListItem } from '../interfaces/hero-list-item';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IDictionary } from '../interfaces/dictionary';

@Injectable({
  providedIn: 'root'
})
export class HeroDataService {

  // EpicSevenDB API mapping dictionaries
  v1_mapAttribute: IDictionary<number> = {
    'fire': 1,
    'ice': 2,
    'wind': 3, // Earth
    'light': 4,
    'dark': 5
  };

  mapAttribute: IDictionary<IIconInfo> = {
    'fire': { id: 1, text: 'Fire' },
    'ice': { id: 2, text: 'Ice' },
    'wind': { id: 3, text: 'Earth' }, // Earth
    'light': { id: 4, text: 'Light' },
    'dark': { id: 5, text: 'Dark' }
  };

  mapClassType: IDictionary<number> = {
    'warrior': 1,
    'knight': 2,
    'assassin': 3,
    'ranger': 4,
    'mage': 5,
    'manauser': 6, // Soul Weaver.
    'ingredient': 7 // Unused, but why not have it just in case
  };

  mapRole: IDictionary<IIconInfo> = {
    'warrior': { id: 1, text: 'Warrior' },
    'knight': { id: 2, text: 'Knight' },
    'assassin': { id: 3, text: 'Thief' },
    'ranger': { id: 4, text: 'Ranger'},
    'mage': { id: 5, text: 'Mage' },
    'manauser': { id: 6, text: 'Soul Weaver' }, // Soul Weaver.
    'ingredient': { id: 7, text: 'Ingredient' } // Unused, but why not have it just in case
  };

  mapZodiac: IDictionary<IIconInfo> = {
    'waterbearer': { id: 1, text: 'Aquarius' },
    'ram': { id: 2, text: 'Aries' }, // Ares (Aries in game)
    'scorpion': { id: 3, text: 'Scorpio' }, // Scorpio
    'archer': { id: 4, text: 'Saggitarius' }, // Saggitarius
    'lion': { id: 5, text: 'Leo' }, // Leo
    'crab': { id: 6, text: 'Cancer' }, // Cancer
    'fish': { id: 7, text: 'Pisces' }, // Pisces
    'scales': { id: 8, text: 'Libra' }, // Libra
    'maiden': { id: 9, text: 'Virgo' }, // Virgo
    'twins': { id: 10, text: 'Gemini' }, // Gemini
    'goat': { id: 11, text: 'Capricorn' }, // Capricorn
    'bull': { id: 12, text: 'Taurus' } // Taurus
  };

  v1_mapZodiac: IDictionary<number> = {
    'aquarius': 1,
    'aries': 2, // Ares (Aries in game)
    'scorpio': 3, // Scorpio
    'sagittarius': 4, // Saggitarius
    'leo': 5, // Leo
    'cancer': 6, // Cancer
    'pisces': 7, // Pisces
    'libra': 8, // Libra
    'virgo': 9, // Virgo
    'gemini': 10, // Gemini
    'capricorn': 11, // Capricorn
    'taurus': 12 // Taurus
  };

  mapStats:IDictionary<{ id:number, text:string }> = {
    'atk': { id: STAT_MAP.ATTACK, text: 'Attack' },
    'hp': { id:STAT_MAP.HEALTH, text: 'Health' },
    'spd': { id: STAT_MAP.SPEED, text: 'Speed' },
    'def': { id: STAT_MAP.DEFENSE, text: 'Defnse' },
    'chc': { id: STAT_MAP.CRITRATE, text: 'Critical Hit Chance' },
    'chd': { id: STAT_MAP.CRITDMG, text: 'Critical Hit Damage' },
    'eff': { id: STAT_MAP.EFFECTIVENESS, text: 'Effectiveness' },
    'efr': { id: STAT_MAP.EFFRES, text: 'Effect Resistance' },
    'dac': { id: STAT_MAP.DUALATTACK, text: 'Dual Attack Chance' }
  };

  mapAwakeningStats:IDictionary<{ id:number, text:string }> = {
    'att_rate': { id: STAT_MAP.ATTACK, text: 'Attack' },
    'max_hp_rate': { id:STAT_MAP.HEALTH, text: 'Health' },
    'speed': { id: STAT_MAP.SPEED, text: 'Speed' },
    'def_rate': { id: STAT_MAP.DEFENSE, text: 'Defnse' },
    'cri': { id: STAT_MAP.CRITRATE, text: 'Critical Hit Chance' },
    'cri_dmg': { id: STAT_MAP.CRITDMG, text: 'Critical Hit Damage' },
    'acc': { id: STAT_MAP.EFFECTIVENESS, text: 'Effectiveness' },
    'res': { id: STAT_MAP.EFFRES, text: 'Effect Resistance' },
    'dac': { id: STAT_MAP.DUALATTACK, text: 'Dual Attack Chance' }
  };

  constructor(private http:HttpClient) { }

  // Gets the hero list to search against
  GetHeroList():Observable<Array<IHeroListItem>> {
    return this.http.get(E7DB_API_ENDPOINTS.GET_HERO_LIST)
    .pipe(map(data => {
      let ret: Array<IHeroListItem> = [];
      let resNode = data['results'];
      for (let i = 0; i < resNode.length; i++) {
        let resItem = resNode[i];
        let id = (resItem['id'] ? resItem['id'] : resItem['_id']) // E7DB doesn't return the internal ID (yet?)
        if (resItem['attribute'] == 'none') continue; // Not a selectable unit. Don't care about it.

        let hli:IHeroListItem = {
          id: id,
          apiId: resItem['_id'],
          name: resItem['name'],
          rarity: resItem['rarity'],
          class: this.mapRole[resItem['role']].id,
          element: this.mapAttribute[resItem['attribute']].id,
          sign: this.mapZodiac[resItem['zodiac']].id
        }
        ret.push(hli);
      }
      ret.sort((a, b) => {
        if (a.name < b.name) return -1;
        else if (a.name > b.name) return 1;
        else return 0;
      });
      return ret;
    }));
  }

  // Gets full hero data including stats, skillups, and awakenings.
  GetFullHeroData(id) {
    throw "Not Implemented"
  }

  buildHeroObject(obj:Object) {
    let ret:Hero = new Hero();

    ret.id = obj['_id'];
    ret.gameId = obj['id'];
    ret.name = obj['name'];
    ret.class = { id: this.mapRole[obj['role']].id, text: this.mapRole[obj['role']].text };
    ret.element = this.mapAttribute[obj['attribute']];
    ret.sign = this.mapZodiac[obj['zodiac']];
    ret.rarity = obj['rarity'];

    // Stat Mapping
    {
      // The API returns fully awakened stats, but since we calculate that here, there's no need to keep that data
      let baseStatsKeys:Array<String> = [
        'lv30ThreeStarNoAwaken',
        'lv40FourStarNoAwaken',
        'lv50FiveStarNoAwaken',
        'lv60SixStarNoAwaken'
      ];
      let flatstats:Array<number> = [STAT_MAP.ATTACK, STAT_MAP.DEFENSE, STAT_MAP.HEALTH, STAT_MAP.SPEED];
      let statsNode = obj['calculatedStatus'];
      for (let i = 0; i < baseStatsKeys.length; i++) {
        let itm = statsNode[baseStatsKeys[i]];
        if (itm == null) continue; // Skip stat sets that don't exist (e.g. 3 star stats for a nat 5)
        let lvl:number;
        switch(i) {
          case 0: lvl = 30; break;
          case 1: lvl = 40; break;
          case 2: lvl = 50; break;
          case 3: lvl = 60; break;
          default: return null; // Shouldn't ever happen
        }
        let lvlStats:Array<IHeroStatValue> = [];
        for (let key in itm) {
          if (true) {
            if (key == 'cp') continue // Don't care about this stat

            lvlStats.push({
              id: this.mapStats[key].id,
              text: this.mapStats[key].text,
              value: ((itm[key] < 2 && itm[key] > 0) ? (itm[key] * 100) : itm[key]),
              type: ((flatstats.indexOf(this.mapStats[key].id) > -1) ? 1 : 2)
            });
          }
        }
        // My IDs are the order in which they're displayed on the hero box screen
        lvlStats.sort((a, b) => {
          if (a.id < b.id) return -1;
          else if (b.id < a.id) return 1;
          else return 0;
        });

        ret.baseStats.push({
          level: lvl,
          stats: lvlStats
        });
        // outside key loop
      }
    }

    // Awakenings
    {
      let awakeningNode = obj['zodiac_tree'];
      for (let i = 0; i < awakeningNode.length; i++) {
        let nodeLevel:number = 0;
        let statId:number = 0;
        let statValue:number = 0;
        // ID format: 'zodiac_#', 0-indexed.
        nodeLevel = ((parseInt(awakeningNode[i]['_id'].charAt(awakeningNode[i]['_id'].length - 1)) + 1) * 10);

        if (i != 2) {
          statId = this.mapAwakeningStats[awakeningNode[i]['stats'][0]['stat']].id;
          statValue = awakeningNode[i]['stats'][0]['value'];
          statValue = (statValue > 0 && statValue < 1 ? statValue * 100 : statValue);
        }
        
        ret.awakenings.push({
          level: nodeLevel,
          stat: statId,
          effect: statValue
        });
      }
    }

    return ret;
  }

  // Gets hero data with base stats and awakenings
  public GetHeroWithStats(id:String):Observable<Hero> {
    return this.http.get(E7DB_API_ENDPOINTS.GET_HERO + id).pipe(
      map(data => {
        return this.buildHeroObject(data['results'][0]);
      })
    )
  }

  // Gets basic hero data (name, model, icon, class, element, zodiac)
  GetHero(id) {
    throw "Not implemented";
  }
}
