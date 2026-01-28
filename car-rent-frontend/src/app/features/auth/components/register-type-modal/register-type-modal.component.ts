import { Component, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserType } from '../../models/auth.types';

@Component({
  selector: 'app-register-type-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './register-type-modal.component.html',
  styleUrls: ['./register-type-modal.component.css']
})
export class RegisterTypeModalComponent {
  selectUserType = output<UserType>();
  closeModal = output<void>();

  selectedType = signal<UserType | null>(null);
  readonly UserType = UserType;

  selectType(type: UserType): void {
    this.selectedType.set(type);
  }

  handleContinue(): void {
    const type = this.selectedType();
    if (type) {
      this.selectUserType.emit(type);
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal.emit();
    }
  }
}