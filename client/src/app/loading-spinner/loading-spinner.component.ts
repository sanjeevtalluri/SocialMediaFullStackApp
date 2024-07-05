import { CommonModule, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BusyService } from '../services/busy.service';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [NgIf,CommonModule],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.css'
})
export class LoadingSpinnerComponent {
  public busyService = inject(BusyService);
}
