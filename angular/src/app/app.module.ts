import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import {MatDialogModule} from '@angular/material/dialog';
import { CreateUnitComponent } from './create-unit/create-unit.component';
import {MatInputModule} from '@angular/material/input';
import { ConceptViewerComponent } from './concept-viewer/concept-viewer.component';
import { DiscardChangesDialogComponent } from './discard-changes-dialog/discard-changes-dialog.component';
import { ChooseDataFileViewComponent } from './choose-data-file-view/choose-data-file-view.component';
import { ErrorMessageViewerComponent } from './error-message-viewer/error-message-viewer.component';
import { ErrorMessageViewComponent } from './error-message-view/error-message-view.component';
import { SettingsComponent } from './settings/settings.component';
import { settingsReducer } from './ngrx-store/settings.reducer';


@NgModule({
  declarations: [AppComponent, HomeComponent, UnitsListItemComponent, CreateUnitComponent, ConceptViewerComponent, DiscardChangesDialogComponent, ChooseDataFileViewComponent, ErrorMessageViewerComponent, ErrorMessageViewComponent, SettingsComponent],
  imports: [BrowserModule, AppRoutingModule, MatSidenavModule, BrowserAnimationsModule, MatListModule, MatIconModule, MatButtonModule, MatDialogModule, MatInputModule, FormsModule, StoreModule.forRoot({units: unitsReducer, settings: settingsReducer}), StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })],
  bootstrap: [AppComponent]
})
export class AppModule {}
