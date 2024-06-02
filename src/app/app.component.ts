import {Component, HostListener} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from "./header/header.component";
import {SubstationsComponent} from "./substations/substations.component";
import {MeteringComponent} from "./metering/metering.component";
import {FooterComponent} from "./footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SubstationsComponent, MeteringComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'testMonitor';

  section1Width = 500;
  section2Width = 500;
  isResizing = false;
  startX = 0;
  startWidth = 0;
  nextWidth = 0;

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  startResize(event: MouseEvent | TouchEvent) {
    if (event.target instanceof HTMLElement && event.target.classList.contains('divider')) {
      document.body.style.userSelect = 'none';
      this.isResizing = true;
      this.startX = (event as TouchEvent).touches ? (event as TouchEvent).touches[0].pageX : (event as MouseEvent).pageX;
      this.startWidth = this.section1Width;
      this.nextWidth = this.section2Width;
    }
  }

  @HostListener('mousemove', ['$event'])
  @HostListener('touchmove', ['$event'])
  resize(event: MouseEvent | TouchEvent) {
    if (this.isResizing) {
      const offsetX = (event as TouchEvent).touches ? (event as TouchEvent).touches[0].pageX - this.startX : (event as MouseEvent).pageX - this.startX;
      const newWidth = this.startWidth + offsetX;
      const newNextWidth = this.nextWidth - offsetX;

      if (newWidth > 0 && newNextWidth > 0) {
        this.section1Width = newWidth;
        this.section2Width = newNextWidth;
      }
    }
  }

  @HostListener('mouseup', ['$event'])
  @HostListener('touchend', ['$event'])
  endResize() {
    this.isResizing = false;
    document.body.style.userSelect = 'auto';
  }
}
