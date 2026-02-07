import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TimerComponent } from './components/timer/timer.component';
import { StatsComponent } from './components/stats/stats.component';
import { NotesComponent } from './components/notes/notes.component';
import { SettingsComponent } from './components/settings/Settings.component';
import { ThemeService, Theme } from './services/theme.service';
import { NotificationService, NotificationMessage } from './services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    TimerComponent,
    StatsComponent,
    NotesComponent,
    SettingsComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  showSettings = false;
  currentTheme: Theme = 'light';
  notification: NotificationMessage = { message: '', show: false };
  
  private subscriptions = new Subscription();

  constructor(
    private themeService: ThemeService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.themeService.theme$.subscribe(theme => {
        this.currentTheme = theme;
      })
    );

    this.subscriptions.add(
      this.notificationService.notification$.subscribe(notification => {
        this.notification = notification;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  openSettings(): void {
    this.showSettings = true;
  }

  closeSettings(): void {
    this.showSettings = false;
  }

  getThemeIcon(): string {
    return this.currentTheme === 'light' ? '🌙 Dark' : '☀️ Light';
  }
}