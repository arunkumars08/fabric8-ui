import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';

import {
  HelperService,
  TokenProvider
} from 'ngx-forge';

import { DependencyCheck, DependencyCheckService } from 'ngx-forge';

@Injectable()
export class AppLauncherDependencyCheckService implements DependencyCheckService {
  /**
   * Returns project dependencies
   *
   * @returns {Observable<DependencyCheck>} Project dependencies
   */
  getDependencyCheck(): Observable<DependencyCheck> {
    return Observable.of({
      mavenArtifact: 'd4.345',
      groupId: '124-644',
      projectName: 'App_test_1',
      projectVersion: '124.554',
      spacePath: '/myspace'
    });
  }

  // TODO: remove the hardcodes
  private END_POINT: string = '';
  private API_BASE: string = 'booster-catalog/';
  private ORIGIN: string = '';

  constructor(
    private http: Http,
    private helperService: HelperService,
    private tokenProvider: TokenProvider
  ) {
    if (this.helperService) {
      this.END_POINT = this.helperService.getBackendUrl();
      this.ORIGIN = this.helperService.getOrigin();
    }
  }

  private get options(): Observable<RequestOptions> {
    let headers = new Headers();
    headers.append('X-App', this.ORIGIN);
    return Observable.fromPromise(this.tokenProvider.token.then((token) => {
      headers.append('Authorization', 'Bearer ' + token);
      return new RequestOptions({
        headers: headers
      });
    }));
  }


   getGithubInformation(missionId: string, runtimeId: string, version: string = 'redhat'): Observable<any> {
     if (runtimeId && missionId) {
      let missionEndPoint: string = this.END_POINT + this.API_BASE + `booster?missionId=${missionId}&runtimeId=${runtimeId}&runtimeVersion=${version}`;
      return this.options.flatMap((option) => {
        return this.http.get(missionEndPoint, option)
          .map(response => response.json() as any)
          .catch(this.handleError);
      });
     }
     return Observable.empty();
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
