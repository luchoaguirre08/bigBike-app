import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ScheduleAppointmentComponent } from './pages/schedule-appointment/schedule-appointment.component';
import { ViewAppointmentsComponent } from './pages/view-appointments/view-appointments.component';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { RegistroClienteComponent } from './pages/registro-cliente/registro-cliente.component';
import { HistorialUsuarioComponent } from './pages/historial-usuario/historial-usuario.component';

export const routes: Routes = [
  // 🔁 Redirección al home
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },

  // 🏠 Home
  {
    path: '',
    component: HomeComponent,
  },

  // 🔐 Login
  {
    path: 'login',
    component: LoginComponent,
  },
  // 🔐 Login
  {
    path: 'historial',
    component: HistorialUsuarioComponent,
  },

  // 🧾 Registro de cliente (requiere autenticación)
  {
    path: 'registro',
    component: RegistroClienteComponent,
    canActivate: [authGuard],
  },

  // 📅 Agendar cita (requiere autenticación)
  {
    path: 'agendar',
    component: ScheduleAppointmentComponent,
    canActivate: [authGuard],
  },

  // 📋 Ver citas (requiere autenticación)
  {
    path: 'citas',
    component: ViewAppointmentsComponent,
    canActivate: [authGuard],
  },

  // 🚫 Página no encontrada (opcional)
  {
    path: '**',
    redirectTo: 'home',
  },
];
