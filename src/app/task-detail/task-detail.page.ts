import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.page.html',
  styleUrls: ['./task-detail.page.scss'],
  standalone: false
})
export class TaskDetailPage implements OnInit {
  task: Task | null = null;
  taskId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('id');
    this.loadTask();
  }

  async loadTask() {
    if (!this.taskId) return;

    const loading = await this.loadingCtrl.create({
      message: 'Cargando tarea...'
    });
    await loading.present();

    try {
      this.task = await this.taskService.getTaskById(this.taskId);
      if (!this.task) {
        await this.showToast('Tarea no encontrada', 'danger');
        this.navCtrl.navigateBack('/home');
      }
    } catch (error) {
      await this.showToast('Error al cargar la tarea', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  async toggleTaskStatus() {
    if (!this.task) return;

    const loading = await this.loadingCtrl.create({
      message: 'Actualizando tarea...'
    });
    await loading.present();

    try {
      await this.taskService.updateTask(this.task.id, { completed: !this.task.completed });
      this.task.completed = !this.task.completed;
      await this.showToast(
        this.task.completed ? 'Tarea completada' : 'Tarea marcada como pendiente',
        'success'
      );
    } catch (error) {
      await this.showToast('Error al actualizar la tarea', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  navigateToEdit() {
    if (this.task) {
      this.navCtrl.navigateForward(`/edit-task/${this.task.id}`);
    }
  }

  async deleteTask() {
    if (!this.task) return;

    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar esta tarea?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.performDelete();
          }
        }
      ]
    });

    await alert.present();
  }

  private async performDelete() {
    if (!this.task) return;

    const loading = await this.loadingCtrl.create({
      message: 'Eliminando tarea...'
    });
    await loading.present();

    try {
      await this.taskService.deleteTask(this.task.id);
      await this.showToast('Tarea eliminada correctamente', 'success');
      this.navCtrl.navigateBack('/home');
    } catch (error) {
      await this.showToast('Error al eliminar la tarea', 'danger');
    } finally {
      await loading.dismiss();
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