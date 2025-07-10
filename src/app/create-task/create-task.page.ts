import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.page.html',
  styleUrls: ['./create-task.page.scss'],
  standalone: false
})
export class CreateTaskPage implements OnInit {
  taskForm: FormGroup;
  isEditing: boolean = false;
  taskId: string | null = null;
  pageTitle: string = 'Crear Tarea';

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private route: ActivatedRoute
  ) {
    this.taskForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      completed: [false]
    });
  }

  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('id');
    this.isEditing = !!this.taskId;
    this.pageTitle = this.isEditing ? 'Editar Tarea' : 'Crear Tarea';

    if (this.isEditing) {
      this.loadTask();
    }
  }

  async loadTask() {
    if (!this.taskId) return;

    const loading = await this.loadingCtrl.create({
      message: 'Cargando tarea...'
    });
    await loading.present();

    try {
      const task = await this.taskService.getTaskById(this.taskId);
      if (task) {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          completed: task.completed
        });
      } else {
        await this.showToast('Tarea no encontrada', 'danger');
        this.navCtrl.navigateBack('/home');
      }
    } catch (error) {
      await this.showToast('Error al cargar la tarea', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  async saveTask() {
    if (this.taskForm.valid) {
      const loading = await this.loadingCtrl.create({
        message: this.isEditing ? 'Actualizando tarea...' : 'Creando tarea...'
      });
      await loading.present();

      try {
        const formValue = this.taskForm.value;
        
        if (this.isEditing && this.taskId) {
          await this.taskService.updateTask(this.taskId, formValue);
          await this.showToast('Tarea actualizada correctamente', 'success');
        } else {
          await this.taskService.createTask(formValue);
          await this.showToast('Tarea creada correctamente', 'success');
        }

        this.navCtrl.navigateBack('/home');
      } catch (error) {
        await this.showToast('Error al guardar la tarea', 'danger');
      } finally {
        await loading.dismiss();
      }
    } else {
      await this.showToast('Por favor, completa todos los campos correctamente', 'warning');
    }
  }

  goBack() {
    this.navCtrl.navigateBack('/home');
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color
    });
    await toast.present();
  }
}