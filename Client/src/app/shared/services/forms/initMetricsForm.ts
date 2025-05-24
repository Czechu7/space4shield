import { FormGroup, FormControl } from '@angular/forms';
import { MetricsForm } from '../../models/form.model';

export const initMetricsForm = (): FormGroup<MetricsForm> => {
  return new FormGroup<MetricsForm>({
    temperature: new FormControl(true, { nonNullable: true }),
    humidity: new FormControl(false, { nonNullable: true }),
    airPressure: new FormControl(false, { nonNullable: true }),
    pM1_0: new FormControl(false, { nonNullable: true }),
    pM2_5: new FormControl(false, { nonNullable: true }),
    pM10: new FormControl(false, { nonNullable: true }),
    waterLevel: new FormControl(false, { nonNullable: true }),
    precipitation: new FormControl(false, { nonNullable: true }),
    uvRadiation: new FormControl(false, { nonNullable: true }),
  });
};
