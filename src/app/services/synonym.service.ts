import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Визначаємо структуру елемента відповіді API
interface DatamuseResponseItem {
  word: string;
  score: number;
  }

@Injectable({
  providedIn: 'root'
})
  
export class SynonymService {
  private datamuseUrl = 'https://api.datamuse.com/words';

  constructor(private http: HttpClient) { }

  /* Отримує синоніми для заданої фрази/слова. */
  getSynonyms(phrase: string): Observable<DatamuseResponseItem[]> {
    // API Datamuse: 'ml' (means like) використовується для синонімів/схожих слів.
    const params = {
      ml: phrase,
      syn: phrase,
      max: '5' // Обмежити результат до 5
    };
    
    // API автоматично обробляє пробіли/фрази для 'ml'
    return this.http.get<DatamuseResponseItem[]>(this.datamuseUrl, { params });
  }
  
}
