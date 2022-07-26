import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

// 2022.06.28 - 17:41:56 - created
/**
 * This service enables any component in the application to display alert msgs at
 * the top of the page via the alert component.
 */
@Injectable()
export class AlertService {

  // a subject is a special type of observer that allows its values to be multicasted to many Observers
  // Observers are unicast (each observer owns an independent execution of the Observer)
  private _subject = new Subject<any>();
  private _keepAfterNavigationChange = false;

  constructor(private _router: Router) {
    // clear alert msg on route change
    this._router.events.subscribe(evt => {
      if (evt instanceof NavigationStart) {
        if (this._keepAfterNavigationChange) {
          // only keep for a single location change
          this._keepAfterNavigationChange = false;
        } else {
          // clear alert
          this._subject.next(null);
        }
      }
    });
  }

  success(msg: string, keepAfterNavigationChange = false) {
    this._keepAfterNavigationChange = keepAfterNavigationChange;
    this._subject.next({ type: 'success', text: msg });
  }

  error(msg: string, keepAfterNavigationChange = false) {
    this._keepAfterNavigationChange = keepAfterNavigationChange;
    this._subject.next({ type: 'error', text: msg });
  }
  getMessage(): Observable<any> {
    return this._subject.asObservable();
  }
}
