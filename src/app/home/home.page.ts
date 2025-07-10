import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  searchQuery: string = '';
  isLoading: boolean = false;

  constructor(
    private taskService: TaskService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  ionViewWillEnter() {
    this.loadTasks();
  }

  async loadTasks() {
    this.isLoading = true;
    const loading = await this.loadingCtrl.create({
      message: 'Cargando tareas...'
    });
    await loading.present();

    try {
      this.tasks = await this.taskService.getTasks();
      this.filteredTasks = [...this.tasks];
    } catch (error) {
      await this.showToast('Error al cargar las tareas', 'danger');
    } finally {
      this.isLoading = false;
      await loading.dismiss();
    }
  }

  async searchTasks() {
    if (this.searchQuery.trim() === '') {
      this.filteredTasks = [...this.tasks];
    } else {
      this.filteredTasks = await this.taskService.searchTasks(this.searchQuery);
    }
  }

  async toggleTaskStatus(task: Task) {
    const loading = await this.loadingCtrl.create({
      message: 'Actualizando tarea...'
    });
    await loading.present();

    try {
      await this.taskService.updateTask(task.id, { completed: !task.completed });
      await this.loadTasks();
      await this.showToast(
        task.completed ? 'Tarea marcada como pendiente' : 'Tarea completada',
        'success'
      );
    } catch (error) {
      await this.showToast('Error al actualizar la tarea', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  async deleteTask(task: Task) {
    const loading = await this.loadingCtrl.create({
      message: 'Eliminando tarea...'
    });
    await loading.present();

    try {
      await this.taskService.deleteTask(task.id);
      await this.loadTasks();
      await this.showToast('Tarea eliminada correctamente', 'success');
    } catch (error) {
      await this.showToast('Error al eliminar la tarea', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  navigateToCreateTask() {
    this.navCtrl.navigateForward('/create-task');
  }

  navigateToTaskDetail(taskId: string) {
    this.navCtrl.navigateForward(`/task-detail/${taskId}`);
  }

  navigateToEditTask(taskId: string) {
    this.navCtrl.navigateForward(`/edit-task/${taskId}`);
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