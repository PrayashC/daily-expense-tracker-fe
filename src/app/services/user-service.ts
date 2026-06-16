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

  setToken(token: string, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
  }

  public userLogin(username: string, pass: any) {
    return this.httpService
      .post(`${this.loginAPI}`, {
        username: username,
        password: pass,
      })
      .pipe(
        tap((res: any) => {
          if (res) {
            this.setToken(res?.token, res?.userId);
          }
        }),
      );
  }
  public userSignin(username: string, pass: any) {
    return this.httpService
      .post(`${this.signinAPI}`, {
        username: username,
        password: pass,
      })
      .pipe(
        tap((res: any) => {
          if (res) {
            this.setToken(res?.token, res?.userId);
          }
        }),
      );
  }
}
