import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {DataService} from "../services/data.service";
import {NgIf} from "@angular/common";

interface MeteringItem {
  id: number;
  date: string;
  time: string;
  source: string;
  phase: string;
  kb: string;
  a: string;
  mvt: string;
  mvar: string;
  cos: string;
  checked: boolean;
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
export class MeteringPopupComponent implements OnChanges {
  @Input() popUpIsActive!: boolean;
  @Input() mode!: string;
  @Input() data?: MeteringItem;
  @Input() id?: number;

  @Output() popUpIsActiveChange = new EventEmitter<boolean>();

  currentDateTime: Date;
  monitorFormGroup: FormGroup;

  getRandomNumber(min: number, max: number, length: number) {
    return (Math.random() * (max - min) + min).toFixed(length)
  }

  constructor(private dataService: DataService, private changeDetectorRef: ChangeDetectorRef) {
    this.currentDateTime = new Date();
    this.currentDateTime.setHours(this.currentDateTime.getHours() + 3);
    this.monitorFormGroup = new FormGroup({
      id: new FormControl(this.currentDateTime.getTime()),
      date: new FormControl(this.currentDateTime.toISOString().split('T')[0]),
      time: new FormControl(this.currentDateTime.toISOString().slice(11, 19)),
      source: new FormControl(''),
      phase: new FormControl({value: 'a', disabled: true}),
      kb: new FormControl({ value: this.getRandomNumber(1, 1.6, 1), disabled: true}),
      a: new FormControl({ value: this.getRandomNumber(0.4, 0.8, 1), disabled: true}),
      mvt: new FormControl({ value: this.getRandomNumber(2, 3, 3), disabled: true}),
      mvar: new FormControl({ value: this.getRandomNumber(0.7, 1, 2), disabled: true}),
      cos: new FormControl({ value: this.getRandomNumber(0.5, 0.8, 2), disabled: true}),
    });
  }

  formatDate(originalDate: string) {
    const [day, month, year] = originalDate.split(".");
    const correctDate = new Date(`${+year}-${+month}-${+day}`);
    correctDate.setHours(3, 3, 3, 3);
    return correctDate.toISOString().split('T')[0]
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] || changes['mode'] || changes['id']) {
      if (this.mode === 'edit' && this.data) {
        this.monitorFormGroup = new FormGroup({
          id: new FormControl(this.data.id),
          date: new FormControl(this.formatDate(this.data.date)),
          time: new FormControl(this.data.time),
          source: new FormControl(this.data.source),
          phase: new FormControl({value: this.data.phase, disabled: true}),
          kb: new FormControl({value: this.data.kb, disabled: true}),
          a: new FormControl({value: this.data.a, disabled: true}),
          mvt: new FormControl({value: this.data.mvt, disabled: true}),
          mvar: new FormControl({value: this.data.mvar, disabled: true}),
          cos: new FormControl({value: this.data.cos, disabled: true}),
        });
      }
    }
  }

  closeHandler() {
    this.popUpIsActive = false;
    this.popUpIsActiveChange.emit(this.popUpIsActive);
    this.dataService.disableItems();
    this.resetForm();
  }

  onSave() {
    if (this.mode === 'edit') {
      this.monitorFormGroup.value.id = this.id;
      this.dataService.editItem(this.monitorFormGroup.getRawValue());
    } else {
      this.dataService.addData(this.monitorFormGroup.getRawValue());
    }
    this.popUpIsActive = false;
    this.popUpIsActiveChange.emit(this.popUpIsActive);
    this.dataService.disableItems();
    this.resetForm();
  }

  resetForm() {
    this.currentDateTime = new Date();
    this.currentDateTime.setHours(this.currentDateTime.getHours() + 3);
    this.monitorFormGroup.reset({
      id: this.currentDateTime.getTime(),
      date: this.currentDateTime.toISOString().split('T')[0],
      time: this.currentDateTime.toISOString().slice(11, 19),
      source: '',
      phase: 'a',
      kb: this.getRandomNumber(1, 1.6, 1),
      a: this.getRandomNumber(0.4, 0.8, 1),
      mvt: this.getRandomNumber(2, 3, 3),
      mvar: this.getRandomNumber(0.7, 1, 2),
      cos: this.getRandomNumber(0.5, 0.8, 2),
    });
  }
}
