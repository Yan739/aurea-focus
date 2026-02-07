import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<Theme>('light');
  public theme$: Observable<Theme> = this.themeSubject.asObservable();

  constructor() {
    this.loadTheme();
    this.applyAutoTheme();
  }

  private loadTheme(): void {
    const stored = localStorage.getItem('aureaFocusTheme') as Theme;
    if (stored) {
      this.setTheme(stored);
    }
  }

  public setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aureaFocusTheme', theme);
  }

  public toggleTheme(): void {
    const current = this.themeSubject.value;
    const newTheme: Theme = current === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  private applyAutoTheme(): void {
    const hour = new Date().getHours();
    if ((hour >= 18 || hour < 6) && this.themeSubject.value === 'light') {
      this.setTheme('dark');
    }
  }

  public getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }
}