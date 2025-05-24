import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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
import { UserSensorsService } from '../../../core/_services/user-sensors/user-sensors.service';
import {
  PaginationService,
  PaginationState,
} from '../../../core/_services/pagination/pagination.service';
import { Subscription } from 'rxjs';
import { INewSensorRequest, IUserSensor } from '../../../core/_models/sensor.model';
import { MapComponent } from '../../../shared/components/map/map.component';
import { MapMarkerComponent } from '../../../shared/components/map/map-marker.component';
import { MapOptions, MarkerOptions } from '../../../shared/models/leaflet.model';

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
    MapComponent,
    MapMarkerComponent,
  ],
  templateUrl: './user-sensors.component.html',
  styleUrl: './user-sensors.component.scss',
})
export class UserSensorsComponent implements OnInit, OnDestroy {
  sensors: IUserSensor[] = [];
  showForm = false;
  isLoading = false;
  userSensorsForm!: FormGroup<UserSensorsForm>;
  sensorType = SensorType;

  paginationState: PaginationState | null = null;
  private paginationSubscription!: Subscription;

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
  private userSensorsService = inject(UserSensorsService);
  private paginationService = inject(PaginationService);

  ngOnInit() {
    this.fetchSensors();
    this.userSensorsForm = this.formService.getUserSensorsForm();
  }

  ngOnDestroy() {
    if (this.paginationSubscription) {
      this.paginationSubscription.unsubscribe();
    }
  }

  fetchSensors() {
    this.isLoading = true;
    this.userSensorsService.getUserSensors().subscribe({
      next: response => {
        console.log('Pobrane czujniki:', response.data);

        this.sensors = response.data.items.map(sensor => this.prepareSensorForDisplay(sensor));

        console.log('Czujniki po przetworzeniu:', this.sensors);
      },
      error: error => {
        this.toastService.showError(
          this.translateService.instant('USER.SENSORS.ERROR_TITLE'),
          this.errorService.getErrorMessage(error),
        );
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  prepareSensorForDisplay(sensor: IUserSensor): IUserSensor {
    return {
      ...sensor,
      name: sensor.description || `Czujnik ${sensor.serialNumber}`,
      type: this.determineSensorType(sensor),
      value: sensor.temperature || 0,
      unit: '°C',
      location: `${sensor.street}, ${sensor.city}`,
      lastUpdated: new Date(sensor.lastMeasurement || sensor.createdAt),
    };
  }

  determineSensorType(sensor: IUserSensor): SensorType {
    if (sensor.pM2_5 || sensor.pM10) return SensorType.PM25;
    if (sensor.humidity !== undefined && sensor.humidity > 0) return SensorType.Humidity;
    if (sensor.waterLevel) return SensorType.Other;
    return SensorType.Temperature;
  }

  showAddSensorForm() {
    this.showForm = true;
  }

  cancelAddSensor() {
    this.showForm = false;
    this.userSensorsForm.reset();
  }

  addSensor() {
    console.log('Dodawanie czujnika:', this.userSensorsForm.value);

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

    const formValue = this.userSensorsForm.value;
    if (
      !formValue.sensorNumber ||
      !formValue.street ||
      !formValue.city ||
      !formValue.postalCode ||
      !formValue.name
    )
      return;
    const sendData: INewSensorRequest = {
      serialNumber: formValue.sensorNumber,
      street: formValue.street,
      city: formValue.city,
      postalCode: formValue.postalCode,
      description: formValue.name,
    };
    this.userSensorsService.addSensor(sendData).subscribe({
      next: _ => {
        this.isLoading = true;
        this.toastService.showSuccess(
          this.translateService.instant('USER.SENSORS.SUCCESS_TITLE'),
          this.translateService.instant('USER.SENSORS.ADDED_SUCCESS', { name: formValue.name }),
        );
      },
      error: error => {
        this.toastService.showError(
          this.translateService.instant('USER.SENSORS.ERROR_TITLE'),
          this.errorService.getErrorMessage(error),
        );
      },
      complete: () => {
        this.isLoading = false;
        this.showForm = false;
        this.userSensorsForm.reset();
        this.fetchSensors();
        this.toastService.showSuccess(
          this.translateService.instant('USER.SENSORS.SUCCESS_TITLE'),
          this.translateService.instant('USER.SENSORS.ADDED_SUCCESS', { name: formValue.name }),
        );
      },
    });
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

    this.userSensorsService.deleteSensor(id).subscribe({
      next: _ => {
        this.toastService.showSuccess(
          this.translateService.instant('USER.SENSORS.SUCCESS_TITLE'),
          this.translateService.instant('USER.SENSORS.DELETED_SUCCESS', {
            name: sensorToDelete.name,
          }),
        );
        this.fetchSensors();
      },
      error: error => {
        this.toastService.showError(
          this.translateService.instant('USER.SENSORS.ERROR_TITLE'),
          this.errorService.getErrorMessage(error),
        );
        this.sensors.push(sensorToDelete);
      },
      complete: () => {
        this.isLoading = false;
        this.showForm = false;
        this.userSensorsForm.reset();
      },
    });
  }

  getSensorIcon(type: SensorType | undefined): string {
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
    if (!status) return '';

    switch (status.toLowerCase()) {
      case 'active':
        return 'text-green-500';
      case 'inactive':
        return 'text-gray-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
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

  showDetailsMap: Record<string, boolean> = {};

  toggleDetails(sensorId: string) {
    this.showDetailsMap[sensorId] = !this.showDetailsMap[sensorId];
  }

  hasAnyReadings(sensor: IUserSensor): boolean {
    return (
      sensor.temperature !== undefined ||
      sensor.humidity !== undefined ||
      sensor.airPressure !== undefined ||
      sensor.pM1_0 !== undefined ||
      sensor.pM2_5 !== undefined ||
      sensor.pM10 !== undefined ||
      sensor.waterLevel !== undefined ||
      sensor.precipitation !== undefined ||
      sensor.uvRadiation !== undefined
    );
  }

  getSensorMapOptions(sensor: IUserSensor): MapOptions {
    if (!sensor.latitude || !sensor.longitude) {
      return {
        center: [52.237049, 21.017532],
        zoom: 10,
        zoomControl: false,
      };
    }

    return {
      center: [sensor.latitude - 0.0005, sensor.longitude],
      zoom: 14,
      zoomControl: false,
    };
  }

  getSensorMarkerOptions(sensor: IUserSensor): MarkerOptions | null {
    if (!sensor.latitude || !sensor.longitude) {
      return null;
    }

    return {
      position: [sensor.latitude, sensor.longitude],
      title: sensor.name || sensor.serialNumber,
      draggable: false,
    };
  }
}
