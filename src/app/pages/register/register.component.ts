import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule,TranslocoModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  email = '';
  password = '';
  name='';
  constructor(private auth: AuthService, private router: Router) {}

  register() {
    this.auth.register(this.email, this.password,this.name)
      .then(() => this.router.navigate(['/contacts']))
      .catch(() => this.router.navigate(['/error']));
  }
}