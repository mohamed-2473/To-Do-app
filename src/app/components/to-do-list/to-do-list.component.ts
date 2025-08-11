import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate?: Date;
  createdAt: Date;
  completedAt?: Date;
}

@Component({
  selector: 'app-to-do-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './to-do-list.component.html',
  styleUrl: './to-do-list.component.css'
})
export class ToDoListComponent {
  @Input() tasks: Task[] = [];
  @Input() categories: string[] = [];
  @Output() updateTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<number>();

  editingId: number | null = null;
  editedText = '';
  editedPriority: 'low' | 'medium' | 'high' = 'medium';
  editedCategory = '';
  editedDueDate = '';

  startEditing(task: Task) {
    this.editingId = task.id;
    this.editedText = task.text;
    this.editedPriority = task.priority;
    this.editedCategory = task.category;
    this.editedDueDate = task.dueDate ? this.formatDateForInput(task.dueDate) : '';
  }

  saveEdit(taskId: number) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task && this.editedText.trim()) {
      const updatedTask: Task = {
        ...task,
        text: this.editedText.trim(),
        priority: this.editedPriority,
        category: this.editedCategory,
        dueDate: this.editedDueDate ? new Date(this.editedDueDate) : undefined
      };
      
      this.updateTask.emit(updatedTask);
      this.cancelEdit();
    }
  }

  cancelEdit() {
    this.editingId = null;
    this.editedText = '';
    this.editedPriority = 'medium';
    this.editedCategory = '';
    this.editedDueDate = '';
  }

  toggleComplete(task: Task) {
    const updatedTask: Task = {
      ...task,
      completed: !task.completed
    };
    this.updateTask.emit(updatedTask);
  }

  deleteTaskHandler(taskId: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.deleteTask.emit(taskId);
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high': return 'border-danger';
      case 'medium': return 'border-warning';
      case 'low': return 'border-success';
      default: return 'border-secondary';
    }
  }

  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'high': return 'bg-danger';
      case 'medium': return 'bg-warning text-dark';
      case 'low': return 'bg-success';
      default: return 'bg-secondary';
    }
  }

  getCategoryBadgeClass(category: string): string {
    const colors = ['primary', 'info', 'success', 'warning', 'danger', 'dark'];
    const index = this.categories.indexOf(category) % colors.length;
    return `bg-${colors[index]}`;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  }

  formatDateTime(date: Date): string {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate || task.completed) return false;
    return new Date() > task.dueDate;
  }

  isDueSoon(task: Task): boolean {
    if (!task.dueDate || task.completed) return false;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return task.dueDate <= tomorrow && task.dueDate > new Date();
  }

  getTimeSince(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return diffMins <= 1 ? 'just now' : `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return this.formatDate(date);
    }
  }

  get minDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}