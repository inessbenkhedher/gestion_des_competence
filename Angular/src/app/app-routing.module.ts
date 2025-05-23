import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGaurd } from './shared/services/auth.gaurd';
import { BlankLayoutComponent } from './shared/components/layouts/blank-layout/blank-layout.component';
import { AdminLayoutSidebarCompactComponent } from './shared/components/layouts/admin-layout-sidebar-compact/admin-layout-sidebar-compact.component';
import { AdminLayoutCustomComponent } from './gestion/components/layouts/admin-layout-custom/admin-layout-custom.component';
import { DashboardComponent } from './gestion/service-employee/dashboard/dashboard.component';

const templateRoutes: Routes = [
    {
      path: 'dashboard',
      loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
    },
    {
      path: 'uikits',
      loadChildren: () => import('./views/ui-kits/ui-kits.module').then(m => m.UiKitsModule)
    },
    {
      path: 'forms',
      loadChildren: () => import('./views/forms/forms.module').then(m => m.AppFormsModule)
    },
    {
      path: 'invoice',
      loadChildren: () => import('./views/invoice/invoice.module').then(m => m.InvoiceModule)
    },
    {
      path: 'inbox',
      loadChildren: () => import('./views/inbox/inbox.module').then(m => m.InboxModule)
    },
    {
      path: 'calendar',
      loadChildren: () => import('./views/calendar/calendar.module').then(m => m.CalendarAppModule)
    },
    {
      path: 'chat',
      loadChildren: () => import('./views/chat/chat.module').then(m => m.ChatModule)
    },
    {
      path: 'contacts',
      loadChildren: () => import('./views/contacts/contacts.module').then(m => m.ContactsModule)
    },
    {
      path: 'tables',
      loadChildren: () => import('./views/data-tables/data-tables.module').then(m => m.DataTablesModule)
    },
    {
      path: 'pages',
      loadChildren: () => import('./views/pages/pages.module').then(m => m.PagesModule)
    },
    {
        path: 'icons',
        loadChildren: () => import('./views/icons/icons.module').then(m => m.IconsModule)
    },
  
  ];


const adminRoutes: Routes = [

    {
  path: 'analyse',
  loadChildren: () => import('./gestion/analyse/analyse.module').then(m => m.AnalyseModule)
},
    
    {
      path: 'service-competence',
      loadChildren: () => import('./gestion/service-competence/service-competence.module').then(m => m.ServiceCompetenceModule)
    },
    {
      path: 'service-employee',
      loadChildren: () => import('./gestion/service-employee/service-employee.module').then(m => m.ServiceEmployeeModule)
    },

    {
      path: 'service-evaluation',
      loadChildren: () => import('./gestion/service-evaluation/service-evaluation.module').then(m => m.ServiceEvaluationModule)
    }
  ];
const routes: Routes = [

  {
    path: 'home',
    redirectTo: 'service-employee/home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'sessions',
        loadChildren: () => import('./views/sessions/sessions.module').then(m => m.SessionsModule)
      }
    ]
  },
  
  {
    path: '',
    component: BlankLayoutComponent,
    children: [
      {
        path: 'others',
        loadChildren: () => import('./views/others/others.module').then(m => m.OthersModule)
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutSidebarCompactComponent,
    canActivate: [AuthGaurd],
    children: templateRoutes
  },

  {
    path: '',
    component: AdminLayoutCustomComponent,
    canActivate: [AuthGaurd],
    children: adminRoutes
  },
 
  {
    path: '**',
    redirectTo: 'others/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
