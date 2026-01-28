import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Car {
  name: string;
  category: string;
  image: string;
  price: number;
}

@Component({
  selector: 'app-cars-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cars-section.component.html',
  styleUrls: ['./cars-section.component.css']
})
export class CarsSectionComponent {
  cars: Car[] = [
    {
      name: 'FIAT PANDA',
      category: 'Mini Sedan Manual',
      image: 'assets/images/fiat-panda.png',
      price: 17.41
    },
    {
      name: 'VW T-CROSS',
      category: 'Compact SUV Manual',
      image: 'assets/images/vw-tcross.png',
      price: 22.88
    }
  ];
}