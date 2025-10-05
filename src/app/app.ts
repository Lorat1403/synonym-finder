import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextAnalyzer } from './components/text-analyzer/text-analyzer';


@Component({
  selector: 'app-root',
  imports: [CommonModule, TextAnalyzer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('synonym-finder');
}
