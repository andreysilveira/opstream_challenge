import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  getSchemas(): Observable<any[]> {
    return this.http.get<any[]>('/api/schemas');
  }

  getSchemaById(id: string): Observable<any> {
    return this.http.get<any>(`/api/schemas/${id}`);
  }

  saveAnswer(requestId: string, questionId: number, value: any): Observable<any> {
    return this.http.put(`/api/requests/${requestId}/question/${questionId}`, { value });
  }
}
