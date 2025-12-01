import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { WizardService } from '../../../services/wizard.service';
import { ApiService } from '../../../services/api.service';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-step2',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step2.html',
  styleUrl: './step2.scss',
})
export class Step2 {
  private wizard = inject(WizardService);
  private fb = inject(FormBuilder);
  private api = inject(ApiService);

  activeSection = signal(0);
  saveState = signal<'idle' | 'saving' | 'saved' | 'error'>('idle');
  form = signal(this.fb.group({}));
  schema = this.wizard.schema();
  requestId = this.generateRequestId();

  ngOnInit() {
    this.buildForm();
    this.setupAutosave();
  }

  buildForm() {
    const cached = localStorage.getItem(`step2-[${this.schema.id}]-cache`);
    const cache = cached ? JSON.parse(cached) : null;
    const controls: Record<string, any> = {};

    for (const section of this.schema.sections ?? []) {
      for (const field of section.fields ?? []) {
        const controlName = String(field.id);
        const validators = field.required ? [Validators.required] : [];
        const initialValue = cache?.[controlName] ?? field.default ?? '';
        controls[controlName] = [initialValue, validators];
      }
    }

    const builtForm = this.fb.group(controls);
    this.form.set(builtForm);
  }

  setupAutosave() {
    const f = this.form();
    if (!f) return;

    f.valueChanges.subscribe((value) => {
      localStorage.setItem(`step2-[${this.schema.id}]-cache`, JSON.stringify(value));

      this.saveState.set('saving');

      setTimeout(() => {
        if (Math.random() > 0.9) {
          this.saveState.set('error');
          setTimeout(() => this.saveState.set('saving'), 2000);
        } else {
          this.saveState.set('saved');
        }
      }, 800);
    });
  }

  nextSectionClick() {
    const next = this.activeSection() + 1;
    if (next < this.schema.sections.length) {
      this.activeSection.set(next);
    } else {
      this.submitForm();
    }
  }

  prevSectionClick() {
    const prev = this.activeSection() - 1;
    if (prev >= 0) this.activeSection.set(prev);
  }

  submitForm() {
    const formGroup = this.form();
    if (formGroup.invalid) {
      formGroup.markAllAsTouched();
      this.saveState.set('error');
      return;
    }

    // It saves one question at a time
    const payload = formGroup.value;
    this.saveState.set('saving');

    const requests = Object.entries(payload).map(([questionId, value]) =>
      this.api.saveAnswer(this.requestId, Number(questionId), value)
    );

    if (requests.length === 0) {
      this.saveState.set('error');
      console.warn('⚠️ No fields to submit');
      return;
    }

    forkJoin(requests)
      .pipe(finalize(() => this.saveState.set('idle')))
      .subscribe({
        next: (responses) => {
          console.log('✅ Form successfully saved:', responses);
          localStorage.removeItem(`step2-[${this.schema.id}]-cache`);
          this.wizard.updateFormData(this.form().value);
          this.saveState.set('saved');
          this.wizard.next();
        },
        error: (err) => {
          console.error('❌ Error sending form:', err);
          this.saveState.set('error');
        },
      });
  }

  // It saves all question at a time
  //   const payload = {
  //     requestId: this.requestId,
  //     answers: formGroup.value,
  //   };

  //   this.saveState.set('saving');

  //   this.api
  //     .saveAnswer(payload)
  //     .pipe(finalize(() => this.saveState.set('idle')))
  //     .subscribe({
  //       next: (res) => {
  //         console.log('Saved:', res);
  //         this.saveState.set('saved');
  //         this.wizard.next();
  //       },
  //       error: () => this.saveState.set('error'),
  //     });
  // }

  private generateRequestId(): string {
    return (
      Date.now().toString(36) +
      '-' +
      Math.random().toString(36).substring(2, 10) +
      '-' +
      crypto.getRandomValues(new Uint32Array(1))[0].toString(36)
    );
  }
}
