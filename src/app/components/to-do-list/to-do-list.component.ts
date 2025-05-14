import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-to-do-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './to-do-list.component.html',
  styleUrl: './to-do-list.component.css'
})
export class ToDoListComponent {
  @Input() tasks: {id: number, text: string, completed: boolean}[] = [];
  @Output() updateTask = new EventEmitter<{id: number, text: string, completed: boolean}>();
  @Output() deleteTask = new EventEmitter<number>();

  editingId: number | null = null;
  editedText = '';

  startEditing(task: {id: number, text: string, completed: boolean}) {
    this.editingId = task.id;
    this.editedText = task.text;
  }

  saveEdit(taskId: number) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      this.updateTask.emit({
        ...task,
        text: this.editedText
      });
      this.editingId = null;
    }
  }

  cancelEdit() {
    this.editingId = null;
  }

  toggleComplete(task: {id: number, text: string, completed: boolean}) {
    this.updateTask.emit({
      ...task,
      completed: !task.completed
    });
  }
}