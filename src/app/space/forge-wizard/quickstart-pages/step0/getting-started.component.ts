import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {Gui, Input as ForgeInput, Option, ProjectSelectConfig} from 'ngx-forge';
import { Filter, FilterConfig, FilterEvent, FilterField } from 'patternfly-ng';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'getting-started',
  templateUrl: './getting-started.component.html'
})
export class GettingStartedComponent implements OnInit {
  @Input() gui: Gui;
  @Input() form: FormGroup;
  config: ProjectSelectConfig = {
    classes: ['Node', 'Spring', 'WildFly', 'Vert'],
    techPreview: ['Node'],
    renderType: 'body'
  };
  filterConfig: FilterConfig;
  filtersText: string = '';
  private filteredInput: ForgeInput;

  ngOnInit(): void {
    let fields = [{
      id: 'name',
      title:  'Name',
      placeholder: 'Filter by Name...',
      type: 'text'
    }] as FilterField[];
    this.filterConfig = {
      fields: fields
    } as FilterConfig;
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@');
    console.log(this.gui);
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@');
    this.filteredInput = new ForgeInput(this.gui.inputs[0]);
  }
}

