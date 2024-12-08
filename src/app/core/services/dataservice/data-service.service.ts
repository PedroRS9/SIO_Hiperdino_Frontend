import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataSubject = new BehaviorSubject<{ value1: string, value2: string } | null>(null);
  data$ = this.dataSubject.asObservable();

  sendData(data: { value1: string, value2: string }) {
    this.dataSubject.next(data);
  }
}
