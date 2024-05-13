import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {authGuard} from "./guards/auth.guard";
import {PuzzleComponent} from "./protected/puzzle/puzzle.component";
import {LoginComponent} from "./public/login/login.component";
import {RegistrationComponent} from "./public/registration/registration.component";

const routes: Routes = [
  { path: 'puzzle', component: PuzzleComponent, canActivate: [authGuard] },
  { path: '',   redirectTo: '/puzzle', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: RegistrationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
