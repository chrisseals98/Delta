import { HttpClient, HttpErrorResponse, HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DirectoryStatus } from '../shared/directory-status';
import { DirectoryService } from '../shared/directory-service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-citizen-table',
  standalone: true,
  imports: [MatButtonModule, MatProgressBarModule],
  templateUrl: './citizen-table.component.html',
  styleUrl: './citizen-table.component.css'
})
export class CitizenTableComponent {

  isLoading = false;

  _citizens: any[] = [];

  get citizens(): any[] {
    return this._citizens;
  }

  set citizens(citizens: any[]) {
    this._citizens = citizens;
  }

  constructor(private snackbar: MatSnackBar, private directoryService: DirectoryService) {}

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
              this.citizens = response;
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
}
