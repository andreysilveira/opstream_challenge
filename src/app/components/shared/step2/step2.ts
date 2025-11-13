import { Component, inject, Input, signal } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { WizardService } from '../../../services/wizard.service';

@Component({
  selector: 'app-step2',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './step2.html',
  styleUrl: './step2.scss',
})
export class Step2 {
  @Input() selectedSchema: string | null = null;

  wizard = inject(WizardService);
  activeSection = signal(0);
  schema = this.wizard.schema();

  nextSectionClick() {
    const next = this.activeSection() + 1;

    if (next < this.schema.sections.length) {
      this.activeSection.set(next);
    } else {
      this.wizard.next();
    }
  }

  prevSectionClick() {
    const prev = this.activeSection() - 1;
    if (prev >= 0) this.activeSection.set(prev);
  }

  submitForm() {
    console.log('✅ Form submitted!');
    this.wizard.next();
  }
}
