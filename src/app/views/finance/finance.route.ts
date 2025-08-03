import { Route } from '@angular/router';

export const FINANCE_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'companies',
    pathMatch: 'full'
  },
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
  }
];