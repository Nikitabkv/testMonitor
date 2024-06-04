import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {DataService} from "../services/data.service";
import {NgIf} from "@angular/common";

interface MeteringData {
  dateTime: string;
  deviceType: string;
  deviceName: string;
  value1: number;
  value2: number;
  value3: number;
  value4: number;
  value5: number;
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
  @Input() data?: any;
  @Input() id?: any;

  @Output() popUpIsActiveChange = new EventEmitter<boolean>();

  monitorFormGroup: FormGroup;

  constructor(private dataService: DataService, private changeDetectorRef: ChangeDetectorRef) {
    this.monitorFormGroup = new FormGroup({
      id: new FormControl(new Date().getTime()),
      date: new FormControl(new Date().toISOString().split('T')[0]),
      time: new FormControl(),
      source: new FormControl(''),
      phase: new FormControl(''),
      kb: new FormControl(),
      a: new FormControl(),
      mvt: new FormControl(),
      mvar: new FormControl(),
      cos: new FormControl(),
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
          phase: new FormControl(this.data.phase),
          kb: new FormControl(this.data.kb),
          a: new FormControl(this.data.a),
          mvt: new FormControl(this.data.mvt),
          mvar: new FormControl(this.data.mvar),
          cos: new FormControl(this.data.cos),
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
      this.dataService.editItem(this.monitorFormGroup.value);
    } else {
      this.dataService.addData(this.monitorFormGroup.value);
    }
    this.popUpIsActive = false;
    this.popUpIsActiveChange.emit(this.popUpIsActive);
    this.dataService.disableItems();
    this.resetForm();
  }

  resetForm() {
    this.monitorFormGroup.reset({
      id: new Date().getTime()
    });
  }
}
