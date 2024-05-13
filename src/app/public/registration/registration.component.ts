import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  public registerForm: FormGroup;

  public constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.initRegisterForm();
  }

  public initRegisterForm(): void {
    this.registerForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  public register(): void {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value)
      this.authService.signup(this.registerForm.value).subscribe(() => {
        this.router.navigateByUrl('/login');
      });
    }
  }
}
