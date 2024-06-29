import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DirectoryStatus } from './directory-status';

@Injectable({
  providedIn: 'root'
})
export class DirectoryService {
    constructor(private http: HttpClient, private snackbar: MatSnackBar) {}

    getStatus() {
        return this.http.get<DirectoryStatus>("http://localhost:3000/status").pipe(
            catchError(this.handleError.bind(this))
        );
    }

    getCitizens() {
        return this.http.get<any[]>("http://localhost:3000/citizen").pipe(
            catchError(this.handleError.bind(this))
        );
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';

        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred.
            errorMessage = `There has been an error on your state issued machine, you will be fined appropiately for a replacement. Error: ${error.error.message}`;
        }
        else {
            // The backend returned an unsuccessful response code.
            errorMessage = `The Citizen Database has encounted a problem. Error: ${error.status} ${error.message}`;
        }

        this.snackbar.open(errorMessage, 'Close', {
            duration: 5000,
        });

        return throwError(() => new Error(errorMessage));
    }
}
