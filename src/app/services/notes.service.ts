import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Note } from '../models/note.model';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private notesSubject = new BehaviorSubject<Note[]>([]);
  public notes$: Observable<Note[]> = this.notesSubject.asObservable();

  constructor() {
    this.loadNotes();
  }

  private loadNotes(): void {
    const stored = localStorage.getItem('aureaFocusNotes');
    if (stored) {
      this.notesSubject.next(JSON.parse(stored));
    }
  }

  private saveNotes(): void {
    localStorage.setItem('aureaFocusNotes', JSON.stringify(this.notesSubject.value));
  }

  public addNote(content: string, mode: string): void {
    const note: Note = {
      id: Date.now(),
      content,
      timestamp: new Date().toLocaleString('fr-FR'),
      mode
    };

    const notes = [note, ...this.notesSubject.value];
    this.notesSubject.next(notes);
    this.saveNotes();
  }

  public deleteNote(id: number): void {
    const notes = this.notesSubject.value.filter(note => note.id !== id);
    this.notesSubject.next(notes);
    this.saveNotes();
  }

  public clearAllNotes(): void {
    this.notesSubject.next([]);
    this.saveNotes();
  }
}