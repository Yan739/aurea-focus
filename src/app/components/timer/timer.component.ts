import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TimerService } from '../../services/timer.service';
import { StatisticsService } from '../../services/statistics.service';
import { NotificationService } from '../../services/notification.service';
import { TimerMode, TimerState, TimerSettings } from '../../models/timer.model';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {
  timerState!: TimerState;
  settings!: TimerSettings;
  progress: number = 0;
  
  private subscriptions = new Subscription();

  TimerMode = TimerMode;

  constructor(
    private timerService: TimerService,
    private statsService: StatisticsService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.timerService.timerState$.subscribe(state => {
        const wasRunning = this.timerState?.isRunning;
        this.timerState = state;
        this.progress = this.timerService.getProgress();

        if (wasRunning && !state.isRunning && state.timeLeft === 0) {
          this.onTimerComplete();
        }
      })
    );

    this.subscriptions.add(
      this.timerService.settings$.subscribe(settings => {
        this.settings = settings;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  changeMode(mode: TimerMode): void {
    this.timerService.changeMode(mode);
  }

  toggleTimer(): void {
    if (this.timerState.isRunning) {
      this.timerService.pause();
    } else {
      this.timerService.start();
    }
  }

  resetTimer(): void {
    this.timerService.reset();
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  getModeLabel(): string {
    switch (this.timerState.mode) {
      case TimerMode.WORK:
        return 'Focus Profond';
      case TimerMode.SHORT_BREAK:
        return 'Pause Rapide';
      case TimerMode.LONG_BREAK:
        return 'Grande Pause';
    }
  }

  getSessionInfo(): string {
    const current = (this.timerState.sessionsCompleted % 4) + 1;
    return `Session ${current} sur 4 avant pause longue`;
  }

  private onTimerComplete(): void {
    const messages = {
      [TimerMode.WORK]: 'Session terminée ! Excellent travail ! 🎉',
      [TimerMode.SHORT_BREAK]: 'Pause terminée ! Prêt à reprendre ? 💪',
      [TimerMode.LONG_BREAK]: 'Grande pause terminée ! Rechargé à 100% ⚡'
    };

    this.notificationService.showNotification(messages[this.timerState.mode]);

    if (this.settings.soundEnabled) {
      this.notificationService.playSound();
    }

    if (this.timerState.mode === TimerMode.WORK) {
      this.statsService.addSession(
        this.timerState.mode,
        this.settings.workDuration,
        true
      );
    }
  }
}