import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControleTechniqueListComponent } from '../../components/controle-technique-list/controle-technique-list.component';

@Component({
    selector: 'app-controle-technique-page',
    standalone: true,
    imports: [CommonModule, ControleTechniqueListComponent],
    template: `<app-controle-technique-list />`,
})
export class ControleTechniquePageComponent {}