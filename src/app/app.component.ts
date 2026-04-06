import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule,TranslocoModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(public auth: AuthService,private transloco: TranslocoService) {}
    setLang(lang: string) {
    this.transloco.setActiveLang(lang);
  }
}