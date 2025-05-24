import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { TooltipModule } from 'primeng/tooltip';
import { ToastService } from '../../../shared/services/toast.service';
import { ErrorService } from '../../../shared/services/error.service';
import { SensorType } from '../../../enums/sensor-type.enum';
import { UserSensorsForm } from '../../../shared/models/form.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { FormService } from '../../../shared/services/form.service';

interface Sensor {
  id: string;
  serialNumber: string;
  name: string;
  type: SensorType;
  value: number;
  unit: string;
  status: string;
  location: string;
  description?: string;
  lastUpdate: Date;

  street?: string;
  city?: string;
  postalCode?: string;

  latitude?: number;
  longitude?: number;

  humidity?: number;
  airPressure?: number;
  pm1_0?: number;
  pm2_5?: number;
  pm10?: number;
  waterLevel?: number;
  precipitation?: number;
  uvRadiation?: number;
  lastMeasurement?: Date;
}

@Component({
  selector: 'app-user-sensors',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonComponent,
    InputComponent,
    TooltipModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './user-sensors.component.html',
  styleUrl: './user-sensors.component.scss',
})
export class UserSensorsComponent implements OnInit {
  sensors: Sensor[] = [];
  showForm = false;
  isLoading = false;
  userSensorsForm!: FormGroup<UserSensorsForm>;
  sensorType = SensorType;

  sensorUnitMap = {
    [SensorType.Temperature]: '°C',
    [SensorType.Humidity]: '%',
    [SensorType.PM25]: 'μg/m³',
    [SensorType.PM10]: 'μg/m³',
    [SensorType.CO2]: 'ppm',
    [SensorType.Pressure]: 'hPa',
    [SensorType.Noise]: 'dB',
    [SensorType.Light]: 'lux',
    [SensorType.Other]: '-',
  };

  private errorService = inject(ErrorService);
  private toastService = inject(ToastService);
  private translateService = inject(TranslateService);
  private formService = inject(FormService);

  ngOnInit() {
    this.loadSensors();
    this.userSensorsForm = this.formService.getUserSensorsForm();
  }

  initForm() {}

  loadSensors() {
    this.isLoading = true;

    setTimeout(() => {
      this.sensors = [
        {
          id: '1',
          serialNumber: 'TEMP-12345',
          name: 'Czujnik temperatury',
          type: SensorType.Temperature,
          value: 22.5,
          unit: '°C',
          status: 'Aktywny',
          location: 'Salon',
          lastUpdate: new Date(),
        },
        {
          id: '2',
          serialNumber: 'HUM-54321',
          name: 'Czujnik wilgotności',
          type: SensorType.Humidity,
          value: 45,
          unit: '%',
          status: 'Aktywny',
          location: 'Łazienka',
          lastUpdate: new Date(),
        },
        {
          id: '3',
          serialNumber: 'PM-98765',
          name: 'Czujnik PM2.5',
          type: SensorType.PM25,
          value: 15.2,
          unit: 'μg/m³',
          status: 'Ostrzeżenie',
          location: 'Zewnętrzny',
          lastUpdate: new Date(),
        },
      ];
      this.isLoading = false;
    }, 500);
  }

  showAddSensorForm() {
    this.showForm = true;
    this.initForm();
  }

  cancelAddSensor() {
    this.showForm = false;
    this.userSensorsForm.reset();
  }

  addSensor() {
    if (this.userSensorsForm.invalid || this.isLoading) {
      Object.keys(this.userSensorsForm.controls).forEach(key => {
        this.userSensorsForm.get(key)?.markAsTouched();
      });
      return;
    }

    const serialNumber = this.userSensorsForm.value.sensorNumber;

    if (!serialNumber) {
      this.toastService.showError(
        this.translateService.instant('USER.SENSORS.ERROR_TITLE'),
        this.translateService.instant('USER.SENSORS.MISSING_SERIAL'),
      );
      return;
    }

    if (this.sensors.some(sensor => sensor.serialNumber === serialNumber)) {
      this.toastService.showError(
        this.translateService.instant('USER.SENSORS.ERROR_TITLE'),
        this.translateService.instant('USER.SENSORS.DUPLICATE_SERIAL'),
      );
      return;
    }

    this.isLoading = true;
  }

  editSensor(id: string) {
    const sensor = this.sensors.find(s => s.id === id);
    if (sensor) {
      this.toastService.showInfo(
        this.translateService.instant('USER.SENSORS.INFO_TITLE'),
        this.translateService.instant('USER.SENSORS.EDIT_NOT_IMPLEMENTED'),
      );
      console.log('Edycja czujnika:', sensor);
    }
  }

  deleteSensor(id: string) {
    const sensorToDelete = this.sensors.find(s => s.id === id);
    if (!sensorToDelete) return;

    this.sensors = this.sensors.filter(sensor => sensor.id !== id);

    this.toastService.showSuccess(
      this.translateService.instant('USER.SENSORS.SUCCESS_TITLE'),
      this.translateService.instant('USER.SENSORS.DELETED_SUCCESS', { name: sensorToDelete.name }),
    );
  }

  getSensorIcon(type: SensorType): string {
    switch (type) {
      case SensorType.Temperature:
        return 'pi pi-thermometer text-red-500';
      case SensorType.Humidity:
        return 'pi pi-tint text-blue-500';
      case SensorType.PM25:
      case SensorType.PM10:
        return 'pi pi-cloud text-gray-500';
      case SensorType.CO2:
        return 'pi pi-exclamation-circle text-yellow-500';
      case SensorType.Pressure:
        return 'pi pi-chart-bar text-purple-500';
      case SensorType.Noise:
        return 'pi pi-volume-up text-orange-500';
      case SensorType.Light:
        return 'pi pi-sun text-yellow-300';
      default:
        return 'pi pi-cog';
    }
  }

  getSensorStatusClass(status: string): string {
    switch (status) {
      case 'Aktywny':
        return 'text-green-500';
      case 'Nieaktywny':
        return 'text-gray-500';
      case 'Ostrzeżenie':
        return 'text-yellow-500';
      case 'Błąd':
        return 'text-red-500';
      default:
        return '';
    }
  }

  getErrorMessage(control: AbstractControl | null): string {
    if (!control || !control.touched) {
      return '';
    }

    return this.errorService.getErrorMessage(control as FormControl);
  }

  isInvalid(control: AbstractControl | null): boolean {
    if (!control) {
      return false;
    }

    return control.invalid && control.touched;
  }

  get controls() {
    return this.userSensorsForm.controls;
  }

  showDetailsMap: { [key: string]: boolean } = {};

  toggleDetails(sensorId: string) {
    this.showDetailsMap[sensorId] = !this.showDetailsMap[sensorId];
  }
}
