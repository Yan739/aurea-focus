import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TimerService } from '../../services/timer.service';
import { NotificationService } from '../../services/notification.service';
import { TimerSettings } from '../../models/timer.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();

  settings!: TimerSettings;
  private subscription?: Subscription;

  constructor(
    private timerService: TimerService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.subscription = this.timerService.settings$.subscribe(settings => {
      this.settings = { ...settings };
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  saveSettings(): void {
    this.timerService.updateSettings(this.settings);
    this.notificationService.showNotification('Paramètres enregistrés avec succès !');
    this.close.emit();
  }

  closeModal(): void {
    this.close.emit();
  }
}