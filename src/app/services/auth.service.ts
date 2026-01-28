import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { distinctUntilChanged, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from "rxjs";
import { AuthResult } from "../models/auth-result.model";

@Injectable({providedIn: 'root' })
export class AuthService {
    private usersKey = 'users';
    private currentUserKey = 'currentUser';

    private currentUserSubject = new BehaviorSubject<User | null>(this.loadCurrentUser());
    currentUser$ = this.currentUserSubject.asObservable();

    isLoggedIn$ = this.currentUser$.pipe(
        map(user => user !== null),
        distinctUntilChanged()
    ); 

    register(username: string, password: string): Observable<AuthResult> {
        const users = this.getUsers();

        const exists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
        if (exists) return of({ ok: false, message: 'User with this username already exists!'});

        const newUser: User = {
            id: users.length + 1,
            username,
            password
        };

        users.push(newUser);
        this.saveUsers(users);


        localStorage.setItem(this.currentUserKey, JSON.stringify(newUser));
        this.currentUserSubject.next(newUser);

       return of({ ok: true, message: 'Successfully registered!'});
    }

    login(username: string, password: string): Observable<AuthResult> {
        const users = this.getUsers();
        
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);

        if(!user) return of({ ok: false, message: 'Invalid username or passsword!' });

        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        this.currentUserSubject.next(user);

        return of({ ok: true, message: 'Successfully logged in!'});
    }

    logout(): void {
        localStorage.removeItem(this.currentUserKey);
        this.currentUserSubject.next(null);
    }

    private loadCurrentUser(): User | null {
        const raw = localStorage.getItem(this.currentUserKey);
        return raw ? (JSON.parse(raw) as User) : null;
    }

    private getUsers(): User[] {
        const raw = localStorage.getItem(this.usersKey);
        return raw ? (JSON.parse(raw) as User[]) : [];
    }

    private saveUsers(users: User[]) {
        localStorage.setItem(this.usersKey, JSON.stringify(users));
    }

}