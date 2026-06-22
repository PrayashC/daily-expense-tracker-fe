import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { HttpService } from './http-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly httpService = inject(HttpService);
  loginAPI: string = '/api/user/log-in';
  signinAPI: string = '/api/user/register';

  setAuthInfo(token: string, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
  }

  public userLogin(username: string, pass: any, timezone: string = 'UTC') {
    return this.httpService
      .post(`${this.loginAPI}`, {
        username: username,
        password: pass,
        timezone: timezone,
      })
      .pipe(
        tap((res: any) => {
          if (res) {
            this.setAuthInfo(res?.token, res?.userId);
          }
        }),
      );
  }
  public userSignin(username: string, pass: any, timezone: string = 'UTC') {
    return this.httpService
      .post(`${this.signinAPI}`, {
        username: username,
        password: pass,
        timezone: timezone,
      })
      .pipe(
        tap((res: any) => {
          if (res) {
            this.setAuthInfo(res?.token, res?.userId);
          }
        }),
      );
  }
}
