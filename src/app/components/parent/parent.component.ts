import { Component } from '@angular/core';
import { ToDoFormComponent } from "../to-do-form/to-do-form.component";
import { ToDoListComponent } from "../to-do-list/to-do-list.component";

@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [ToDoFormComponent, ToDoListComponent],
  templateUrl: './parent.component.html',
  styleUrl: './parent.component.css'
})
export class ParentComponent {
  tasks: {id: number, text: string, completed: boolean}[] = [];
  duplicateTaskError = '';

  addNewTask(taskText: string) {
    this.duplicateTaskError = '';
    
    if (!taskText.trim()) return;
    
    const isDuplicate = this.tasks.some(task => 
      task.text.toLowerCase() === taskText.trim().toLowerCase()
    );
    
    if (isDuplicate) {
      this.duplicateTaskError = `"${taskText}" is already in your list!`;
      return;
    }
    
    this.tasks.push({
      id: Date.now(),
      text: taskText.trim(),
      completed: false
    });
  }

  updateTask(updatedTask: {id: number, text: string, completed: boolean}) {
    const index = this.tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
    }
  }

  deleteTask(taskId: number) {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
  }
}