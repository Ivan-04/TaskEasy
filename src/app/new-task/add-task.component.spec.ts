import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddTaskComponent } from "./add-task.component";
import { TaskService } from "../task/task.service";
import { AuthService } from "../services/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { vi } from "vitest";

describe("AddTaskComponent", () => {
  let fixture: ComponentFixture<AddTaskComponent>;
  let component: AddTaskComponent;

  let taskMock: { createTask: ReturnType<typeof vi.fn> };
  let authMock: { currentUser: any };
  let snackMock: { open: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    taskMock = { createTask: vi.fn() };
    authMock = { currentUser: { username: "john" } };
    snackMock = { open: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [AddTaskComponent],
      providers: [
        { provide: TaskService, useValue: taskMock },
        { provide: AuthService, useValue: authMock },
        { provide: MatSnackBar, useValue: snackMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe("initialization", () => {
    it("should initialize the form with title, description and difficulty", () => {
      expect(component.form).toBeTruthy();
      expect(component.form.controls["title"]).toBeTruthy();
      expect(component.form.controls["description"]).toBeTruthy();
      expect(component.form.controls["difficulty"]).toBeTruthy();
    });

    it("should initialize currentUsername from auth.currentUser", () => {
      expect(component.currentUsername).toBe("john");
    });

  });

  describe("form validation", () => {
    it("invalid when empty", () => {
      component.form.setValue({ title: "", description: "", difficulty: null });
      expect(component.form.invalid).toBe(true);
    });

    it("invalid title with less than 3 symbols", () => {
      component.form.setValue({ title: "ab", description: "valid desc", difficulty: 1 });
      expect(component.form.invalid).toBe(true);
      expect(component.form.controls["title"].hasError("minlength")).toBe(true);
    });

    it("invalid description with less than 5 symbols", () => {
      component.form.setValue({ title: "abc", description: "abcd", difficulty: 1 });
      expect(component.form.invalid).toBe(true);
      expect(component.form.controls["description"].hasError("minlength")).toBe(true);
    });

    it("invalid difficulty when null", () => {
      component.form.setValue({ title: "abc", description: "abcde", difficulty: null });
      expect(component.form.invalid).toBe(true);
      expect(component.form.controls["difficulty"].hasError("required")).toBe(true);
    });
  });

  describe("create()", () => {
    it("should do nothing when form is invalid", () => {
      component.form.setValue({ title: "", description: "", difficulty: null });

      component.create();

      expect(taskMock.createTask).not.toHaveBeenCalled();
      expect(snackMock.open).not.toHaveBeenCalled();
    });

    it("should do nothing when currentUsername is empty", () => {
      component.currentUsername = "";
      component.form.setValue({ title: "abc", description: "abcde", difficulty: 2 });

      component.create();

      expect(taskMock.createTask).not.toHaveBeenCalled();
      expect(snackMock.open).not.toHaveBeenCalled();
    });

    it("should call taskService.createTask", () => {
      component.form.setValue({ title: "My title", description: "My description", difficulty: 3 });

      component.create();

      expect(taskMock.createTask).toHaveBeenCalledWith({
        title: "My title",
        description: "My description",
        difficulty: 3,
      });
    });
  });
});