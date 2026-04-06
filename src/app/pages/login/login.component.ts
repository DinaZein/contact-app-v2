import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule,TranslocoModule],
  templateUrl: './login.component.html',
  
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login(this.email, this.password)
      .then(() => this.router.navigate(['/contacts']))
      .catch(() => this.router.navigate(['/error']));
  }
}