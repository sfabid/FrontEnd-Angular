import { HttpClient, HttpParams, HttpErrorResponse} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Patient } from '../models/Patient';
const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'      
    })
};

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(private http: HttpClient) { }
  // get all patient data    
  get(url: string): Observable<Patient[]> {
      return this.http.get<Patient[]>(url).pipe(catchError(this.handleError));
  }
  // insert new patient details    
  post(url: string, patient: Patient): Observable<any> {
      return this.http.post(url, JSON.stringify(patient), httpOptions).pipe(catchError(this.handleError));
  }
  // update patient details    
  put(url: string, id: number, patient: Patient): Observable<any> {
      const newurl = `${url}?id=${id}`;
      return this.http.put(newurl, patient, httpOptions).pipe(catchError(this.handleError));
  }
  // delete patient information    
  delete(url: string, id: number): Observable<any> {
      const newurl = `${url}?id=${id}`; // DELETE api/patient?id=42    
      return this.http.delete(newurl, httpOptions).pipe(catchError(this.handleError));
  }
  // custom handler    
  private handleError(error: HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.    
          console.error('An error occurred:', error.error.message);
      } else {
          // the backend returned an unsuccessful response code.    
          // the response body may contain clues as to what went wrong,    
          console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
      }
      // return an observable with a user-facing error message    
      return throwError('Something bad happened; please try again later.');
  } 
}
