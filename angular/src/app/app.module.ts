import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import { HomeComponent } from './home/home.component';
import {MatButtonModule} from '@angular/material/button';
import { UnitsListItemComponent } from './units-list-item/units-list-item.component';
import { StoreModule } from '@ngrx/store';
import { unitsReducer } from './ngrx-store/unit.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AppDataEffects } from './ngrx-store/app-data-effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent, HomeComponent, UnitsListItemComponent],
  imports: [BrowserModule, AppRoutingModule, MatSidenavModule, BrowserAnimationsModule, MatListModule, MatIconModule, MatButtonModule, StoreModule.forRoot({units: unitsReducer}), EffectsModule.forRoot([AppDataEffects]), StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })],
  bootstrap: [AppComponent]
})
export class AppModule {}
