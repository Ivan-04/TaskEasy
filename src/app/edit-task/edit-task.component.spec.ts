import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditTaskComponent } from './edit-task.component';
import { TaskService } from '../task/task.service';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { vi } from 'vitest';
import { Task } from '../models/task.model';

describe('EditTaskComponent', () => {
  let fixture: ComponentFixture<EditTaskComponent>;
  let component: EditTaskComponent;

  let taskServiceMock: { updateTask: ReturnType<typeof vi.fn> };
  let authMock: { currentUser: any };
  let snackMock: { open: ReturnType<typeof vi.fn> };

  const baseTask: Task = {
    id: 1,
    title: 'Title',
    description: 'Description',
    difficulty: 2,
    status: 'todo',
    assignedTo: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  beforeEach(async () => {
    taskServiceMock = { updateTask: vi.fn() };
    authMock = { currentUser: { username: 'userrr' } };
    snackMock = { open: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [EditTaskComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: AuthService, useValue: authMock },
        { provide: MatSnackBar, useValue: snackMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditTaskComponent);
    component = fixture.componentInstance;

    component.task = { ...baseTask };

    fixture.detectChanges();
  });

  describe('initialization', () => {
    it('should initialize the form with title, description and difficulty', () => {
      expect(component.form).toBeTruthy();
      expect(component.form.controls['title']).toBeTruthy();
      expect(component.form.controls['description']).toBeTruthy();
      expect(component.form.controls['difficulty']).toBeTruthy();
    });

    it('should initialize currentUsername from auth.currentUser', () => {
      expect(component.currentUsername).toBe('userrr');
    });
  });

  describe('ngOnChanges()', () => {
    it('should set form values from task', () => {
      component.task = {
        ...baseTask,
        title: 'Title1',
        description: 'Description1',
        difficulty: 3,
      };

      component.ngOnChanges();

      expect(component.form.value).toEqual({
        title: 'Title1',
        description: 'Description1',
        difficulty: 3,
      });
    });
  });

  describe('form validation', () => {
    it('invalid when empty', () => {
      component.form.setValue({ title: '', description: '', difficulty: 0 });
      expect(component.form.invalid).toBe(true);
    });

    it('invalid title with less than 3 symbols', () => {
      component.form.setValue({ title: 'ab', description: 'abcde', difficulty: 1 });
      expect(component.form.invalid).toBe(true);
      expect(component.form.controls['title'].hasError('minlength')).toBe(true);
    });

    it('invalid description with less than 5 symbols', () => {
      component.form.setValue({ title: 'abc', description: 'abcd', difficulty: 1 });
      expect(component.form.invalid).toBe(true);
      expect(component.form.controls['description'].hasError('minlength')).toBe(true);
    });
  });

  describe('save()', () => {
    it('should do nothing when form is invalid', () => {
      component.form.setValue({ title: '', description: '', difficulty: 0 });

      const savedSpy = vi.spyOn(component.saved, 'emit');

      component.save();

      expect(taskServiceMock.updateTask).not.toHaveBeenCalled();
      expect(snackMock.open).not.toHaveBeenCalled();
      expect(savedSpy).not.toHaveBeenCalled();
    });

    it('should do nothing when currentUsername is empty', () => {
      component.currentUsername = '';
      component.form.setValue({ title: 'abc', description: 'abcde', difficulty: 1 });

      const savedSpy = vi.spyOn(component.saved, 'emit');

      component.save();

      expect(taskServiceMock.updateTask).not.toHaveBeenCalled();
      expect(snackMock.open).not.toHaveBeenCalled();
      expect(savedSpy).not.toHaveBeenCalled();
    });

    it('should call taskService.updateTask with correct values', () => {
      component.form.setValue({ title: 'Title1', description: 'Description1', difficulty: 3 });

      component.save();

      expect(taskServiceMock.updateTask).toHaveBeenCalledWith(
        baseTask.id,
        { title: 'Title1', description: 'Description1', difficulty: 3 },
        'userrr'
      );
    });
  });
});
