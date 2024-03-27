import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MethodService } from '../method.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-methods-list',
  templateUrl: './methods-list.component.html',
  styleUrls: ['./methods-list.component.scss']
})
export class MethodsListComponent implements OnInit {
  searchPlace = "";
  displayedColumns: string[] = ['namePL', 'nameEN'];
  dataSource: MatTableDataSource<any>;
  methodLoading: boolean = true;

  @ViewChild('paginatorListMethod') paginatorListMethod: MatPaginator;
  @ViewChild(MatSort) sortListPlaces: MatSort;

  constructor(private methodService: MethodService, private changeDetector: ChangeDetectorRef, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.methodLoading = true;
    this.methodService.methodList().subscribe(resp => {
      this.methodLoading = false;
      this.changeDetector.detectChanges();
      this.dataSource = new MatTableDataSource(resp);
      this.dataSource.paginator = this.paginatorListMethod;
      this.dataSource.sort = this.sortListPlaces;
    }, err => {
      console.error(err);
      this.methodLoading = false;
      this.toastr.error('Nie udało się pobrać listy metod szkoleń', 'Błąd');
    });

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
