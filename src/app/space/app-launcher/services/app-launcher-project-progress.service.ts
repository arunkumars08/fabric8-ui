import { Injectable } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';

import { HelperService, Progress, ProjectProgressService, TokenProvider } from 'ngx-forge';

@Injectable()
export class AppLauncherProjectProgressService implements ProjectProgressService {
  progressMessages = new Subject<MessageEvent>();
  private socket: WebSocket;
  private END_POINT: string = '';

  constructor(private helperService: HelperService,
    private tokenProvider: TokenProvider) {
    if (this.helperService) {
      this.END_POINT = this.helperService.getBackendUrl();
      console.log(this.END_POINT);
      this.END_POINT = 'wss://forge.api.prod-preview.openshift.io';
    }
  }

  connect(uuidLink: string): WebSocket {
    this.socket = new WebSocket(this.END_POINT + uuidLink);
    this.socket.onmessage = (event: MessageEvent) => {
      this.progressMessages.next(event);
    };
    this.socket.onerror = (error: MessageEvent) => {
      this.progressMessages.error(error);
    };
    this.socket.onclose = () => {
      this.progressMessages.complete();
    };
    return this.socket;
  }

  getProgress(url: string): any {

  }
}
