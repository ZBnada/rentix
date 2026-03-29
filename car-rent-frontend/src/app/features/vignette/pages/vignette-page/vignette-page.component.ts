import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VignetteListComponent } from '../../components/vignette-list/vignette-list.component';

@Component({
    selector: 'app-vignette-page',
    standalone: true,
    imports: [CommonModule, VignetteListComponent],
    template: `
    <div class="p-6">
      <app-vignette-list />
    </div>
  `,
})
export class VignettePageComponent {}