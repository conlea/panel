import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { PleceService } from '../plece.service';
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-places-list',
  templateUrl: './places-list.component.html',
  styleUrls: ['./places-list.component.scss']
})
export class PlacesListComponent implements OnInit {
  searchPlace = "";
  displayedColumns: string[] = ['namePL', 'nameEN', 'country', 'remote'];
  dataSource: MatTableDataSource<any>;
  placeLoading: boolean = true;

  @ViewChild('paginatorListPlaces') paginatorListPlaces: MatPaginator;
  @ViewChild(MatSort) sortListPlaces: MatSort;

  constructor(private placeService: PleceService, private toastr: ToastrService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.placeLoading = true;
    this.placeService.placeList().subscribe(resp => {
      this.placeLoading = false;
      this.changeDetector.detectChanges();
      this.dataSource = new MatTableDataSource(resp);
      this.dataSource.paginator = this.paginatorListPlaces;
      this.dataSource.sort = this.sortListPlaces;
    }, err => {
      console.error(err);
      this.placeLoading = false;
      this.toastr.error('Nie udało się pobrać listy miejsc', 'Błąd');
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
