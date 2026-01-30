import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LoginComponent } from "./login.component";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { vi } from "vitest";
import { RouterModule } from "@angular/router";
import { Directive, Input } from "@angular/core";
import { MatSnackBarModule } from "@angular/material/snack-bar";


@Directive({
  selector: "[routerLink]",
  standalone: true,
})
class RouterLinkStubDirective {
  @Input("routerLink") linkParams: any;
}

describe("LoginComponent", () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;

  let authMock: { login: ReturnType<typeof vi.fn> };
  let routerMock: { navigate: ReturnType<typeof vi.fn> };
  let snackMock: { open: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authMock = { login: vi.fn() };
    routerMock = { navigate: vi.fn() };
    snackMock = { open: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authMock },
        { provide: Router, useValue: routerMock },
        { provide: MatSnackBar, useValue: snackMock },
      ],
    })
      .overrideComponent(LoginComponent, {
        remove: { imports: [RouterModule, MatSnackBarModule] },
        add: { imports: [RouterLinkStubDirective] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe("initialization", () => {
    it("initialize the form with username and password", () => {
      expect(component.form).toBeTruthy();
      expect(component.form.controls["username"]).toBeTruthy();
      expect(component.form.controls["password"]).toBeTruthy();
    });
  });

  describe("form validation", () => {
    it("invalid username and password when empty", () => {
      component.form.setValue({ username: "", password: "" });
      expect(component.form.invalid).toBe(true);
    });

    it("invalid username with less than 4 symbols", () => {
      component.form.setValue({ username: "Ron", password: "123456" });
      expect(component.form.invalid).toBe(true);
      expect(component.form.controls["username"].hasError("minlength")).toBe(true);
    });

    it("invalid password with less than 6 symbols", () => {
      component.form.setValue({ username: "Toto", password: "12345" });
      expect(component.form.invalid).toBe(true);
      expect(component.form.controls["password"].hasError("minlength")).toBe(true);
    });
  });

  describe("submit()", () => {
    it("should do nothing when form is invalid", () => {
      component.form.setValue({ username: "", password: "" });

      component.submit();

      expect(authMock.login).not.toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
      expect(snackMock.open).not.toHaveBeenCalled();
    });

    it("should open snackbar with response message", () => {
      authMock.login.mockReturnValue(of({ ok: false, message: "Nope" }));
      component.form.setValue({ username: "testuser", password: "123456" });

      component.submit();

      expect(snackMock.open).toHaveBeenCalledWith("Nope", "OK", { duration: 2500 });
    });
  });

  describe("navigation", () => {
    it("when login is ok, navigate to /home", () => {
      authMock.login.mockReturnValue(of({ ok: true, message: "OK" }));
      component.form.setValue({ username: "testuser", password: "123456" });

      component.submit();

      expect(routerMock.navigate).toHaveBeenCalledWith(["/home"]);
    });

    it("should NOT navigate to /home when login is not ok", () => {
      authMock.login.mockReturnValue(of({ ok: false, message: "Nope" }));
      component.form.setValue({ username: "testuser", password: "123456" });

      component.submit();

      expect(routerMock.navigate).not.toHaveBeenCalled();
    });
  });
});
