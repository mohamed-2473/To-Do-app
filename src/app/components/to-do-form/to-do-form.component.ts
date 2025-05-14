import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-to-do-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './to-do-form.component.html',
  styleUrl: './to-do-form.component.css'
})
export class ToDoFormComponent {
  @Output() addTask = new EventEmitter<string>();
  @Input() errorMessage = '';
  taskText = '';

  onSubmit() {
    this.addTask.emit(this.taskText);
    this.taskText = '';
  }
}