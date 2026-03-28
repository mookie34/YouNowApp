import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly THEME_KEY = 'theme';
  isDark = false;

  constructor() {
    this.loadTheme();
  }

  toggle(): void {
    this.isDark = !this.isDark;
    this.applyTheme();
    localStorage.setItem(this.THEME_KEY, this.isDark ? 'dark' : 'light');
  }

  private loadTheme(): void {
    const saved = localStorage.getItem(this.THEME_KEY);
    this.isDark = saved === 'dark';
    this.applyTheme();
  }

  private applyTheme(): void {
    if (this.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
