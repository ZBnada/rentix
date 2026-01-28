import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FooterLink {
  label: string;
  url: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface Airport {
  name: string;
  code: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  footerSections: FooterSection[] = [
    {
      title: 'Our programs',
      links: [
        { label: 'RentIX+ Car Subscription', url: '#' },
        { label: 'RentIX ride', url: '#' },
        { label: 'Car rental deals', url: '#' },
        { label: 'RentIX ONE rewards program', url: '#' },
        { label: 'RentIX app', url: '#' }
      ]
    },
    {
      title: 'RentIX for business',
      links: [
        { label: 'Register my business', url: '#' },
        { label: 'Travel agencies', url: '#' },
        { label: 'Mobility for Business Travel', url: '#' },
        { label: 'Business car alternatives', url: '#' }
      ]
    },
    {
      title: 'About us',
      links: [
        { label: 'RentIX group', url: '#' },
        { label: 'RentIX Magazine', url: '#' },
        { label: 'RentIX News', url: '#' },
        { label: 'Investor Relations', url: '#' },
        { label: 'Careers', url: '#' },
        { label: 'Regina RentIX Children\'s Aid Foundation', url: '#' }
      ]
    }
  ];


  currentYear = new Date().getFullYear();
}