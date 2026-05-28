import { Application, Request, Response } from 'express';
import { TaskStore } from '../models/task';
import { verifyAuthToken } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError, sendSuccess } from '../utils/response';
import { parseId, requireString } from '../utils/validate';
import { TaskPriority, TaskStatus } from '../types/task.types';

const taskStore = new TaskStore();
const VALID_STATUSES = ['todo', 'in_progress', 'done'] as const;
const VALID_PRIORITIES = ['low', 'medium', 'high'] as const;

function parseStatus(val: unknown): TaskStatus {
  return VALID_STATUSES.includes(val as TaskStatus) ? (val as TaskStatus) : 'todo';
}

function parsePriority(val: unknown): TaskPriority {
  return VALID_PRIORITIES.includes(val as TaskPriority) ? (val as TaskPriority) : 'medium';
}

function parseDueDate(val: unknown): string | null {
  if (val === undefined || val === null || val === '') return null;
  if (typeof val !== 'string') throw new AppError('dueDate must be an ISO date string (YYYY-MM-DD)', 400);
  const trimmed = val.trim();
  if (!/^\d{4}-\d{2}-\d{2}/.test(trimmed)) throw new AppError('dueDate must be an ISO date string (YYYY-MM-DD)', 400);
  return trimmed.slice(0, 10);
}

const getTasks = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await taskStore.getByUser(req.user!.userId), 'Tasks fetched.');
});

const getTask = asyncHandler(async (req: Request, res: Response) => {
  const id = parseId(req.params.id, 'task id');
  const task = await taskStore.show(id, req.user!.userId);
  if (!task) throw new AppError(`Task ${id} not found`, 404);
  sendSuccess(res, task, 'Task fetched.');
});

const createTask = asyncHandler(async (req: Request, res: Response) => {
  const userId      = req.user!.userId;
  const title       = requireString(req.body.title, 'title');
  const description = typeof req.body.description === 'string' && req.body.description.trim() ? req.body.description.trim() : undefined;
  const status      = parseStatus(req.body.status);
  const priority    = parsePriority(req.body.priority);
  const dueDate     = parseDueDate(req.body.dueDate);
  const completed   = req.body.completed === true || req.body.completed === 'true';

  sendSuccess(res, await taskStore.create(userId, { title, description, status, priority, dueDate, completed }), 'Task created.', 201);
});

const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const id = parseId(req.params.id, 'task id');

  const form: Record<string, unknown> = {};
  if (req.body.title       !== undefined) form.title       = requireString(req.body.title, 'title');
  if (req.body.description !== undefined) {
    form.description = typeof req.body.description === 'string' && req.body.description.trim() ? req.body.description.trim() : null;
  }
  if (req.body.status      !== undefined) form.status     = parseStatus(req.body.status);
  if (req.body.priority    !== undefined) form.priority   = parsePriority(req.body.priority);
  if (req.body.dueDate     !== undefined) form.dueDate    = parseDueDate(req.body.dueDate);
  if (req.body.completed   !== undefined) form.completed  = req.body.completed === true || req.body.completed === 'true';

  const updated = await taskStore.update(id, userId, form);
  if (!updated) throw new AppError(`Task ${id} not found`, 404);

  sendSuccess(res, updated, 'Task updated.');
});

const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const id = parseId(req.params.id, 'task id');
  const deleted = await taskStore.delete(id, req.user!.userId);
  if (!deleted) throw new AppError(`Task ${id} not found`, 404);
  sendSuccess(res, deleted, 'Task deleted.');
});

const taskRoutes = (app: Application) => {
  app.get('/tasks',        verifyAuthToken, getTasks);
  app.get('/tasks/:id',    verifyAuthToken, getTask);
  app.post('/tasks',       verifyAuthToken, createTask);
  app.put('/tasks/:id',    verifyAuthToken, updateTask);
  app.delete('/tasks/:id', verifyAuthToken, deleteTask);
};

export default taskRoutes;
