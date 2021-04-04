import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment';
import { User } from './User';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private httpClient: HttpClient
  ) { }

  linkGeneration(param1, param2) {
    const host = window.location.hostname;
    return param1.protocol + '://' + host + ':' + param1.port + param1.apiPrefix + param2;
  }

  addUser(body: any) {
    const url = this.linkGeneration(environment.fileUploadService, environment.fileUploadService.addUser);
    return this.httpClient.post<User>(url, body, { responseType: 'json', reportProgress: true,
    observe: 'events' });
  }
}
