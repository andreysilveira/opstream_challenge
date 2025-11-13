import { Component, inject } from '@angular/core';

import { Step1 } from './components/shared/step1/step1';
import { Step2 } from './components/shared/step2/step2';
import { Step3 } from './components/shared/step3/step3';

import { WizardService } from './services/wizard.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Step1, Step2, Step3],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  wizard = inject(WizardService);
  step = this.wizard.step;
}
