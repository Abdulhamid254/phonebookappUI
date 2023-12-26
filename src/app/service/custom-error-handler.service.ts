import { ErrorHandler, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class CustomErrorHandler  implements ErrorHandler{

  constructor(private sanackbar: MatSnackBar) { }

  handleError(error:unknown) {
    this.sanackbar.open(
      'Error Detected!',
      'Close',
      {
        duration: 2000
      }
    );
    console.warn(`Caught by custom Error Handler:`, error)
  }
}
