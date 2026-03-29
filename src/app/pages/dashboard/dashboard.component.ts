import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourierService } from '../../services/courier.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  availableCouriersCount: number | null = null;

  constructor(private courierService: CourierService) {}

  ngOnInit(): void {
    this.courierService.getAvailableCount().subscribe({
      next: (data) => {
        this.availableCouriersCount = data.count;
      },
      error: (err) => {
        console.error('Error fetching available couriers count:', err);
        this.availableCouriersCount = 0;
      },
    });
  }
}
