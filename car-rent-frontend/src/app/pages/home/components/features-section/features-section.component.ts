import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features-section.component.html',
  styleUrls: ['./features-section.component.css']
})
export class FeaturesSectionComponent {
  features: Feature[] = [
    {
      icon: 'globe',
      title: 'Global reach',
      description: '2,000+ RentIX stations in over 105 countries'
    },
    {
      icon: 'car',
      title: 'Distinctive fleet',
      description: 'From high-end convertibles to premium SUVs'
    },
    {
      icon: 'star',
      title: 'Exceptional service',
      description: 'Stress-free, trustworthy, no hidden costs'
    }
  ];
}