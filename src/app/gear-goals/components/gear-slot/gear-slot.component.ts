import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GearGoalsService } from '../../services/gear-goals.service';
import { IGearStat } from '../../interfaces/gear-stat';
import { ISubStat } from '../../interfaces/sub-stat';
import { GEAR_STATS } from 'src/defs.global';
import { GEAR_SETS } from '../../defs';
import { IStatGain } from '../../interfaces/stat-gain';


@Component({
  selector: 'app-gear-slot',
  templateUrl: './gear-slot.component.html',
  styleUrls: ['./gear-slot.component.css']
})
export class GearSlotComponent implements OnInit {

  @Input() slot: number = 0;
  statVal: number = 0;
  mainStats: Array<IGearStat> = [];
  selectedMainStat: IGearStat = null;
  selectDisabled: boolean = true;

  // Ouptut properties
  @Output() slotUpdate = new EventEmitter();

  constructor(private _gearGoalsService:GearGoalsService) { }

  ngOnInit(): void {
    this.mainStats = this._gearGoalsService.getMainStatOptions(this.slot);
    console.log(this.slot);
    if (this.slot > 3 && this.slot < 7)
      this.selectDisabled = false;
    else
      this.selectDisabled = true;
    
    switch(this.slot)
    {
      case 1:
        this.selectedMainStat = this.mainStats.find(s => s.value == GEAR_STATS.ATTACK_FLAT);
        break;
      case 2:
        this.selectedMainStat = this.mainStats.find(s => s.value == GEAR_STATS.HEALTH_FLAT);
        break;
      case 3:
        this.selectedMainStat = this.mainStats.find(s => s.value == GEAR_STATS.DEFENSE_FLAT);
        break;
      default:
        this.selectedMainStat = this.mainStats.find(s => s.value == GEAR_STATS.ATTACK_FLAT);
        break;
    }
  }

  getIcon(slot: number): String {
    let ret = '';

    return ret;
  }

  isPercentage(stat): boolean {
    var flatStats = [
      GEAR_STATS.NO_STAT,
      GEAR_STATS.ATTACK_FLAT,
      GEAR_STATS.DEFENSE_FLAT,
      GEAR_STATS.HEALTH_FLAT,
      GEAR_STATS.SPEED
    ]

    return (flatStats.indexOf(stat) == -1);
  }

  onStatEntry(): void {

    this.onStatChange();
  }
  onStatChange(): void {
    let realStat: number = 0;
    let gainType: number = 0;

    realStat = this._gearGoalsService.mapGearStatToRealStat(this.selectedMainStat.value);
    if ([1, 3, 5, 7].indexOf(this.selectedMainStat.value) != -1)
      gainType = 1;
    else gainType = 2;

    let statGain:IStatGain = {
      stat: realStat,
      gain: this.statVal,
      type: gainType
    }

    this.slotUpdate.emit(statGain);
  }

}
