import { Route } from '@angular/router';

export const FINANCE_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'companies',
    pathMatch: 'full'
  },
  // === COMPANIES ===
  {
    path: 'companies',
    loadComponent: () => 
      import('./finance-list.component').then(m => m.FinanceListComponent),
    data: { title: 'Financieras' }
  },
  {
    path: 'companies/create',
    loadComponent: () => 
      import('./core/pages/companies/finance-companies-create.component').then(m => m.FinanceCompaniesCreateComponent),
    data: { title: 'Registrar Financiera' }
  },
  {
    path: 'companies/:id/view',
    loadComponent: () => 
      import('./core/pages/companies/finance-companies-view.component').then(m => m.FinanceCompaniesViewComponent),
    data: { title: 'Ver Financiera' }
  },
  {
    path: 'companies/:id/edit',
    loadComponent: () => 
      import('./core/pages/companies/finance-companies-update.component').then(m => m.FinanceCompaniesUpdateComponent),
    data: { title: 'Editar Financiera' }
  },
  
  // === APPLICATIONS ===
  {
    path: 'applications',
    loadComponent: () => 
      import('./finance-applications-list.component').then(m => m.FinanceApplicationsListComponent),
    data: { title: 'Solicitudes de Financiamiento' }
  },
  {
    path: 'applications/create',
    loadComponent: () => 
      import('./core/pages/applications/finance-applications-create.component').then(m => m.FinanceApplicationsCreateComponent),
    data: { title: 'Nueva Solicitud' }
  },
  {
    path: 'applications/:id/view',
    loadComponent: () => 
      import('./core/pages/applications/finance-applications-view.component').then(m => m.FinanceApplicationsViewComponent),
    data: { title: 'Ver Solicitud' }
  },
  {
    path: 'applications/:id/edit',
    loadComponent: () => 
      import('./core/pages/applications/finance-applications-update.component').then(m => m.FinanceApplicationsUpdateComponent),
    data: { title: 'Editar Solicitud' }
  }
];