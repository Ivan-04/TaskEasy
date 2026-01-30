import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { TaskService } from "../task/task.service";
import { AuthService } from "../services/auth.service";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";

@Component({
    selector: 'app-add-task',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule
    ],
    templateUrl: './add-task.component.html'
})
export class AddTaskComponent {
    @Output() cancel = new EventEmitter<void>();

    currentUsername = '';

    form;

    constructor(
        private fb: FormBuilder,
        private taskService: TaskService,
        private auth: AuthService,
        private snack: MatSnackBar
    ) {
        this.form = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(3)]],
            description: ['', [Validators.required, Validators.minLength(5)]],
            difficulty: [null, [Validators.required]]
        });

        const currentUser = this.auth.currentUser;
        this.currentUsername = currentUser?.username ?? '';

    }    

    create(): void {
        if (this.form.invalid) return;
        if (!this.currentUsername) return;

        try {
            const v = this.form.getRawValue();
            this.taskService.createTask({
                title: v.title!,
                description: v.description!,
                difficulty: v.difficulty!
            });

            this.form.reset({ title: '', description: '', difficulty: null });
            this.snack.open('Task created successfully')
        } catch {
            this.snack.open('Could not create a task', 'OK', { duration: 2500 })
        }
    }

}