import { Component, computed, inject } from '@angular/core';
import { WizardService } from '../../../services/wizard.service';
import { Button } from '../button/button';

@Component({
  selector: 'app-step3',
  imports: [Button],
  templateUrl: './step3.html',
  styleUrl: './step3.scss',
})
export class Step3 {
  wizard = inject(WizardService);

  summary = computed(() => {
    const schema = this.wizard.schema();
    const formData = this.wizard.formData();

    if (!schema) return [];

    return schema.sections.flatMap((section: any) =>
      section.fields.map((field: any) => {
        const value = formData[field.id];
        const answered = value !== null && value !== undefined && value !== '';
        return {
          question: field.label,
          answered,
          answer: answered ? value : 'Not Answered',
        };
      })
    );
  });

  resetFlow() {
    this.wizard.reset();
  }
}
