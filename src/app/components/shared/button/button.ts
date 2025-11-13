import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  @Input() label!: string;
  @Input() disabled = false;
  @Input() buttonClass: string = 'primary';
  @Output() click = new EventEmitter<void>();
}
