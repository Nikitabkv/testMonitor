import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-metering',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgClass
  ],
  templateUrl: './metering.component.html',
  styleUrl: './metering.component.css'
})
export class MeteringComponent {
  public switchIsChecked = false;
  public checkedResults = 0;

  public switchClickHandler() {
    this.switchIsChecked = !this.switchIsChecked;
  }
}
