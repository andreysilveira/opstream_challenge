import { Component, inject } from '@angular/core';
import { WizardService } from '../../../services/wizard.service';
import { Button } from "../button/button";

@Component({
  selector: 'app-step3',
  imports: [Button],
  templateUrl: './step3.html',
  styleUrl: './step3.scss',
})
export class Step3 {
  wizard = inject(WizardService);
  
  resetFlow() {
    this.wizard.reset();
  }
}
