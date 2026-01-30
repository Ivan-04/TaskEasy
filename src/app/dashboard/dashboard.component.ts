import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { TaskService } from "../task/task.service";
import { TaskStatus } from "../models/task.model";
import { Task } from "../models/task.model";
import { map } from 'rxjs/operators';
import { AddTaskComponent } from "../new-task/add-task.component";
import { EditTaskComponent } from "../edit-task/edit-task.component";


@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        MatToolbarModule,
        MatCardModule,
        MatChipsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatSnackBarModule,
        AddTaskComponent,
        EditTaskComponent
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

    currentUsername = '';

    tasks$;

    todo$;
    inprogress$;
    pr$;
    done$;

    showAddTask = false;

    constructor(
        private fb: FormBuilder,
        private taskService: TaskService,
        private auth: AuthService,
        private snack: MatSnackBar
    ) {
        this.tasks$ = this.taskService.tasks$;

        const currentUser = this.auth.currentUser;
        this.currentUsername = currentUser?.username ?? '';

        this.todo$ = this.tasks$.pipe(
            map((tasks => tasks.filter(t => t.status === 'todo' && t.assignedTo === null)))
        );

        this.inprogress$ = this.tasks$.pipe(
            map(tasks => tasks.filter(t => t.status === 'inprogress'))
        );

        this.pr$ = this.tasks$.pipe(
            map(tasks => tasks.filter(t => t.status === 'pr'))
        );

        this.done$ = this.tasks$.pipe(
            map(tasks => tasks.filter(t => t.status === 'done'))
        );
    }

    openAddTask(): void {
        this.showAddTask = true;
    }

    closeAddTask(): void {
        this.showAddTask = false;
    }

    assignToMe(task: Task): void {
        if (!this.currentUsername) return;
    
        try {
            this.taskService.assignToMe(task.id, this.currentUsername);
            this.snack.open('Task was assigned to you successfully', 'OK', { duration: 1500 });
        } catch {
            this.snack.open('Assign failed', 'OK', { duration: 2500 })
        }
    }

    unassign(task: Task): void {
        if (!this.currentUsername) return;

        try {
            this.taskService.unassign(task.id, this.currentUsername);
            this.snack.open('Task was unassigned of you successfully', 'OK', { duration: 1500 });
        } catch {
            this.snack.open('Unassign failed', 'OK', { duration: 2500 })
        }
    }

    move(task: Task, status: TaskStatus): void {
        if (!this.currentUsername) return;

        try {
            this.taskService.moveStatus(task.id, status, this.currentUsername)
        } catch {
            this.snack.open('Move failed', 'OK', { duration: 2500 });
        }
    }

    delete(task: Task): void {
        if(!this.currentUsername) return;

        try {
            this.taskService.deleteTask(task.id, this.currentUsername);
            this.snack.open('Deleted task successfully', 'OK', { duration: 1500 });
        } catch {
            this.snack.open('Delete failed', 'OK', { duration: 2500 });
        }
    }

    editingTask: Task | null = null;

    openEdit(task: Task): void {
        this.editingTask = task;
    }

    closeEdit(): void {
        this.editingTask = null;
    }

    onSavedEdit(): void {
        this.editingTask = null;
    }

}