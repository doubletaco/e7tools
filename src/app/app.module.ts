import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GearGoalsModule } from './gear-goals/gear-goals.module';
import { SandboxComponent } from './sandbox/sandbox/sandbox.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    SandboxComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    GearGoalsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
