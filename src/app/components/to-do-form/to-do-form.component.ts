import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-to-do-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './to-do-form.component.html',
  styleUrl: './to-do-form.component.css'
})
export class ToDoFormComponent {
  @Output() addTask = new EventEmitter<{
    text: string, 
    priority: 'low' | 'medium' | 'high', 
    category: string,
    dueDate?: Date
  }>();
  @Input() errorMessage = '';
  @Input() categories: string[] = [];
  
  taskText = '';
  selectedPriority: 'low' | 'medium' | 'high' = 'medium';
  selectedCategory = '';
  dueDate = '';
  showAdvanced = false;

  onSubmit() {
    if (!this.taskText.trim()) return;
    
    const taskData = {
      text: this.taskText,
      priority: this.selectedPriority,
      category: this.selectedCategory || this.categories[0] || 'Other',
      dueDate: this.dueDate ? new Date(this.dueDate) : undefined
    };
    
    this.addTask.emit(taskData);
    this.resetForm();
  }

  toggleAdvanced() {
    this.showAdvanced = !this.showAdvanced;
  }

  private resetForm() {
    this.taskText = '';
    this.selectedPriority = 'medium';
    this.selectedCategory = '';
    this.dueDate = '';
    this.showAdvanced = false;
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  }

  // Get minimum date (today) for due date input
  get minDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}