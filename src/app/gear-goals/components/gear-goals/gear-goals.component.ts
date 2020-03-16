import { Component, OnInit } from '@angular/core';
import { HeroDataService } from 'src/app/common/services/hero-data.service';
import { Hero, IHeroStatValue, IHeroStats, IAwakening } from 'src/app/common/cls/hero';
import { IGearSetBonus } from '../../interfaces/gear-set-bonus';
import { GearGoalsService } from '../../services/gear-goals.service';
import { GEAR_SETS, STAT_MAP } from '../../defs';
import { ISubStat } from '../../interfaces/sub-stat';
import { GEAR_STATS } from 'src/defs.global';
import { IStatGain } from '../../interfaces/stat-gain';
import { stat } from 'fs';
import { IHeroListItem } from 'src/app/common/interfaces/hero-list-item';

@Component({
  selector: 'app-gear-goals',
  templateUrl: './gear-goals.component.html',
  styleUrls: ['./gear-goals.component.css']
})
export class GearGoalsComponent implements OnInit {

  // Internal logic variables. These should probably be in a Service.
  activeHero: Hero = null;
  heroId: String = '';
  baseStatsAtLevel: IHeroStats = null;
  gearSets: Array<IGearSetBonus> = [];
  subStats: Array<ISubStat> = [];
  heroImage: String = "";
  showSearch: boolean = true;
  showResults: boolean = false;
  //-----------------------------------

  // API Data properties
  heroSearchList:Array<IHeroListItem> = [];
  filteredHeroSearchList:Array<IHeroListItem> = [];

  // Page internal variables.
  maxGearSlots: number = 6;
  usedGearSlots: number = 0;
  selectedGearSets: Array<number> = [];
  //-----------------------------------

  // Hacks (e.g. ngFor over number, etc)
  SELECT_GEARSETS: Array<number> = [0, 1, 2];

  // User-Selectable Parameters
  searchText: String = '';
  maxLevel: number = 0;
  maxAwakening: number = 0;
  targetStats: IHeroStats = null;
  gearSlots: Array<IStatGain> = [];
  awakenSliderValue: number = 0;
  //-----------------------------------

  // Gear Analysis properties
  checkedGearSlots: boolean[][];

  // test vars
  testHS: IHeroListItem = {
    id: 'charlotte',
    apiId: 'charlotte',
    name: 'Charlotte',
    rarity: 5,
    class: 2,
    element: 1,
    sign: 3
  };

  constructor(private _heroDataService:HeroDataService, private _gearGoalsService:GearGoalsService) { }

  ngOnInit(): void {

    // Get hero search list
    // Check cache timestamp. The hero list doesnt't update often, so we don't need to fetch it often.
    let now = new Date();
    let cache = localStorage.getItem('hero-list-data-cache-ts');
    // Hack since TypeScript won't let you let browsers handle storing Date objects in localstorage
    if (cache == null || (Date.parse(now.toString()) - Date.parse(cache)) > (60 * 6000)) {
      // Fetch the data again if the cache has expired.
      this._heroDataService.GetHeroList().subscribe((data) => {
        console.log('fetching');
        this.heroSearchList = data
        let cacheTs = new Date();
        localStorage.setItem('hero-list-data', JSON.stringify(data));
        localStorage.setItem('hero-list-data-cache-ts', cacheTs.toString());
      });
    }
    else { // Use our client-side cached hero list.
      this.heroSearchList = JSON.parse(localStorage.getItem("hero-list-data"))
      console.log('cached');
    }

    // Get Gear Sets and init the gear set selection boxes to No Set
    this.gearSets = this._gearGoalsService.getAllSetBonuses();
    for (let i = 0; i < this.SELECT_GEARSETS.length; i++)
      this.selectedGearSets.push(0);

    // this.onSelectHero('');
  }

  onSelectHero(data:IHeroListItem) {
    this._heroDataService.GetHeroWithStats(data.apiId).subscribe((hero) => {
      this.activeHero = hero;
      this.showSearch = false;
      this.searchText = data.name;
      this.maxLevel = this.activeHero.baseStats[0].level;
      this.initStats();
      this.heroImage = 'assets/hero/' + this.activeHero.id + '/model.png';
    })
  }

