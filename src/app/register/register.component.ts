import { Component } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { Router, RouterModule} from "@angular/router";
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
    standalone: true,
    imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
})
export class RegisterComponent {
    hidePassword = true;
    form;
    
    constructor(
        private fb: FormBuilder,
        private auth: AuthService,
        private router: Router,
        private snack: MatSnackBar
    ) {
        this.form = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(4)]],
        password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    submit() {
        if (this.form.invalid) return;

        const username = this.form.value.username!;
        const password = this.form.value.password!;

        this.auth.register(username, password).subscribe(res => {
            this.snack.open(res.message, 'OK', { duration: 2500 });
            if (res.ok) this.router.navigate(['/home']);
        });
    }

}