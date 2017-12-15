import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class AppService {
  private headers: Headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {}

  public readConfiguration (): Observable<any> {
    let url: string = 'https://gist.githubusercontent.com/arunkumars08/46ccf79425485ed0b830ea5c7cb0c0e9/raw/8cb620635057158239cbcecd9352fa057c470815/read-containers.json';
    let body: any = {};
    // Change to POST once integrated with service
    return this    .http
    .get(url, body)
    .map(this.extractData)
    .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json() || {};
    body['statusCode'] = res.status;
    body['statusText'] = res.statusText;
    return body;
  }

  private handleError(error: Response | any) {
    let body: any = {};
    if (error instanceof Response) {
      if (error && error.status && error.statusText) {
        body = {
          status: error.status,
          statusText: error.statusText
        };
      }
    } else {
      body = {
        statusText: error.message ? error.message : error.toString()
      };
    }
    return Observable.throw(body);
  }
}
