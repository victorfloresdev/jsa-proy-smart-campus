import { Routes } from '@angular/router';
import { CafeteriaPanelComponent } from './modules/cafeteria/pages/cafeteria-panel/cafeteria-panel.component';
import { TicketListComponent } from './modules/tickets/pages/ticket-list/ticket-list.component';
import { ObjetosTableroComponent } from './modules/objetos-perdidos/pages/objetos-tablero/objetos-tablero.component';
import { ReservasVistaComponent } from './modules/reservas/pages/reservas-vista/reservas-vista.component';
import { ReservaFormComponent } from './modules/reservas/pages/reserva-form/reserva-form.component';
import { CarpoolingListComponent } from './modules/carpooling/pages/carpooling-list/carpooling-list.component';
import { CarpoolingFormComponent } from './modules/carpooling/pages/carpooling-form/carpooling-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'carpooling', pathMatch: 'full' },
  { path: 'cafeteria', component: CafeteriaPanelComponent },
  { path: 'tickets', component: TicketListComponent },
  { path: 'objetos-perdidos', component: ObjetosTableroComponent },
  { path: 'reservas', component: ReservasVistaComponent },
  { path: 'reservas/nueva', component: ReservaFormComponent },
  { path: 'carpooling', component: CarpoolingListComponent },
  { path: 'carpooling/nuevo', component: CarpoolingFormComponent },
  { path: 'carpooling/editar/:id', component: CarpoolingFormComponent },
  { path: '**', redirectTo: 'carpooling' }
];
