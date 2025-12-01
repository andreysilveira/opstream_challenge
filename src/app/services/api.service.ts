import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Schema } from '../types/schema';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  getSchemas(): Observable<Schema[]> {
    return this.http.get<Schema[]>('/api/schemas');
  }

  getSchemaById(id: string): Observable<Schema> {
    return this.http.get<Schema>(`/api/schemas/${id}`);
  }

  saveAnswer(requestId: string, questionId: number, value: any): Observable<any> {
    return this.http.put(`/api/requests/${requestId}/question/${questionId}`, { value });
  }
}
