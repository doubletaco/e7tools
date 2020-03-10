import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GearGoalsComponent } from './components/gear-goals/gear-goals.component';

import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms';
import { GearSlotComponent } from './components/gear-slot/gear-slot.component'


@NgModule({
  declarations: [GearGoalsComponent, GearSlotComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    GearGoalsComponent
  ]
})
export class GearGoalsModule { }
