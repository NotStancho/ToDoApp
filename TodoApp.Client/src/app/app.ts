import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ToastContainerComponent} from './ui/toast/toast-container.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainerComponent],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('TodoApp.Client');
}
