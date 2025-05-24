import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserSensorsForm } from '../../models/form.model';

export const initUserSensorsForm = (): FormGroup<UserSensorsForm> => {
  return new FormGroup<UserSensorsForm>({
    sensorNumber: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^[A-Za-z0-9-]+$/),
      ],
    }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    street: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    city: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    postalCode: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\d{2}-\d{3}$/)],
    }),
  });
};
