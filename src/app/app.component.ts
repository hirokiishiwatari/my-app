import { Component, OnInit } from '@angular/core';
import {
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as yup from 'yup';

const userSchema = yup.object().shape({
  firstName: yup.string().required().trim(),
  lastName: yup.string().required().trim(),
});

const asyncValidator =
  (): AsyncValidatorFn =>
  (form): Observable<ValidationErrors | null> => {
    return from(userSchema.validate(form.value, { abortEarly: false })).pipe(
      map((_) => null),
      catchError((err: yup.ValidationError) => {
        return of(
          err.inner.reduce((acc, cur) => {
            const { path, type, message } = cur;

            acc[path!] = { [type!]: message };

            return acc;
          }, {} as ValidationErrors)
        );
      })
    );
  };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'myApp4';

  readonly form = new FormGroup(
    {
      firstName: new FormControl(''),
      lastName: new FormControl(''),
    },
    {
      asyncValidators: [asyncValidator()],
    }
  );

  ngOnInit() {
    this.form
      .get('firstName')
      ?.statusChanges.subscribe((s) => console.log({ s }));
  }

  get firstName() {
    return this.form.get('firstName');
  }

  get lastName() {
    return this.form.get('lastName');
  }
}
