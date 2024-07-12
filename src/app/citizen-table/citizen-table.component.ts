import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DirectoryService } from '../shared/directory-service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Citizen } from '../shared/citizen';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-citizen-table',
  standalone: true,
  imports: [
    MatButtonModule,
    MatProgressBarModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    ReactiveFormsModule,
    MatIconModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './citizen-table.component.html',
  styleUrl: './citizen-table.component.css'
})
export class CitizenTableComponent implements AfterViewInit {

  displayedColumns: string[] = [
    "details",
    "first_name",
    "lastname",
    "phone",
    "socialscore"
  ];

  filter: FormControl = new FormControl();

  dataSource: MatTableDataSource<Citizen> = new MatTableDataSource();

  isLoading = false;

  fragment = "1";

  constructor(private snackbar: MatSnackBar, private directoryService: DirectoryService, private route: ActivatedRoute) {
    this.route.fragment.subscribe(fragment => {
      if(fragment) {
        this.fragment = fragment;
        this.loadTable();
      }
    })
  }

  ngAfterViewInit() {
      this.filter.valueChanges.subscribe(value => this.applyFilter(value));
  }

  applyFilter(event: string) {
    this.dataSource.filter = event.trim().toLowerCase();
  }

  loadTable() {
    this.isLoading = true;

    this.openSnackbar("Checking directory status...");

    this.directoryService.getStatus()
      .pipe(
        catchError(this.handleError.bind(this))
      )
      .subscribe(response => {
        this.snackbar.dismiss();

        if(response.status == "Running") {
          this.openSnackbar("Querying Citizen Data...")

          this.directoryService.getCitizens()
            .pipe(
              catchError(this.handleError.bind(this))
            )
            .subscribe(response => {
              this.isLoading = false;
              this.snackbar.dismiss();
              this.dataSource.data = response;
            });
        }
      });
  }

  openSnackbar(message: string) {
    this.snackbar.open(message, 'Close', {
      duration: 5000,
    });
  }

  private handleError(error: HttpErrorResponse) {
    this.isLoading = false;
    return throwError(() => new Error("Unknown error"));
  }

  tableFinishedLoading() {
    setTimeout(() => {
      document.getElementById(this.fragment)?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }

  isActive(index: number) {
    return this.fragment == (index + 1).toString();
  }
}
