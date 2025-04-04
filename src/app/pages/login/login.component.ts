import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  async submit() {
    try {
      await this.auth.login(this.email, this.password);
      this.router.navigate(['/']); // redirige al home o dashboard
    } catch (err) {
      this.error = 'Credenciales inválidas';
    }
  }
  cerrarModal() {
    this.router.navigate(['/']); // O redirige donde necesites
  }
}
