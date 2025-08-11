import { Component } from '@angular/core';
import { ParentComponent } from "./components/parent/parent.component";

@Component({
  selector: 'app-root',
  imports: [ParentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-task-manager';
}
