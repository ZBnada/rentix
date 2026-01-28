import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingFormComponent } from '../booking-form/booking-form.component';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, BookingFormComponent],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.css']
})
export class HeroSectionComponent {}