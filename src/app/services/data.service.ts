import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  data: MeteringItem[] = [];

  formatDate(originalDate: string) {
    const [year, month, day] = originalDate.split("-");
    return `${day}.${month}.${year}`;
  }

  getData() {
    return this.http.get('https://api.jsonbin.io/v3/b/66602f8ee41b4d34e4fec79d');
  }

  setData(data: MeteringItem[]) {
    this.data = data;
  }

  addData(data: MeteringItem) {
    data.date = this.formatDate(data.date);
    data.checked = false;
    this.data.unshift(data);
  }

  editItem(item: MeteringItem) {
    item.date = this.formatDate(item.date);
    const index = this.data.findIndex((data: MeteringItem) => data.id === item.id);
    item.checked = false;
    this.data[index] = item;
  }

  deleteItems(ids: Array<number>) {
    this.data = this.data.filter((item: MeteringItem) => !ids.includes(item.id));
    if (this.dataChangeCallback) {
      this.dataChangeCallback(this.data);
    }
  }

  disableItems() {
    this.data.forEach((item: MeteringItem) => item.checked = false);
    if (this.dataChangeCallback) {
      this.dataChangeCallback(this.data);
    }
  }

  dataChangeCallback?: (newData: MeteringItem[]) => void;

  registerDataChangeCallback(callback: (newData: MeteringItem[]) => void) {
    this.dataChangeCallback = callback;
  }
}
