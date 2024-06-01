import { Component } from '@angular/core';
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-substations',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './substations.component.html',
  styleUrl: './substations.component.css'
})
export class SubstationsComponent {
  public switchIsChecked = false;

  public switchClickHandler() {
    this.switchIsChecked = !this.switchIsChecked;
  }
}
