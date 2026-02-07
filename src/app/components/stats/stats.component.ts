import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { StatisticsService } from '../../services/statistics.service';
import { Statistics } from '../../models/stats.model';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit, OnDestroy {
  stats!: Statistics;
  private subscription?: Subscription;

  constructor(private statsService: StatisticsService) {}

  ngOnInit(): void {
    this.subscription = this.statsService.stats$.subscribe(stats => {
      this.stats = stats;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}