  initStats() {
    let base = this.activeHero.baseStats.find(o => o.level == this.maxLevel);
    let statMultipliers: Array<number> = [];
    let flatAttack: number = 0;
    let flatHealth: number = 0;
    this.baseStatsAtLevel = JSON.parse(JSON.stringify(base));

    if (this.maxAwakening > this.maxLevel) {
      this.maxAwakening = this.maxLevel;
      this.awakenSliderValue = (this.maxLevel / 10);
    }

    if (this.maxAwakening > 0)
    {
      for(let i = 0; i < (this.maxAwakening / 10); i++)
      {
        let awaken = this.activeHero.awakenings[i];

        let statIndex = this.baseStatsAtLevel.stats.findIndex(s => s.id == awaken.stat);
        
        if (statIndex != -1) { 
          if (statMultipliers[statIndex] !== undefined)
            statMultipliers[statIndex] += awaken.effect;
          else
            statMultipliers[statIndex] = awaken.effect;
        }

        // First 3 awakenings give 20/60, last 3 gives 30/80
        flatAttack += (i < 3 ? 20 : 30);
        flatHealth += (i < 3 ? 60 : 80);
      }
    }

    if (this.maxLevel < this.maxAwakening)
      this.maxAwakening = 0;

    for(let j = 0; j < statMultipliers.length; j++) {
      if (statMultipliers[j] === undefined)
        continue;
      if (this.baseStatsAtLevel.stats[j].type == 1)
        this.baseStatsAtLevel.stats[j].value = (this.baseStatsAtLevel.stats[j].value * (1.00 + (statMultipliers[j] / 100)));
      else if (this.baseStatsAtLevel.stats[j].type == 2)
        this.baseStatsAtLevel.stats[j].value = (this.baseStatsAtLevel.stats[j].value + statMultipliers[j]);
    }

    // Init gear slots
    for (let j = 0; j < 6; j++) {
      this.gearSlots.push( { stat: 1, gain: 0 } );
    }

    // We'll always need to update Attack and Health
    let attackIndex = this.baseStatsAtLevel.stats.findIndex(s => s.id == 1);
    let healthIndex = this.baseStatsAtLevel.stats.findIndex(s => s.id == 3);
    
    this.baseStatsAtLevel.stats[attackIndex].value += flatAttack;
    this.baseStatsAtLevel.stats[healthIndex].value += flatHealth;

    // Clone stat array so we have new references, and drop the decimal places since they don't matter for user input.
    // Pretty sure Epic Seven always rounds down.
    this.targetStats = JSON.parse(JSON.stringify(this.baseStatsAtLevel));
    for (let i = 0; i < this.targetStats.stats.length; i++) {
      this.targetStats.stats[i].value = Math.floor(this.targetStats.stats[i].value);
    }
  }

  onSelectAwakening() {
    this.initStats()
  }

  formatStatText(stat:IHeroStatValue) {
    if (stat.type == 1)
      return Math.floor(stat.value);
    if (stat.type == 2)
      return stat.value.toFixed(2);
  }

  onGearSetChange(value, index) {
    this.selectedGearSets[index] = value;

    // Recalculate available gear slots
    this.usedGearSlots = 0;
    for (let i = 0; i < this.SELECT_GEARSETS.length; i++) {
      let set = this.gearSets.find(s => s.id == this.selectedGearSets[i]);
      this.usedGearSlots += set.slots;
    }
  }

  canDisplayOption(index, set): boolean {
    if (this.selectedGearSets[index] == set.id)
      return true;
    else if ((this.usedGearSlots + set.slots) > this.maxGearSlots)
      return false;
    return true;
  }

  getGearMainStats(slotnum) {
  }

  recalculateSubstats() {
    // TODO: Only clear out substats we don't need  
    this.subStats = []; // Wipe out our old substat calculations
    this.checkedGearSlots = [];
    for (let i = 0; i < this.targetStats.stats.length; i++) {
      this.checkedGearSlots[i] = [false, false, false, false, false, false];
      let baseStat = this.baseStatsAtLevel.stats[i];
      let baseStatVal = this.baseStatsAtLevel.stats[i].value;
      let targetStatVal = this.targetStats.stats[i].value;

      // Add any equipment values so we get the real stat gap
      let gearStatVal: number = 0;
      for (let k = 0; k < this.gearSlots.length; k++) {
        let slot: IStatGain = this.gearSlots[k];
        if (slot == null || slot === undefined)
          continue;
        if (slot.stat == baseStat.id) {
          if (slot.type == 1)
            gearStatVal += slot.gain;
          else if (slot.type == 2) {
            let slotPercent = (slot.gain / 100);
            if (baseStat.type == 1)
              gearStatVal += (baseStat.value * slotPercent);
            else if (baseStat.type == 2)
            gearStatVal += slot.gain;
          }
        }
      }

      if (targetStatVal == baseStatVal)
        continue; // Nothing to do. Short-circuit for this stat
      if (targetStatVal - baseStatVal < 0) {
        // Invalid inputs. Cancel substat calculations and clear out any pending ones.
        this.subStats = [];
        return;
      }
      else {
        let statGapVal = (targetStatVal - (baseStatVal + gearStatVal))
        let targetStatPercent = 0;
        
        if (baseStat.type == 1 && baseStat.id != STAT_MAP.SPEED)
          targetStatPercent = Math.ceil((statGapVal / baseStatVal) * 100);
        if (baseStat.type == 2 || baseStat.id == STAT_MAP.SPEED)
          targetStatPercent = statGapVal;


        for (let j = 0; j < this.selectedGearSets.length; j++) {
          let setInfo = (this.gearSets.find(s => s.id == this.selectedGearSets[j]))
          if (setInfo == null) continue;
          if (setInfo.bonus.stat == baseStat.id) {
            targetStatPercent = (targetStatPercent - setInfo.bonus.gain);
            if (targetStatPercent < 0)
              targetStatPercent = 0;
          }
        }
        console.log('calculated stat: ' + baseStat.id + ' || percentage: ' + targetStatPercent)
        this.subStats[i] = { stat: baseStat.id, value: targetStatPercent };
        this.checkedGearSlots[i] = [];
        for (let z = 0; z < 6; z++)
          this.checkedGearSlots[i][z] = false;
      }

    }
  }

