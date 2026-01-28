import { Component } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from "@angular/material/toolbar";

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    imports: [CommonModule, MatCardModule, MatButtonModule, MatToolbarModule]
})
export class HomeComponent {
    user$!: Observable<any>;

    constructor(private auth: AuthService, private router: Router) {
       this.user$ = this.auth.currentUser$;
    }

    logout(): void {
        this.auth.logout();
        this.router.navigate(['/login']);
    }
 
}