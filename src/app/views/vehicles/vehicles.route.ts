import { Route } from '@angular/router';
import { VehiclesListComponent } from './vehicles-list.component';

export const VEHICLES_ROUTES: Route[] = [
  {
    path: '',
    component: VehiclesListComponent,
    data: { title: 'Lista de Vehículos' }
  },
  {
    path: 'create',
    component: VehiclesListComponent, // Por ahora usa el mismo, después creamos el formulario
    data: { title: 'Nuevo Vehículo' }
  }
];
