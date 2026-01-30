import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Task , TaskStatus } from "../models/task.model";

export type TaskCreateInput = {
    title: string;
    description: string;
    difficulty: number;
};

export type TaskUpdateInput = {
    title: string;
    description: string;
    difficulty: number;
};

@Injectable({ providedIn: 'root' })
export class TaskService {
    private tasksKey = 'tasks';

    private tasksSubject = new BehaviorSubject<Task[]>(this.readTasksSafe());
    tasks$ = this.tasksSubject.asObservable();

    createTask(input: TaskCreateInput): void {
        const tasks = this.readTasksSafe();
        const now = Date.now();

        const newTask: Task = {
            
            id: tasks.length + 1,
            title: input.title.trim(),
            description: input.description.trim(),
            difficulty: input.difficulty,
            status: 'todo',
            assignedTo: null,
            createdAt: now,
            updatedAt: now
        };

        tasks.push(newTask);
        this.writeTasks(tasks);
        this.tasksSubject.next(tasks);
    } 

    updateTask(taskId: number, update: TaskUpdateInput, username: string): void {
        const tasks = this.readTasksSafe();
        const idx = tasks.findIndex(t => t.id === taskId);
        if (idx === -1) return;

        const task = tasks[idx];

        tasks[idx] = {
            ...task,
            title: update.title.trim(),
            description: update.description.trim(),
            difficulty: update.difficulty,
            updatedAt: Date.now()
        };

        this.writeTasks(tasks);
        this.tasksSubject.next(tasks);
    }

    deleteTask(taskId: number, username: string): void {
        const tasks = this.readTasksSafe();
        const next = tasks.filter(t => t.id !== taskId);
        this.writeTasks(next);
        this.tasksSubject.next(next);
    }

    assignToMe(taskId: number, username: string): void {
        const tasks = this.readTasksSafe();
        const idx = tasks.findIndex(t => t.id === taskId);
        if (idx === -1) return;

        const task = tasks[idx];

        tasks[idx] = {
            ...task,
            assignedTo: username,
            status: 'inprogress'
        };

        this.writeTasks(tasks);
        this.tasksSubject.next(tasks);
    }

    unassign(taskId:number, username: string): void {
        
        const tasks = this.readTasksSafe();
        const idx = tasks.findIndex(t => t.id === taskId);
        if (idx === -1) return; 

        const task = tasks[idx];

        if (task.assignedTo !== username) return;

        tasks[idx] = {
            ...task,
            assignedTo: null,
            status: 'todo'
        }

        this.writeTasks(tasks);
        this.tasksSubject.next(tasks);
    }

    moveStatus(taskId: number, status: TaskStatus, username: string): void {
        if(status === 'todo') return;

        const tasks = this.readTasksSafe();
        const idx = tasks.findIndex(t => t.id === taskId);
        if (idx === -1) return;

        const task = tasks[idx];

        if (task.assignedTo == null) return;

        tasks[idx] = {
            ...task,
            status
        }

        this.writeTasks(tasks);
        this.tasksSubject.next(tasks);
    }

    private readTasksSafe(): Task[] {
        try {
            const raw = localStorage.getItem(this.tasksKey);
            return raw ? (JSON.parse(raw) as Task[]) : [];
        } catch {
            return [];
        }
    }

    private writeTasks(tasks: Task[]): void {
        localStorage.setItem(this.tasksKey, JSON.stringify(tasks));
    }
 }