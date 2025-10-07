import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="fixed inset-0 flex items-center justify-center">form works!</div>`
})
export class CustomerFormComponent {}
