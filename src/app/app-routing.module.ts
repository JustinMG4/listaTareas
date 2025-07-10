import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'create-task',
    loadChildren: () => import('./create-task/create-task.module').then(m => m.CreateTaskPageModule)
  },
  {
    path: 'edit-task/:id',
    loadChildren: () => import('./create-task/create-task.module').then(m => m.CreateTaskPageModule)
  },
  {
    path: 'task-detail/:id',
    loadChildren: () => import('./task-detail/task-detail.module').then(m => m.TaskDetailPageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
