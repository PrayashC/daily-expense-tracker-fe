import { Component, Input, output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [NgClass],
  templateUrl: './button.html',
})
export class Button {
  @Input() variant: 'primary' | 'secondary' | 'link' = 'primary';
  @Input() size: 'sm' | 'lg' = 'lg';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() iconLeft?: string;
  @Input() text: string = '';

  onClick = output<void>();

  get classes(): Record<string, boolean> {
    const disabledActive = this.disabled && this.variant !== 'link';

    return {
      // Layout base
      'inline-flex items-center justify-center transition-all gap-2': true,
      'w-full': this.fullWidth,

      // Cursor
      'cursor-pointer': !disabledActive && this.variant !== 'link',
      'cursor-not-allowed': disabledActive,

      // Disabled state
      'opacity-50': disabledActive,
      'pointer-events-none': disabledActive,

      'bg-yellow-gradient': this.variant !== 'link',

      // ---- variant: primary ----
      'text-white': this.variant === 'primary',
      'button-shadow-lg': this.variant === 'primary',
      'hover:opacity-90': this.variant === 'primary',

      // ---- variant: secondary ----
      'text-black': this.variant === 'secondary',
      'button-shadow': this.variant === 'secondary',
      'hover:shadow-lg hover:brightness-105': this.variant === 'secondary',

      // ---- variant: link ----
      'txt-accent txt-medium-16px bg-transparent hover:underline': this.variant === 'link',

      // ---- sizes (not for link) ----
      'px-6 py-3 rounded-2xl txt-semibold-16px': this.variant !== 'link' && this.size === 'lg',
      'px-4 py-2.5 rounded-xl txt-semibold-14px': this.variant !== 'link' && this.size === 'sm',
    };
  }

  handleClick(event: MouseEvent): void {
    if (this.disabled && this.variant !== 'link') return;
    if (this.type === 'button') {
      this.onClick.emit();
    }
  }
}
