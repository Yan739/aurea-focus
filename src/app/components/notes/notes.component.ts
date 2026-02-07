import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NotesService } from '../../services/notes.service';
import { TimerService } from '../../services/timer.service';
import { NotificationService } from '../../services/notification.service';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit, OnDestroy {
  notes: Note[] = [];
  noteContent: string = '';
  showInput: boolean = false;
  currentMode: string = 'work';

  private subscriptions = new Subscription();

  constructor(
    private notesService: NotesService,
    private timerService: TimerService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.notesService.notes$.subscribe(notes => {
        this.notes = notes;
      })
    );

    this.subscriptions.add(
      this.timerService.timerState$.subscribe(state => {
        this.currentMode = state.mode;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  toggleNoteInput(): void {
    this.showInput = !this.showInput;
    if (!this.showInput) {
      this.noteContent = '';
    }
  }

  saveNote(): void {
    if (this.noteContent.trim()) {
      this.notesService.addNote(this.noteContent.trim(), this.currentMode);
      this.noteContent = '';
      this.showInput = false;
      this.notificationService.showNotification('Note enregistrée !');
    }
  }

  deleteNote(id: number): void {
    this.notesService.deleteNote(id);
    this.notificationService.showNotification('Note supprimée');
  }

  cancelNote(): void {
    this.noteContent = '';
    this.showInput = false;
  }
}