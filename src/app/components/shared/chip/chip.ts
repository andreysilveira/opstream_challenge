import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [],
  templateUrl: './chip.html',
  styleUrl: './chip.scss',
})
export class Chip {
  @Input() icon!: string;
  @Input() label!: string;
}