  renderSubstat(sub:ISubStat) {
    if (sub == null)
      return;
    
    let ret = '';

    // TODO: Make this translatable
    switch(sub.stat) {
      case STAT_MAP.ATTACK: ret += 'Attack'; break;
      case STAT_MAP.DEFENSE: ret += 'Defense'; break;
      case STAT_MAP.HEALTH: ret += 'Health'; break;
      case STAT_MAP.SPEED: ret += 'Speed'; break;
      case STAT_MAP.CRITRATE: ret += 'Critical Hit Rate'; break;
      case STAT_MAP.CRITDMG: ret += 'Critical Hit Damage'; break;
      case STAT_MAP.EFFECTIVENESS: ret += 'Effectiveness'; break;
      case STAT_MAP.EFFRES: ret += 'Effect Resistance'; break;
      case STAT_MAP.DUALATTACK: ret += 'Dual Attack Chance'; break;
    }

    ret += ' : ' + sub.value + (sub.stat == STAT_MAP.SPEED ? '' : '%');
    return ret;
  }

  showAwakening(a:IAwakening): boolean {
    return a.level <= this.maxLevel;
  }

  onSlotUpdate(stat, slotnum) {
    this.gearSlots[slotnum-1].stat = stat.stat;
    this.gearSlots[slotnum-1].gain = stat.gain;
    this.gearSlots[slotnum-1].type = stat.type;
  }

  debugFunc() {
    console.log('hi');
  }

  getSubStatAnalysis(sub:ISubStat, statindex:number) {
    let ret = 0;
    let numSlots = 0;

    for (let i = 0; i < this.checkedGearSlots[statindex].length; i++)
      numSlots += (this.checkedGearSlots[statindex][i] == true ? 1 : 0);

    if (numSlots == 0)
      ret = sub.value;
    else
      ret = Math.ceil(sub.value / numSlots);
    return ret;
  }

  isSubstatAvailableForGearSlot(sub:IStatGain, slot:number) {
    let ret = true;

    switch (slot) {
      case GEAR_SLOTS.WEAPON:
        if (sub.stat != STAT_MAP.DEFENSE)
          ret = false;
        break;
      case GEAR_SLOTS.HELMET:
        ret = false;
        break;
      case GEAR_SLOTS.ARMOR:
        if (sub.stat != STAT_MAP.ATTACK)
          ret = false;
          break;
      case GEAR_SLOTS.NECKLACE:
      case GEAR_SLOTS.RING:
      case GEAR_SLOTS.BOOTS:
        let gearStat = this.gearSlots[slot - 1];
        if (gearStat.stat == sub.stat && gearStat.type != 2)
          ret = false;
        else if (gearStat.stat != sub.stat)
          ret = false;
        else if (gearStat.stat == sub.stat && sub.stat == STAT_MAP.SPEED)
          ret = true;
        break;
      default: break;
    }

    return ret;
  }

  isSlotAtMaximumSubstats(slot:number) {
    let subsUsed = 0;

    for (let i = 0; i < this.checkedGearSlots.length; i++) {
      if (this.checkedGearSlots[i][slot-1] == true)
          subsUsed += 1;
    }

    if (subsUsed >= 4)
      return true;
    else return false;
  }

  updateAwakening(value:number) {
    this.awakenSliderValue = ((value * 10) > this.maxLevel ? (this.maxLevel / 10) : value);
    this.maxAwakening = (this.awakenSliderValue * 10);
    this.initStats();
  }


  activateSearch() {
    this.showSearch = true;
    if (this.searchText != '' && this.searchText != null)
      this.showResults = true;
  }

  filterHeroSearchResults() {
    this.showResults = true;
    if (this.searchText == '' || this.searchText == null)
      this.filteredHeroSearchList = this.heroSearchList;  
    else
      this.filteredHeroSearchList =  this.heroSearchList.filter(itm => (itm.name.toLocaleLowerCase()).indexOf(this.searchText.toLowerCase()) > -1)
  }

  closeSearch() {
    if (this.showSearch)
      this.showSearch = false;
  }

  onClickSearchBox() {
    if (this.searchText == '' || this.searchText == null)
      this.showResults = true;
  }

  closeResults() {
    this.showResults = false;
  }
}

export enum GEAR_SLOTS {
  NO_SLOT=0,
  WEAPON,
  HELMET,
  ARMOR,
  NECKLACE,
  RING,
  BOOTS
}