import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateTaskPageRoutingModule } from './create-task-routing.module';
import { CreateTaskPage } from './create-task.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    CreateTaskPageRoutingModule
  ],
  declarations: [CreateTaskPage]
})
export class CreateTaskPageModule {}
