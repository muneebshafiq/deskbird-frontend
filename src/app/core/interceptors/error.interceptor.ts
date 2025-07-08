import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        router.navigate(['/login']);
        messageService.add({
          severity: 'error',
          summary: 'Unauthorized',
          detail: 'Please login again'
        });
      } else if (error.status >= 400) {
        messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message || 'An error occurred'
        });
      }
      return throwError(() => error);
    })
  );
};