import { Component, NgModule, OnInit } from '@angular/core';
import { ToDoFormComponent } from "../to-do-form/to-do-form.component";
import { ToDoListComponent } from "../to-do-list/to-do-list.component";
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

export type FilterType = 'all' | 'active' | 'completed';
export type SortType = 'newest' | 'oldest' | 'priority' | 'dueDate' | 'alphabetical';

@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [ToDoFormComponent, ToDoListComponent, CommonModule, FormsModule],
  templateUrl: './parent.component.html',
  styleUrl: './parent.component.css'
})
export class ParentComponent implements OnInit {
  tasks: Task[] = [];
  duplicateTaskError = '';
  currentFilter: FilterType = 'all';
  currentSort: SortType = 'newest';
  searchTerm = '';
  selectedCategory = '';
  
  // Categories for task organization
  categories = ['Personal', 'Work', 'Shopping', 'Health', 'Study', 'Other'];
  
  // Statistics
  get totalTasks() { return this.tasks.length; }
  get completedTasks() { return this.tasks.filter(t => t.completed).length; }
  get activeTasks() { return this.tasks.filter(t => !t.completed).length; }
  get completionPercentage() { 
    return this.totalTasks > 0 ? Math.round((this.completedTasks / this.totalTasks) * 100) : 0;
  }

  // Filtered and sorted tasks
  get filteredTasks(): Task[] {
    let filtered = this.tasks;

    // Apply search filter
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(task => 
        task.text.toLowerCase().includes(search) ||
        task.category.toLowerCase().includes(search)
      );
    }

    // Apply category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(task => task.category === this.selectedCategory);
    }

    // Apply completion status filter
    switch (this.currentFilter) {
      case 'active':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
    }

    // Apply sorting
    return this.sortTasks(filtered);
  }

  ngOnInit() {
    this.loadTasks();
  }

  addNewTask(taskData: {text: string, priority: 'low' | 'medium' | 'high', category: string, dueDate?: Date}) {
    this.duplicateTaskError = '';
    
    if (!taskData.text.trim()) return;
    
    const isDuplicate = this.tasks.some(task => 
      task.text.toLowerCase() === taskData.text.trim().toLowerCase()
    );
    
    if (isDuplicate) {
      this.duplicateTaskError = `"${taskData.text}" is already in your list!`;
      return;
    }
    
    const newTask: Task = {
      id: Date.now(),
      text: taskData.text.trim(),
      completed: false,
      priority: taskData.priority,
      category: taskData.category,
      dueDate: taskData.dueDate,
      createdAt: new Date()
    };
    
    this.tasks.push(newTask);
    this.saveTasks();
  }

  updateTask(updatedTask: Task) {
    const index = this.tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      // If task is being completed, set completion date
      if (!this.tasks[index].completed && updatedTask.completed) {
        updatedTask.completedAt = new Date();
      } else if (this.tasks[index].completed && !updatedTask.completed) {
        updatedTask.completedAt = undefined;
      }
      
      this.tasks[index] = updatedTask;
      this.saveTasks();
    }
  }

  deleteTask(taskId: number) {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    this.saveTasks();
  }

  deleteCompletedTasks() {
    this.tasks = this.tasks.filter(task => !task.completed);
    this.saveTasks();
  }

  markAllComplete() {
    this.tasks.forEach(task => {
      if (!task.completed) {
        task.completed = true;
        task.completedAt = new Date();
      }
    });
    this.saveTasks();
  }

  markAllIncomplete() {
    this.tasks.forEach(task => {
      task.completed = false;
      task.completedAt = undefined;
    });
    this.saveTasks();
  }

  setFilter(filter: FilterType) {
    this.currentFilter = filter;
  }

  setSort(sort: SortType) {
    this.currentSort = sort;
  }

  updateSearch(searchTerm: string) {
    this.searchTerm = searchTerm;
  }

  updateCategoryFilter(category: string) {
    this.selectedCategory = category;
  }

  private sortTasks(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
      switch (this.currentSort) {
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'priority':
          const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.getTime() - b.dueDate.getTime();
        case 'alphabetical':
          return a.text.toLowerCase().localeCompare(b.text.toLowerCase());
        case 'newest':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });
  }

  private saveTasks() {
    try {
      localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    } catch (error) {
      console.warn('Could not save tasks to localStorage:', error);
    }
  }

  private loadTasks() {
    try {
      const saved = localStorage.getItem('todoTasks');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.tasks = parsed.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined
        }));
      }
    } catch (error) {
      console.warn('Could not load tasks from localStorage:', error);
      this.tasks = [];
    }
  }
}