import {Component, Input, Output, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NgIf} from "@angular/common";
import {HttpClient} from "@angular/common/http";

interface MeteringData {
  dateTime: string;
  deviceType: string;
  deviceName: string;
  value1: number;
  value2: number;
  value3: number;
  value4: number;
  value5: number;
}

@Component({
  selector: 'app-metering-popup',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './metering-popup.component.html',
  styleUrl: './metering-popup.component.css'
})
export class MeteringPopupComponent{
  @Input() isActive: boolean = true;

  monitorFormGroup: FormGroup;

  constructor(private http: HttpClient) {
    this.monitorFormGroup = new FormGroup({
      dateTime: new FormControl(),
      deviceType: new FormControl(''),
      deviceName: new FormControl(''),
      value1: new FormControl(0),
      value2: new FormControl(0),
      value3: new FormControl(0),
      value4: new FormControl(0),
      value5: new FormControl(0)
    });
  }

  onSave() {
    console.log(this.monitorFormGroup ? this.monitorFormGroup.value : 'пока пусто');

    const data: MeteringData = this.monitorFormGroup.value;

    this.http.put('https://angdev.ru/angular', data)
      .subscribe(response => {
        console.log('Данные успешно отправлены на сервер:', response);
      }, error => {
        console.error('Ошибка при отправке данных:', error);
      });
  }
}
