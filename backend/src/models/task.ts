import client from '../database';
import { Task, TaskForm } from '../types/task.types';

export class TaskStore {
  async getByUser(userId: number): Promise<Task[]> {
    const { rows } = await client.query(
      `SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return rows.map(this.mapRow);
  }

  async show(id: number, userId: number): Promise<Task | null> {
    const { rows } = await client.query(
      `SELECT * FROM tasks WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    return rows[0] ? this.mapRow(rows[0]) : null;
  }

  async create(userId: number, form: TaskForm): Promise<Task> {
    const { rows } = await client.query(
      `INSERT INTO tasks (user_id, title, description, status, priority, due_date, completed)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        userId,
        form.title,
        form.description ?? null,
        form.status,
        form.priority,
        form.dueDate ?? null,
        form.completed,
      ]
    );
    return this.mapRow(rows[0]);
  }

  async update(id: number, userId: number, form: Partial<TaskForm>): Promise<Task | null> {
    const fields: string[] = [];
    const values: (string | number | boolean | null)[] = [];
    let i = 1;

    if (form.title !== undefined)       { fields.push(`title = $${i++}`);       values.push(form.title); }
    if (form.description !== undefined) { fields.push(`description = $${i++}`); values.push(form.description ?? null); }
    if (form.status !== undefined)      { fields.push(`status = $${i++}`);      values.push(form.status); }
    if (form.priority !== undefined)    { fields.push(`priority = $${i++}`);    values.push(form.priority); }
    if (form.dueDate !== undefined)     { fields.push(`due_date = $${i++}`);    values.push(form.dueDate ?? null); }
    if (form.completed !== undefined)   { fields.push(`completed = $${i++}`);   values.push(form.completed); }

    fields.push(`updated_at = NOW()`);
    values.push(id, userId);

    const { rows } = await client.query(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${i} AND user_id = $${i + 1} RETURNING *`,
      values
    );
    return rows[0] ? this.mapRow(rows[0]) : null;
  }

  async delete(id: number, userId: number): Promise<Task | null> {
    const { rows } = await client.query(
      `DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );
    return rows[0] ? this.mapRow(rows[0]) : null;
  }

  private mapRow(row: Record<string, unknown>): Task {
    return {
      id: row.id as number,
      userId: row.user_id as number,
      title: row.title as string,
      description: (row.description as string | null) ?? undefined,
      status: row.status as Task['status'],
      priority: row.priority as Task['priority'],
      dueDate: row.due_date ? new Date(row.due_date as string).toISOString().slice(0, 10) : null,
      completed: row.completed as boolean,
      createdAt: row.created_at as Date,
      updatedAt: row.updated_at as Date,
    };
  }
}
