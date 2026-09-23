import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
export let api = '';
// Legacy enrichment integrations are disabled for the public catalog preview.
@Injectable()
export class API {
  nutritionix(name: string): Observable<any[]> { return of([]); }
  upcitemdb(type: string, search: string): Observable<any[]> { return of([]); }
  edamam(query: string): Observable<any[]> { return of([]); }
}
