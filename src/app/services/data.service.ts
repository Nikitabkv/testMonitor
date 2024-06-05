import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  data?: any;

  formatDate(originalDate: string) {
    const [year, month, day] = originalDate.split("-");
    return `${day}.${month}.${year}`;
  }

  getData() {
    return this.http.get('https://api.jsonbin.io/v3/b/66602f8ee41b4d34e4fec79d');
  }

  setData(data: any) {
    this.data = data;
  }

  addData(data: any) {
    data.date = this.formatDate(data.date);
    data.checked = false;
    this.data.push(data);
  }

  editItem(item: any) {
    item.date = this.formatDate(item.date);
    const index = this.data.findIndex((data: any) => data.id === item.id);
    item.checked = false;
    this.data[index] = item;
  }

  deleteItems(ids: Array<number>) {
    this.data = this.data.filter((item: any) => !ids.includes(item.id));
    if (this.dataChangeCallback) {
      this.dataChangeCallback(this.data);
    }
  }

  disableItems() {
    this.data.forEach((item: any) => item.checked = false);
    if (this.dataChangeCallback) {
      this.dataChangeCallback(this.data);
    }
  }

  dataChangeCallback?: (newData: any[]) => void;

  registerDataChangeCallback(callback: (newData: any[]) => void) {
    this.dataChangeCallback = callback;
  }
}
