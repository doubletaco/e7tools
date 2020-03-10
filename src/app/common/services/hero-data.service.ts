import { Injectable } from '@angular/core';
import { Hero, HeroStatValue } from '../cls/hero';
import { Builder } from 'protractor';
import { HttpClient } from '@angular/common/http';
import { E7DB_API_ENDPOINTS } from 'src/app/gear-goals/defs';

@Injectable({
  providedIn: 'root'
})
export class HeroDataService {

  constructor(private http:HttpClient) { }

  // Gets the hero list to search against
  GetHeroList() {
    let ret = null;

    ret = this.http.get(E7DB_API_ENDPOINTS.GET_HERO_LIST);

    return ret;
  }

  // Gets full hero data including stats, skillups, and awakenings.
  GetFullHeroData(id) {
    throw "Not Implemented"
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
      let levelstats:Array<HeroStatValue> = [];
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
  public GetHeroWithStats(id:String) {
    let jsonobj = {
      id: "c1009",
      name: "Charlotte",
      rarity: 5,
      element: 
      {
        id: 1,
        text: "Fire",
      },
      class:
      {
        id: 2,
        text: "Knight",
      },
      sign:
      {
        id: 1, // Leo
        text: "Leo",
      },
      baseStats:
      [
        {
          level: 50,
          stats:
          [
            {
              id: 1,
              text: "Attack",
              value: 669,
              type: 1
            },
            {
              id: 2,
              text: "Defense",
              value: 534,
              type: 1
            },
            {
              id: 3,
              text: "Health",
              value: 4299,
              type: 1
            },
            {
              id: 4,
              text: "Speed",
              value: 99,
              type: 1
            },
            {
              id: 5,
              text: "Critical Hit Chance",
              value: 15,
              type: 2
            },
            {
              id: 6,
              text: "Critical Hit Damage",
              value: 150,
              type: 2
            },
            {
              id: 7,
              text: "Effectiveness",
              value: 0,
              type: 2
            },
            {
              id: 8,
              text: "Effect Resistance",
              value: 0,
              type: 2
            }
          ]
        },
        {
          level: 60,
          stats:
          [
            {
              id: 1,
              text: "Attack",
              value: 834,
              type: 1
            },
            {
              id: 2,
              text: "Defense",
              value: 662,
              type: 1
            },
            {
              id: 3,
              text: "Health",
              value: 5405,
              type: 1
            },
            {
              id: 4,
              text: "Speed",
              value: 99,
              type: 1
            },
            {
              id: 5,
              text: "Critical Hit Chance",
              value: 15,
              type: 2
            },
            {
              id: 6,
              text: "Critical Hit Damage",
              value: 150,
              type: 2
            },
            {
              id: 7,
              text: "Effectiveness",
              value: 0,
              type: 2
            },
            {
              id: 8,
              text: "Effect Resistance",
              value: 0,
              type: 2
            }
          ]
        }
      ],
      awakenings:
      [
        {
          level: 10,
          stat: 1, 
          effect: 3
        },
        {
          level: 20,
          stat: 1, 
          effect: 3
        },
        {
          level: 30
        },
        {
          level: 40,
          stat: 5, 
          effect: 8
        },
        {
          level: 50,
          stat: 1, 
          effect: 6
        },
        {
          level: 60,
          stat: 1, 
          effect: 6
        }
      ]
    };

    let ret = this.buildHeroObject(jsonobj);

    return ret;
  }

  // Gets basic hero data (name, model, icon, class, element, zodiac)
  GetHero(id) {
    throw "Not implemented";
  }
}
