export type TaskStatus = 'todo' | 'inprogress' | 'pr' | 'done';

export interface Task {
    id: number;
    title: string;
    description: string;
    difficulty: number;
    status: TaskStatus;
    assignedTo: string | null;
    createdAt: number;
    updatedAt: number;
}