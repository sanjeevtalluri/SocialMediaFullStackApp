import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusyService {

  constructor() { }
  busyRequestCount = 0;
  loadingSpinner = new BehaviorSubject<boolean>(false);
  loadingSpinner$ = this.loadingSpinner.asObservable();
  busy() {
    this.busyRequestCount++;
    this.loadingSpinner.next(true);
  }

  idle() {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.loadingSpinner.next(false);
    }
  }
}
