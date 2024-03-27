import { NgModule } from "@angular/core";

import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatTabsModule } from "@angular/material/tabs";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatListModule } from "@angular/material/list";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatMenuModule } from "@angular/material/menu";
import { MatDialogModule } from "@angular/material/dialog";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTreeModule } from "@angular/material/tree";
import { MatNativeDateModule } from "@angular/material/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MatRadioModule } from "@angular/material/radio";
import { MatFormFieldModule } from "@angular/material/form-field";
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from "@angular/material/bottom-sheet";
// import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

@NgModule({
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSidenavModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatListModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatTreeModule,
    MatNativeDateModule,
    FontAwesomeModule,
    MatBottomSheetModule,
    MatRadioModule,
    // MatTreeFlattener,
  ],
  exports: [
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSidenavModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatSelectModule,
    MatTooltipModule,
    MatListModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatTreeModule,
    MatRadioModule,
    // MatTreeFlattener,
  ],
})
export class MaterialModule {}
