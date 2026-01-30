import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { Task } from "../models/task.model";
import { TaskService } from "../task/task.service";
import { AuthService } from "../services/auth.service";
import { User } from "../models/user.model";

@Component({
    selector: 'app-edit-task',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatSnackBarModule,
    ],
    templateUrl: './edit-task.component.html',
    styleUrl: './edit-task.component.scss',
})
export class EditTaskComponent {
    @Input({ required: true }) task!: Task;

    @Output() cancel = new EventEmitter<void>();
    @Output() saved = new EventEmitter<void>();

    form;
    currentUsername = '';
    currentUser: User | null = null;

    constructor(
        private fb: FormBuilder,
        private taskService: TaskService,
        private auth: AuthService,
        private snack: MatSnackBar
    ) {
        this.form = this.fb.nonNullable.group({
            title: ['', [Validators.required, Validators.minLength(3)]],
            description: ['', [Validators.required, Validators.minLength(5)]],
            difficulty: [0, [Validators.required]]
        });

        this.currentUser = this.auth.currentUser;
        this.currentUsername = this.currentUser?.username ?? '';
    }

    ngOnChanges(): void {
        if(!this.task) return;

        this.form.setValue({
            title: this.task.title,
            description: this.task.description,
            difficulty: this.task.difficulty,
        });
    }

    save(): void {
        if(this.form.invalid) return;
        if(!this.currentUsername) return;

        const newAttributes = this.form.getRawValue();

        try {
            this.taskService.updateTask(
                this.task.id,
                { title: newAttributes.title, description: newAttributes.description, difficulty: newAttributes.difficulty },
                this.currentUsername
            );
            this.snack.open('Updated successfully', 'OK', { duration: 1500 });
            this.saved.emit();
        } catch {
            this.snack.open('Update failed', 'OK', { duration: 2500 });
        }
    }

}