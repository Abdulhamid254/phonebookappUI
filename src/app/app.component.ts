import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ContactService } from './service/contact.service';
import { AppState } from './interfaces/app-state';
import { Observable, catchError, map, of, startWith } from 'rxjs';
import { CustomResponse } from './interfaces/custom-response';
import { DataState } from './enum/data-state-enum';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  appState$: Observable<AppState<CustomResponse>> | undefined;

  constructor( private contactService: ContactService){}


  ngOnInit(): void {
    this.appState$ = this.contactService.contacts$.pipe(
      map(response => {
        return { dataState: DataState.LOADED_STATE, appData: response}
      }),
      startWith({ dataState: DataState.LOADING_STATE}),
      catchError((error: string) => {
        return of({
           dataState: DataState.ERROR_STATE, error: error
        })
      })
    )
  }
}
