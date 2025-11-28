import { of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Component, HostListener, inject, signal } from '@angular/core';
import { Chip } from '../chip/chip';
import { Button } from '../button/button';
import { WizardService } from '../../../services/wizard.service';
import { ApiService } from '../../../services/api.service';
import { Schema } from '../../../types/schema';

@Component({
  selector: 'app-step1',
  standalone: true,
  imports: [Button, Chip],
  templateUrl: './step1.html',
  styleUrl: './step1.scss',
})
export class Step1 {
  private api = inject(ApiService);
  wizard = inject(WizardService);

  schemas: any[] = [];
  schema: any | null = null;
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadSchemas();
  }

  loadSchemas() {
    this.api
      .getSchemas()
      .pipe(
        retry(1),
        catchError((err) => {
          this.error.set(err.message);
          return of([]);
        })
      )
      .subscribe((data: Schema[]) => {
        this.schemas = data;
      });
  }

  loadSchemaById(id: string) {
    this.api
      .getSchemaById(id)
      .pipe(
        retry(1),
        catchError((err) => {
          this.error.set(err.message);
          return of(null);
        })
      )
      .subscribe((data) => {
        this.wizard.schema.set(data);
      });
  }

  choose(type: string) {
    const selected = this.wizard.selectedSchema();

    if (selected === type) {
      this.wizard.selectedSchema.set(null);
    } else {
      this.wizard.selectedSchema.set(type);
    }
  }

  start() {
    if (!this.wizard.selectedSchema()) return;

    this.loadSchemaById(this.wizard.selectedSchema()!);
    this.wizard.reset();
    this.wizard.next();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    const clickedOnChip = target.closest('app-chip');

    if (!clickedOnChip) {
      this.wizard.selectedSchema.set(null);
    }
  }
}
