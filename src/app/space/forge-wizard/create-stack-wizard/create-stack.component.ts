import { Component, ViewEncapsulation } from '@angular/core';
import { ForgeService } from 'ngx-forge';
import { AbstractWizard } from '../abstract-wizard.component';
import { ContextService } from '../../../shared/context.service';
import { Gui, Input } from 'ngx-forge';
import { configureSteps } from './create-stack-wizard.config';
import { Notifications } from 'ngx-base';
import { CodebasesService } from '../../create/codebases/services/codebases.service';
import { OnDestroy, AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { AfterViewChecked } from 'ngx-forge/node_modules/@angular/core/src/metadata/lifecycle_hooks';

@Component({
    selector: 'create-stack-wizard',
    templateUrl: './create-stack.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./create-stack.component.less']
})

export class CreateStackComponent extends AbstractWizard implements OnDestroy, AfterViewInit {
    constructor(forgeService: ForgeService,
              codebasesService: CodebasesService,
              context: ContextService,
              notifications: Notifications) {
    super(forgeService, codebasesService, context, notifications);
    this.endPoint = 'fabric8-new-project';
    this.steps = configureSteps();
    this.isLoading = true;
    this.EXECUTE_STEP_INDEX = this.steps[6].priority - 1;
    this.LAST_STEP = this.steps[7].priority - 1;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.loadUi().then(gui => {
      this.steps[3].nextEnabled = true;
      this.isLoading = false;
    }).catch(error => {
      this.isLoading = false;
      this.error = error;
    });
  }

  ngAfterViewInit(): void {
    let sidebar = document.getElementsByClassName('wizard-sidebar');
    sidebar[2].classList.add('wizard-close');
    setTimeout(() => {
      let applicationWizard = document.getElementsByClassName('modal-dialog');
      applicationWizard[1].classList.add('modal-full');
    }, 3000);
  }

  executeStep(wizardSteps = this.wizard.steps): void {
    this.isLoading = true;
    this.wizard.config.nextTitle = 'Ok';
    wizardSteps[this.LAST_STEP].config.nextEnabled = false;
    wizardSteps[this.LAST_STEP].config.previousEnabled = false;
    wizardSteps.map(step => step.config.allowClickNav = false);
    // special case of last step, you can't navigate using step navigation
    this.wizard.steps.map(step => step.config.allowClickNav = false);
    this.forgeService.executeStep(this.endPoint, this.history).then((gui: Gui) => {
      this.result = gui[5] as Input;
      this.augmentStep(gui);
      this.isLoading = false;
      wizardSteps[this.LAST_STEP].config.nextEnabled = true;
    }).catch(error => {
      this.isLoading = false;
      this.error = error;
    });
  }

  ngOnDestroy() {
    let sidebar = document.getElementsByClassName('wizard-sidebar');
    let applicationWizard = document.getElementsByClassName('modal-dialog');
    applicationWizard[1].classList.remove('modal-full');
    sidebar[2].classList.remove('wizard-close');
  }
}
