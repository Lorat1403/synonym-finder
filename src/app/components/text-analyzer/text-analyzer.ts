import { Component } from '@angular/core';
import { SynonymService } from '../../services/synonym.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-text-analyzer',
  imports: [FormsModule, CommonModule],
  templateUrl: './text-analyzer.html',
  styleUrl: './text-analyzer.scss'
})
export class TextAnalyzer {
   constructor(private synonymService: SynonymService) {
    this.analyzeText();
  }
   // --- Основні Дані ---
  textAreaContent: string = '';
  synonyms: string[] = [];
  isLoadingSynonyms: boolean = false;

  // --- Дані Аналізу ---
  charCount: number = 0;
  wordCount: number = 0;

  // --- Відстеження Виділення ---
  private selectionStart: number = -1;
  private selectionEnd: number = -1;
  selectedText: string = '';

  
  // --- Аналіз та Відстеження Тексту ---
  analyzeText(): void {
    this.charCount = this.textAreaContent.length;
    // Простий підрахунок слів: розбиваємо за пробілами, фільтруємо порожні рядки
    const words = this.textAreaContent.match(/\b\w+\b/g);
    this.wordCount = words ? words.length : 0;
  }

  // Викликається при зміні тексту (input, keyup)
  onTextChange(): void {
    this.analyzeText();
    // Очистити синоніми, якщо текст суттєво змінився (необов'язково)
    this.synonyms = [];
  }

  // Фіксує поточний виділений текст та його позицію
  captureSelection(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.selectionStart = textarea.selectionStart;
    this.selectionEnd = textarea.selectionEnd;

    // Встановлюємо selectedText лише якщо виділення існує
    if (this.selectionStart !== this.selectionEnd) {
      this.selectedText = textarea.value.substring(this.selectionStart, this.selectionEnd);
    } else {
      this.selectedText = '';
    }
    this.synonyms = []; // Очистити попередні синоніми при новому виділенні
  }

  // --- Логіка Синонімів ---
  getSynonyms(): void {
    if (!this.selectedText) {
      alert('Будь ласка, виділіть слово або фразу для пошуку синонімів.');
      return;
    }

    this.isLoadingSynonyms = true;
    this.synonyms = [];

    this.synonymService.getSynonyms(this.selectedText).subscribe({
      next: (data: any[]) => {
        this.synonyms = data.map(item => item.word);
        this.isLoadingSynonyms = false;
      },
      error: (err: any) => {
        console.error('Помилка при отриманні синонімів:', err);
        this.synonyms = ['Помилка завантаження синонімів.'];
        this.isLoadingSynonyms = false;
      }
    });
  }

  replaceSelectedText(newWord: string): void {
    if (this.selectionStart !== -1 && this.selectionEnd !== -1) {
      // 1. Отримати текст до виділення
      const before = this.textAreaContent.substring(0, this.selectionStart);
      // 2. Отримати текст після виділення
      const after = this.textAreaContent.substring(this.selectionEnd);
      
      // 3. Сконструювати новий текст
      this.textAreaContent = before + newWord + after;

      // 4. Оновити аналіз та очистити синоніми/виділення
      this.analyzeText();
      this.synonyms = [];
      this.selectedText = '';
      this.selectionStart = -1;
      this.selectionEnd = -1;
    }
  }

  // --- Допоміжні Функції ---

  copyText(): void {
    // Використовуємо вбудований API браузера для копіювання
    navigator.clipboard.writeText(this.textAreaContent).then(() => {
      alert('Текст скопійовано до буферу обміну! ✔️');
    }).catch(err => {
      console.error('Не вдалося скопіювати текст: ', err);
      alert('Помилка копіювання. Спробуйте вручну.');
    });
  }

}
