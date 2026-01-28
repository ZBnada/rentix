import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Promotion {
  image: string;
  badge: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-promotions-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promotions-section.component.html',
  styleUrls: ['./promotions-section.component.css']
})
export class PromotionsSectionComponent {
  promotions: Promotion[] = [
    {
      image: 'assets/images/promo-week.jpg',
      badge: 'UP TO 15% DISCOUNT',
      title: 'START YOUR WEEK IN STYLE',
      description: 'Save on week start rentals.'
    },
    {
      image: 'assets/images/promo-luxury.jpg',
      badge: 'UP TO 15% DISCOUNT',
      title: 'SAVE ON LUXURY VEHICLES',
      description: 'Book now and drive first class.'
    }
  ];
}