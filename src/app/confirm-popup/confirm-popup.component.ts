import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from "@angular/common";
import {DataService} from "../services/data.service";

@Component({
  selector: 'app-confirm-popup',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './confirm-popup.component.html',
  styleUrl: './confirm-popup.component.css'
})
export class ConfirmPopupComponent {
  @Input() deletePopupIsActive = false;
  @Input() checkedItemsIds: Array<number> = [];

  @Output() deletePopupIsActiveChange = new EventEmitter<boolean>();

  constructor(private dataService: DataService) {}

  closeHandler() {
    this.deletePopupIsActive = false;
    this.deletePopupIsActiveChange.emit(this.deletePopupIsActive);
  }

  confirmHandler() {
    this.deletePopupIsActive = false;
    const selectedIds = this.checkedItemsIds; // Получение выбранных ID
    this.dataService.deleteItems(selectedIds);
    this.deletePopupIsActiveChange.emit(this.deletePopupIsActive);
  }
}
