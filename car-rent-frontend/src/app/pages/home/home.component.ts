import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { FeaturesSectionComponent } from './components/features-section/features-section.component';
import { RewardsSectionComponent } from './components/rewards-section/rewards-section.component';
import { PromotionsSectionComponent } from './components/promotions-section/promotions-section.component';
import { CarsSectionComponent } from './components/cars-section/cars-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    HeroSectionComponent,
    BookingFormComponent,
    FeaturesSectionComponent,
    RewardsSectionComponent,
    PromotionsSectionComponent,
    CarsSectionComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isSidebarOpen = signal<boolean>(false);

  handleToggleSidebar(): void {
    this.isSidebarOpen.set(!this.isSidebarOpen());
  }

  handleCloseSidebar(): void {
    this.isSidebarOpen.set(false);
  }
}