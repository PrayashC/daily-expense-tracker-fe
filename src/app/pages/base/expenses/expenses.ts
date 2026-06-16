import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DatesSetArg } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ExpenseService } from '../../../services/expense-service';
import { ExpenseData } from '../../../models/expense-data.model';

@Component({
  selector: 'app-expenses',
  imports: [FullCalendarModule, ReactiveFormsModule, DatePipe],
  templateUrl: './expenses.html',
  styleUrl: './expenses.scss',
})
export class Expenses {
  private readonly expenseService = inject(ExpenseService);
  private readonly fb = inject(FormBuilder);
  private readonly userId: string | null = localStorage.getItem('userId');

  events = signal<{ title: string; date: string }[]>([]);

  showModal = signal<boolean>(false);
  selectedDate = '';
  selectedDateExpenses = signal<ExpenseData[]>([]);
  editingEntryId: string | null = null;
  confirmEntryDelete: string | undefined = undefined;
  errorMessage = '';
  calenderStartDate: string | null = null;
  calenderEndDate: string | null = null;
  modalDataChanged = false;

  addForm: FormGroup = this.fb.group({
    description: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(0.01)]],
  });

  editForm: FormGroup = this.fb.group({
    description: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(0.01)]],
  });

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],

    datesSet: (arg: DatesSetArg) => {
      this.calenderStartDate = this.formatDate(arg.start);
      this.calenderEndDate = this.formatDate(arg.end);

      this.getCalenderRangeExpenses(this.calenderStartDate, this.calenderEndDate);
    },

    dateClick: (arg) => {
      this.openDateModal(arg.dateStr);
    },
  };

  getCalenderRangeExpenses(startDate: string, endDate: string) {
    this.expenseService.getExpensesByRange(startDate, endDate).subscribe({
      next: (entries) => {
        this.events.set(
          entries.map((entry) => ({
            title: `${entry.description} - ${entry.amount}`,
            date: this.formatDate(new Date(entry.entryDate)),
          })),
        );
      },
      error: () => {
        this.events.set([]);
      },
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  openDateModal(dateStr: string): void {
    this.selectedDate = dateStr;
    this.editingEntryId = null;
    this.errorMessage = '';
    this.addForm.reset();
    this.editForm.reset();
    this.modalDataChanged = false;

    this.expenseService.getExpensesByRange(dateStr, dateStr).subscribe({
      next: (entries) => {
        this.selectedDateExpenses.set(entries);
        this.showModal.set(true);
      },
      error: () => {
        this.selectedDateExpenses.set([]);
        this.showModal.set(true);
      },
    });
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedDate = '';
    this.selectedDateExpenses.set([]);
    this.editingEntryId = null;
    this.errorMessage = '';
    this.addForm.reset();
    this.editForm.reset();
    if (this.calenderStartDate && this.calenderEndDate && this.modalDataChanged) {
      this.getCalenderRangeExpenses(this.calenderStartDate, this.calenderEndDate);
      this.modalDataChanged = false;
    }
  }

  addEntry(): void {
    if (this.addForm.invalid) {
      return;
    }

    const { amount, description } = this.addForm.value as {
      amount: number;
      description: string;
    };

    const entry: ExpenseData = {
      amount,
      description,
      entryDate: new Date(this.selectedDate),
    };

    this.expenseService.addExpenseEntry(entry).subscribe({
      next: (response) => {
        this.selectedDateExpenses.set(response);
        this.addForm.reset();
        this.errorMessage = '';
        this.modalDataChanged = true;
      },
      error: () => {
        this.errorMessage = 'Failed to add expense. Please try again.';
      },
    });
  }

  startEdit(entry: ExpenseData): void {
    this.editingEntryId = entry.id ?? null;
    this.editForm.setValue({
      description: entry.description,
      amount: entry.amount,
    });
  }

  cancelEdit(): void {
    this.editingEntryId = null;
    this.editForm.reset();
  }

  saveEdit(entryId: string): void {
    if (this.editForm.invalid) {
      return;
    }

    const { amount, description } = this.editForm.value as {
      amount: number;
      description: string;
    };

    const entry: ExpenseData = {
      amount,
      description,
      entryDate: new Date(this.selectedDate),
    };

    this.expenseService.updateExpenseEntry(entryId, entry).subscribe({
      next: (response) => {
        this.selectedDateExpenses.set(response);
        this.editingEntryId = null;
        this.errorMessage = '';
        this.modalDataChanged = true;
      },
      error: () => {
        this.errorMessage = 'Failed to update expense. Please try again.';
      },
    });
  }

  deleteEntry(entryId: string): void {
    this.expenseService.deleteExpenseEntry(entryId).subscribe({
      next: (response) => {
        this.selectedDateExpenses.set(response);
        this.errorMessage = '';
        this.modalDataChanged = true;
        if (this.editingEntryId === entryId) {
          this.editingEntryId = null;
          this.editForm.reset();
        }
      },
      error: () => {
        this.errorMessage = 'Failed to delete expense. Please try again.';
      },
    });
  }
}
