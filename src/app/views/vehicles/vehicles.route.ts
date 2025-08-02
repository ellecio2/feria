import { Route } from '@angular/router';
import { VehiclesListComponent } from './vehicles-list.component';
import { VehiclesCreateComponent } from './core/vehicles-create.component';
import { VehiclesViewComponent } from './core/vehicles-view.component';
import { VehiclesUpdateComponent } from './core/vehicles-update.component';

export const VEHICLES_ROUTES: Route[] = [
  {
    path: '',
    component: VehiclesListComponent,
    data: { title: 'Lista de Vehículos' }
  },
  {
    path: 'create',
    component: VehiclesCreateComponent,
    data: { title: 'Nuevo Vehículo' }
  },
  {
    path: ':id/view',
    component: VehiclesViewComponent,
    data: { title: 'Ver Vehículo' }
  },
  {
    path: ':id/edit',
    component: VehiclesUpdateComponent,
    data: { title: 'Editar Vehículo' }
  }
];
