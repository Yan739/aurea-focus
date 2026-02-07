import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Statistics, SessionRecord } from '../models/stats.model';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private statsSubject = new BehaviorSubject<Statistics>({
    todaySessions: 0,
    totalTime: 0,
    currentStreak: 0,
    productivity: 95,
    sessionHistory: []
  });

  public stats$: Observable<Statistics> = this.statsSubject.asObservable();

  constructor() {
    this.loadStats();
    this.checkDailyReset();
  }

  private loadStats(): void {
    const stored = localStorage.getItem('aureaFocusStats');
    if (stored) {
      this.statsSubject.next(JSON.parse(stored));
    }
  }

  private saveStats(): void {
    localStorage.setItem('aureaFocusStats', JSON.stringify(this.statsSubject.value));
  }

  public addSession(mode: string, duration: number, completed: boolean): void {
    const stats = this.statsSubject.value;
    const now = new Date();

    const session: SessionRecord = {
      date: now.toISOString(),
      mode,
      duration,
      completed
    };

    if (completed && mode === 'work') {
      stats.todaySessions++;
      stats.totalTime += duration;
      

      const hour = now.getHours();
      if (hour >= 9 && hour <= 12) {
        stats.productivity = Math.min(100, stats.productivity + 2);
      } else if (hour >= 14 && hour <= 17) {
        stats.productivity = Math.min(100, stats.productivity + 1);
      }
    }

    stats.sessionHistory.push(session);

    this.updateStreak();

    this.statsSubject.next(stats);
    this.saveStats();
  }

  private updateStreak(): void {
    const stats = this.statsSubject.value;
    const today = new Date().toDateString();
    const lastSession = localStorage.getItem('lastSessionDate');

    if (lastSession === today) {
      return;
    }

    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (lastSession === yesterday) {
      stats.currentStreak++;
    } else {
      stats.currentStreak = stats.todaySessions > 0 ? 1 : 0;
    }

    localStorage.setItem('lastSessionDate', today);
  }

  private checkDailyReset(): void {
    setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        const stats = this.statsSubject.value;
        stats.todaySessions = 0;
        this.statsSubject.next(stats);
        this.saveStats();
      }
    }, 60000);
  }

  public resetStats(): void {
    this.statsSubject.next({
      todaySessions: 0,
      totalTime: 0,
      currentStreak: 0,
      productivity: 95,
      sessionHistory: []
    });
    this.saveStats();
  }
}