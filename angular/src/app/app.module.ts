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

@NgModule({
  declarations: [AppComponent, HomeComponent, UnitsListItemComponent],
  imports: [BrowserModule, AppRoutingModule, MatSidenavModule, BrowserAnimationsModule, MatListModule, MatIconModule, MatButtonModule, StoreModule.forRoot({units: unitsReducer})],
  bootstrap: [AppComponent]
})
export class AppModule {}
