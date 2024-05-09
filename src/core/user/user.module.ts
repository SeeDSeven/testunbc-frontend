import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { AuthInterceptor } from '../auth/auth.interceptor';



@NgModule({
  declarations: [],
  imports: [
    HttpClientModule
  ],
  providers: [
    AuthService,
    {
        provide : HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi   : true
    }
  ]
})
export class UserModule { }
