// src/app/app.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApolloModule } from 'apollo-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ApolloModule],
  template: `<router-outlet />`,
  styles: [],
})
export class AppComponent  {
  title = 'RentIX';

}