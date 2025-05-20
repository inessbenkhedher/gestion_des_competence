import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusShareService {
 private statusCountsSource = new BehaviorSubject<{ rouge: number, orange: number, vert: number }>({
    rouge: 0,
    orange: 0,
    vert: 0
  });

  statusCounts$ = this.statusCountsSource.asObservable();

  updateStatusCounts(counts: { rouge: number, orange: number, vert: number }) {
    this.statusCountsSource.next(counts);
  }
}
