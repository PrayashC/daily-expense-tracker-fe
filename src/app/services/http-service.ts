import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly basePath = environment.apiHost;

  private readonly http = inject(HttpClient);

  public post(path?: string, data?: any) {
    return this.http.post(this.basePath + path, data);
  }

  public get(path?: string, params?: any) {
    return this.http.get(this.basePath + path, { params: params });
  }

  public put(path?: string, data?: any) {
    return this.http.put(this.basePath + path, data);
  }

  public delete(path?: string, params?: any) {
    return this.http.delete(this.basePath + path, { params: params });
  }

  public patch(path?: string, params?: any) {
    return this.http.patch(this.basePath + path, null, { params: params });
  }
}
