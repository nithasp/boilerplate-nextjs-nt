import { TaskForm } from '../../types/task.types';
import { TaskStore } from '../../models/task';
import { UserStore } from '../../models/user';

const taskStore = new TaskStore();
const userStore = new UserStore();

describe('Task Model', () => {
  const testUser = {
    firstName: 'Task',
    lastName: 'Owner',
    username: 'taskowner_' + Date.now(),
    password: 'password123',
  };

  const testTask: TaskForm = {
    title: 'Sample task',
    description: 'A demo task for the model test',
    status: 'todo',
    priority: 'medium',
    dueDate: '2030-01-01',
    completed: false,
  };

  let userId: number;
  let taskId: number;

  beforeAll(async () => {
    const created = await userStore.create(testUser);
    userId = created.id as number;
  });

  it('should have a getByUser method', () => {
    expect(taskStore.getByUser).toBeDefined();
  });

  it('should have a show method', () => {
    expect(taskStore.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(taskStore.create).toBeDefined();
  });

  it('should have an update method', () => {
    expect(taskStore.update).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(taskStore.delete).toBeDefined();
  });

  it('create method should add a task', async () => {
    const result = await taskStore.create(userId, testTask);
    expect(result.title).toBe(testTask.title);
    expect(result.status).toBe(testTask.status);
    expect(result.priority).toBe(testTask.priority);
    expect(result.userId).toBe(userId);
    taskId = result.id as number;
  });

  it('getByUser method should return tasks for the user', async () => {
    const result = await taskStore.getByUser(userId);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].userId).toBe(userId);
  });

  it('show method should return the correct task', async () => {
    const result = await taskStore.show(taskId, userId);
    expect(result?.id).toBe(taskId);
    expect(result?.title).toBe(testTask.title);
  });

  it('update method should update task information', async () => {
    const result = await taskStore.update(taskId, userId, {
      status: 'done',
      completed: true,
    });
    expect(result?.status).toBe('done');
    expect(result?.completed).toBe(true);
  });

  it('delete method should remove the task', async () => {
    const result = await taskStore.delete(taskId, userId);
    expect(result?.id).toBe(taskId);
    const after = await taskStore.show(taskId, userId);
    expect(after).toBeNull();
  });
});
