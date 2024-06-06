import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {DataService} from "../services/data.service";
import {FormsModule} from "@angular/forms";
import {MeteringPopupComponent} from "../metering-popup/metering-popup.component";

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
  selector: 'app-metering',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgClass,
    NgForOf,
    NgIf,
    FormsModule,
    MeteringPopupComponent
  ],
  templateUrl: './metering.component.html',
  styleUrl: './metering.component.css'
})
export class MeteringComponent implements OnInit {

  constructor(private dataService: DataService, private changeDetectorRef: ChangeDetectorRef) {}

  popUpIsActive = false;
  popUpMode = 'add';

  switchIsChecked = false;
  checkedResults = 0;

  public switchClickHandler() {
    this.switchIsChecked = !this.switchIsChecked;
  }

  data: MeteringItem[] = [];
  checkedItemsIds: Array<number> = [];

  onChangeInput(id: number) {
    if (this.checkedItemsIds.includes(id)) {
      const index = this.checkedItemsIds.indexOf(id);
      this.checkedItemsIds.splice(index, 1);
    } else {
      this.checkedItemsIds.push(id)
    }
  }

  onSelectAll() {
    if (this.checkedItemsIds.length !== this.data.length) {
      this.data.forEach((item: MeteringItem) => item.checked = true);
      this.checkedItemsIds = this.data.map((item: MeteringItem) => item.id);
    } else {
      this.data.forEach((item: MeteringItem) => item.checked = false);
      this.checkedItemsIds = [];
    }
  }

  getCurrentDataById(id: number) {
    if (!this.data) {
      return;
    }
    return this.data.find((item: MeteringItem) => item.id === id);
  }

  addNewHandler() {
    this.popUpMode = 'add';
    this.popUpIsActive = true
    this.dataService.disableItems();
    this.checkedItemsIds = [];
  }

  editHandler() {
    this.popUpMode = 'edit';
    this.popUpIsActive = true
  }

  registerDataChangeCallback() {
    this.dataService.registerDataChangeCallback((newData: MeteringItem[]) => {
      this.data = newData;
      this.changeDetectorRef.detectChanges();
    });
  }

  deleteHandler() {
    const selectedIds = this.checkedItemsIds; // Получение выбранных ID
    this.dataService.deleteItems(selectedIds);
    this.checkedItemsIds = [];
  }

  onPopUpIsActiveChange(isActive: boolean) {
    this.popUpIsActive = isActive;
    this.checkedItemsIds = [];
  }

  ngOnInit(): void {
    this.fetchData();
    this.registerDataChangeCallback();
  }

  fetchData() {
    this.dataService.getData()
      .subscribe((response: any) => {
        this.data = response.record.meterings.map((item: MeteringItem) => {
          return {
            id: item.id,
            date: item.date,
            time: item.time,
            source: item.source,
            phase: item.phase,
            kb: item.kb,
            a: item.a,
            mvt: item.mvt,
            mvar: item.mvar,
            cos: item.cos,
            checked: false
          }
        });
        console.log(this.data)
        this.dataService.setData(this.data);
      });
  }
}
