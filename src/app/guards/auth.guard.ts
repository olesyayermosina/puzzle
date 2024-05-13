import {Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth/auth.service";
import {map} from "rxjs";

export const authGuard = () => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.getAuthenticated().pipe(
    map(user => {
      console.log(user)
      return user.token ? true : router.navigateByUrl('/login')
    })
  );
};
