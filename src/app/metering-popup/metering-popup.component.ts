import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
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

  constructor(private dataService: DataService, private changeDetectorRef: ChangeDetectorRef) {
    this.currentDateTime = new Date();
    this.currentDateTime.setHours(this.currentDateTime.getHours() + 3);
    this.monitorFormGroup = new FormGroup({
      id: new FormControl(this.currentDateTime.getTime()),
      date: new FormControl(this.currentDateTime.toISOString().split('T')[0]),
      time: new FormControl(this.currentDateTime.toISOString().slice(11, 19)),
      source: new FormControl('', [Validators.required]),
      phase: new FormControl('', [Validators.required]),
      kb: new FormControl(''),
      a: new FormControl(''),
      mvt: new FormControl(''),
      mvar: new FormControl('' ),
      cos: new FormControl(''),
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
        this.monitorFormGroup.reset({
            id: this.data.id,
            date: this.formatDate(this.data.date),
            time: this.data.time,
            source: this.data.source,
            phase: this.data.phase,
            kb: this.data.kb,
            a: this.data.a,
            mvt: this.data.mvt,
            mvar: this.data.mvar,
            cos: this.data.cos
        })
        this.monitorFormGroup.get('phase')?.disable();
        this.monitorFormGroup.get('kb')?.disable();
        this.monitorFormGroup.get('a')?.disable();
        this.monitorFormGroup.get('mvt')?.disable();
        this.monitorFormGroup.get('mvar')?.disable();
        this.monitorFormGroup.get('cos')?.disable();
      }
    }
  }

  numberInputsChangeHandler(evt: any, formControlName: string) {
    if (isNaN(evt.target.value)) {
      this.monitorFormGroup.get(formControlName)?.setValue(evt.target.value.slice(0, -1));
    }
  }

  onSave() {
    if (this.monitorFormGroup.invalid) {
      alert('Пожалуйста заполните все поля')
      return;
    }
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

  closeHandler() {
    this.popUpIsActive = false;
    this.popUpIsActiveChange.emit(this.popUpIsActive);
    this.dataService.disableItems();
    this.resetForm();
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
    this.closeHandler();
  }

  resetForm() {
    this.currentDateTime = new Date();
    this.currentDateTime.setHours(this.currentDateTime.getHours() + 3);
    this.monitorFormGroup.reset({
      id: this.currentDateTime.getTime(),
      date: this.currentDateTime.toISOString().split('T')[0],
      time: this.currentDateTime.toISOString().slice(11, 19),
      source: '',
      phase: '',
      kb: '',
      a: '',
      mvt: '',
      mvar: '',
      cos: '',
    });
    this.monitorFormGroup.get('phase')?.enable();
    this.monitorFormGroup.get('kb')?.enable();
    this.monitorFormGroup.get('a')?.enable();
    this.monitorFormGroup.get('mvt')?.enable();
    this.monitorFormGroup.get('mvar')?.enable();
    this.monitorFormGroup.get('cos')?.enable();
  }
}
