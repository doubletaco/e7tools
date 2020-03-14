import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GearGoalsComponent } from './components/gear-goals/gear-goals.component';

import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms';
import { GearSlotComponent } from './components/gear-slot/gear-slot.component';
import { HeroSearchItemComponent } from './components/hero-search-item/hero-search-item.component';
import { E7ToolsCommonModule } from '../e7-tools-common/e7-tools-common.module';
import { ClickAwayDirective } from '../common/directives/click-away.directive';


@NgModule({
  declarations: [GearGoalsComponent, GearSlotComponent, HeroSearchItemComponent, ClickAwayDirective],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    E7ToolsCommonModule
  ],
  exports: [
    GearGoalsComponent
  ]
})
export class GearGoalsModule { }
