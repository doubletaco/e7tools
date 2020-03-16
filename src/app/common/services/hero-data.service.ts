import { Injectable } from '@angular/core';
import { Hero, IHeroStatValue, IHeroStats } from '../cls/hero';
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
  mapAttribute: IDictionary<number> = {
    'fire': 1,
    'ice': 2,
    'wind': 3, // Earth
    'light': 4,
    'dark': 5
  };

  mapRole: IDictionary<number> = {
    'warrior': 1,
    'knight': 2,
    'assassin': 3,
    'ranger': 4,
    'mage': 5,
    'manauser': 6, // Soul Weaver.
    'ingredient': 7 // Unused, but why not have it just in case
  }

  mapZodiac: IDictionary<number> = {
    'waterbearer': 1,
    'ram': 2, // Ares (Aries in game)
    'scorpion': 3, // Scorpio
    'archer': 4, // Saggitarius
    'lion': 5, // Leo
    'crab': 6, // Cancer
    'fish': 7, // Pisces
    'scales': 8, // Libra
    'warrior': 9, // Virgo
    'twins': 10, // Gemini
    'goat': 11, // Capricorn
    'bull': 12 // Taurus
  }

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
  }

  v1_mapStats:IDictionary<{ id:number, text:string }> = {
    'atk': { id: STAT_MAP.ATTACK, text: 'Attack' },
    'hp': { id:STAT_MAP.HEALTH, text: 'Health' },
    'spd': { id: STAT_MAP.SPEED, text: 'Speed' },
    'def': { id: STAT_MAP.DEFENSE, text: 'Defnse' },
    'chc': { id: STAT_MAP.CRITRATE, text: 'Critical Hit Chance' },
    'chd': { id: STAT_MAP.CRITDMG, text: 'Critical Hit Damage' },
    'eff': { id: STAT_MAP.EFFECTIVENESS, text: 'Effectiveness' },
    'efr': { id: STAT_MAP.EFFRES, text: 'Effect Resistance' },
    'dac': { id: STAT_MAP.DUALATTACK, text: 'Dual Attack Chance' }
  }

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
        let hli:IHeroListItem = {
          id: id,
          apiId: resItem['_id'],
          name: resItem['name'],
          rarity: resItem['rarity'],
          class: this.mapRole[resItem['role']],
          element: this.mapAttribute[resItem['attribute']],
          sign: this.mapZodiac[resItem['zodiac']]
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

  v1BuildHeroObject(obj:Object) {
    let ret:Hero = new Hero();

    ret.id = obj['_id'];
    ret.gameId = obj['gameId'];
    ret.name = obj['name'];
    ret.class = { id: this.mapRole[obj['classType']], text: obj['classType'] };
    ret.element = { id: this.mapAttribute[obj['element']], text: obj['element'] };
    ret.sign = { id: this.mapZodiac[obj['zodiac']], text: obj['zodiac'] }
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
      let statsNode = obj['stats'];
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
              id: this.v1_mapStats[key].id,
              text: this.v1_mapStats[key].text,
              value: ((itm[key] < 2 && itm[key] > 0) ? (itm[key] * 100) : itm[key]),
              type: ((flatstats.indexOf(this.v1_mapStats[key].id) > -1) ? 1 : 2)
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
      let awakeningNode = obj['awakening'];
      for (let i = 0; i < awakeningNode.length; i++) {
        let statId:number = 0;
        let statValue:number = 0;
        for (let j = 0; j < awakeningNode[i]['statsIncrease'].length; j++) {
          for (let key in awakeningNode[i]['statsIncrease'][j]) {
            if (awakeningNode[i]['statsIncrease'][j][key] >= 20) continue;
            statId = this.v1_mapStats[key].id;
            statValue = ((awakeningNode[i]['statsIncrease'][j][key] < 1 && awakeningNode[i]['statsIncrease'][j][key] > 0) ? awakeningNode[i]['statsIncrease'][j][key] * 100 : awakeningNode[i]['statsIncrease'][j][key]);
          }
        }
        ret.awakenings.push({
          level: (awakeningNode[i]['rank'] * 10),
          stat: statId,
          effect: statValue
        })
      }
      return ret;
    }
  }

  buildHeroObject(obj:Object) {
    let res:Hero = new Hero();

    res.id = obj['id'];
    res.name = obj['name'];
    res.element = { id: obj['element']['id'], text: obj['element']['text']};
    res.class = { id: obj['class']['id'], text: obj['class']['text']};
    res.sign = { id: obj['sign']['id'], text: obj['sign']['text']};
    res.rarity = obj['rarity'];

    for (let i = 0; i < obj['baseStats'].length; i++) {
      let levelstats:Array<IHeroStatValue> = [];
      for (let j = 0; j < obj['baseStats'][i]['stats'].length; j++) {
        levelstats.push({ 
          id: obj['baseStats'][i]['stats'][j]['id'],
          text: obj['baseStats'][i]['stats'][j]['text'],
          value: obj['baseStats'][i]['stats'][j]['value'],
          type: obj['baseStats'][i]['stats'][j]['type']
        });
      }
      res.baseStats.push({level: obj['baseStats'][i]['level'], stats: levelstats});
    }
    for (let i = 0; i < obj['awakenings'].length; i++) {
      res.awakenings.push({
        level: obj['awakenings'][i]['level'],
      stat: obj['awakenings'][i]['stat'],
      effect: obj['awakenings'][i]['effect']});
    }
    return res;
  }

  // Gets hero data with base stats and awakenings
  public GetHeroWithStats(id:String):Observable<Hero> {
    return this.http.get(E7DB_API_ENDPOINTS.V1_GET_HERO_DATA + id).pipe(
      map(data => {
        return this.v1BuildHeroObject(data['results'][0]);
      })
    )
  }

  // Gets basic hero data (name, model, icon, class, element, zodiac)
  GetHero(id) {
    throw "Not implemented";
  }
}
