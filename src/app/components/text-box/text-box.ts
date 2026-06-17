import { Component, Input, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-text-box',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './text-box.html',
  styleUrl: './text-box.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextBox),
      multi: true,
    },
  ],
})
export class TextBox implements ControlValueAccessor {
  @Input({ required: true }) id!: string;
  @Input({ required: true }) type!: string;
  @Input({ required: true }) placeholder!: string;
  @Input() label: string | undefined;
  @Input({ required: true }) control!: AbstractControl;
  @Input() errors: Record<string, string> = {};

  value: string = '';
  disabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }

  onBlur(): void {
    this.onTouched();
  }

  get errorMessage(): string | null {
    if (!this.control || !this.control.invalid || !this.control.touched) {
      return null;
    }

    const err = this.control.errors;
    if (!err) return null;

    const firstKey = Object.keys(err).find((key) => this.errors[key]);
    return firstKey ? this.errors[firstKey] : null;
  }
}
