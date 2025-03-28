import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ScheduleAppointmentComponent } from './pages/schedule-appointment/schedule-appointment.component';
import { ViewAppointmentsComponent } from './pages/view-appointments/view-appointments.component';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent },
  {
    path: 'agendar',
    component: ScheduleAppointmentComponent,
    canActivate: [authGuard],
  },
  {
    path: 'citas',
    component: ViewAppointmentsComponent,
    canActivate: [authGuard],
  },
];
