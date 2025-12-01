import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WizardService {
  step = signal(0);
  schema = signal<any | null>(null);
  selectedSchema = signal<string | null>(null);
  formData = signal<any>({});

  next() {
    this.step.update((v) => v + 1);
  }

  prev() {
    this.step.update((v) => (v > 0 ? v - 1 : v));
  }

  reset() {
    this.step.set(0);
    this.selectedSchema.set(null);
    this.schema.set(null);
    this.formData.set({});
  }

  updateFormData(partialData: Record<string, any>) {
    this.formData.update((prev) => ({
      ...prev,
      ...partialData,
    }));
  }
}
