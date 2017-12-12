import {Component, Input, ViewChild, ViewEncapsulation} from "@angular/core";
import {TREE_ACTIONS} from "angular2-tree-component";
import {ParentLinkFactory} from "../../../../common/parent-link-factory";
import {AppDeployments, AppEnvironmentDetails} from "../list-page/list-page.app.component";
import {Space, createEmptySpace} from "../../../model/space.model";
import {DeploymentDeleteDialog} from "../../deployment/delete-dialog/delete-dialog.deployment.component";
import {DeploymentScaleDialog} from "../../deployment/scale-dialog/scale-dialog.deployment.component";

import {AppService} from './machine.service';

@Component({
  selector: 'fabric8-apps-list',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './list.app.component.html',
  providers: [AppService],
  styleUrls: ['./list.app.component.less'],
})
export class AppListComponent {
  parentLink: string;

  @Input() loading: boolean;
  @Input() apps: AppDeployments[] = [];
  @Input() space: Space;

  public machineApps: Array<any> = [];
  public read: any;


  @ViewChild(DeploymentDeleteDialog) deleteDialog: DeploymentDeleteDialog;
  @ViewChild(DeploymentScaleDialog) scaleDialog: DeploymentScaleDialog;
  @ViewChild('machineStackModal') machineStackModal: any;

  constructor(
    private appService: AppService,
    parentLinkFactory: ParentLinkFactory,
  ) {
    this.parentLink = parentLinkFactory.parentLink;
    this.machineApps = [{
      icon: 'icon1',
      name: 'Openshift App',
      notification: {
        value: 3
      },
      environmentDetails: [{
        deployment: {
          availableReplicas: 3,
          startingReplicas: 1,
          terminatingReplicas: 1
        },
        version: '0.0.0'
      }]
    }, {
      icon: 'icon2',
      name: 'AWS App',
      environmentDetails: [{}, {
        deployment: {
          availableReplicas: 3,
          startingReplicas: 1,
          terminatingReplicas: 1
        },
        version: '0.0.1'
      }]
    }];
  }

  openDeleteDialog(deleteDeploymentModal, deployment) {
    this.deleteDialog.modal = deleteDeploymentModal;
    this.deleteDialog.deployment = deployment;
    deleteDeploymentModal.open();
  }

  openMachineDialog(app: any) {
    this.appService.readConfiguration().subscribe((result) => {
      this.read = result;
      this.machineStackModal.open();
    });
  }

  openScaleDialog(scaleDeploymentModal, deployment) {
    this.scaleDialog.configure(scaleDeploymentModal, deployment);
    this.scaleDialog.open();
  }


}
