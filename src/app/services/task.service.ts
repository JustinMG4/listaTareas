import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly TASKS_KEY = 'tasks';

  constructor() { }

  async getTasks(): Promise<Task[]> {
    const { value } = await Preferences.get({ key: this.TASKS_KEY });
    return value ? JSON.parse(value) : [];
  }

  async getTaskById(id: string): Promise<Task | null> {
    const tasks = await this.getTasks();
    return tasks.find(task => task.id === id) || null;
  }

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const tasks = await this.getTasks();
    const newTask: Task = {
      ...task,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    tasks.push(newTask);
    await this.saveTasks(tasks);
    return newTask;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    const tasks = await this.getTasks();
    const index = tasks.findIndex(task => task.id === id);
    
    if (index === -1) return null;
    
    tasks[index] = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date()
    };
    
    await this.saveTasks(tasks);
    return tasks[index];
  }

  async deleteTask(id: string): Promise<boolean> {
    const tasks = await this.getTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    
    if (filteredTasks.length === tasks.length) return false;
    
    await this.saveTasks(filteredTasks);
    return true;
  }

  async searchTasks(query: string): Promise<Task[]> {
    const tasks = await this.getTasks();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(query.toLowerCase()) ||
      task.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  private async saveTasks(tasks: Task[]): Promise<void> {
    await Preferences.set({
      key: this.TASKS_KEY,
      value: JSON.stringify(tasks)
    });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}