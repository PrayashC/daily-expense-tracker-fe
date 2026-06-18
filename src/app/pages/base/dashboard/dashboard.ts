import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseService } from '../../../services/expense-service';
import { Button } from '../../../components/button/button';
import { ExpenseData } from '../../../models/expense-data.model';

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule, DatePipe, CurrencyPipe, Button],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly expenseService = inject(ExpenseService);
  private readonly fb = inject(FormBuilder);

  showForm = false;
  errorMessage: string = '';
  expenses = signal<ExpenseData[]>([]);

  expenseForm: FormGroup = this.fb.group({
    description: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(0.01)]],
  });

  ngOnInit(): void {
    this.expenseService.todayExpenses$.subscribe((expenses) => {
      this.expenses.set(expenses);
    });
    this.expenseService.loadTodayExpenses();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.expenseForm.reset();
      this.errorMessage = '';
    }
  }

  addExpenseEntry(): void {
    if (this.expenseForm.invalid) {
      return;
    }

    const { amount, description } = this.expenseForm.value as {
      amount: number;
      description: string;
    };
    const entry: ExpenseData = {
      amount,
      description,
      entryDate: new Date(),
    };

    this.expenseService.addExpenseEntry(entry).subscribe({
      next: (response) => {
        this.expenseService.updateTodayExpenses(response);
        this.expenseForm.reset();
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Failed to add expense. Please try again.';
      },
    });

    this.showForm = false;
  }
}
