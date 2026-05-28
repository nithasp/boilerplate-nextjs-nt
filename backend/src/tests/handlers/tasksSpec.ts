import supertest from 'supertest';
import app from '../../server';

const request = supertest(app);
let token: string;

describe('Task Endpoints', () => {
  const testUser = {
    username: 'taskstest_' + Date.now(),
    password: 'taskstestpass123',
    firstName: 'Tasks',
    lastName: 'Tester',
  };

  beforeAll(async () => {
    const res = await request.post('/auth/register').send(testUser);
    token = res.body.data.accessToken;
  });

  let createdTaskId: number;

  it('POST /tasks should require token', async () => {
    await request.post('/tasks').send({ title: 'No auth' }).expect(401);
  });

  it('GET /tasks should require token', async () => {
    await request.get('/tasks').expect(401);
  });

  it('POST /tasks should create a new task', async () => {
    const response = await request
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Write tests',
        description: 'Cover the tasks CRUD endpoints',
        status: 'in_progress',
        priority: 'high',
        dueDate: '2030-01-01',
        completed: false,
      })
      .expect(201);

    expect(response.body.data).toBeDefined();
    expect(response.body.data.title).toBe('Write tests');
    expect(response.body.data.status).toBe('in_progress');
    expect(response.body.data.priority).toBe('high');
    expect(response.body.data.completed).toBe(false);
    createdTaskId = response.body.data.id;
  });

  it('GET /tasks should return tasks owned by current user', async () => {
    const response = await request
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it('GET /tasks/:id should return a single task', async () => {
    const response = await request
      .get(`/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.data.id).toBe(createdTaskId);
    expect(response.body.data.title).toBe('Write tests');
  });

  it('PUT /tasks/:id should update a task partially', async () => {
    const response = await request
      .put(`/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'done', completed: true })
      .expect(200);

    expect(response.body.data.status).toBe('done');
    expect(response.body.data.completed).toBe(true);
    expect(response.body.data.title).toBe('Write tests');
  });

  it('DELETE /tasks/:id should delete the task', async () => {
    const response = await request
      .delete(`/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.data.id).toBe(createdTaskId);

    await request
      .get(`/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });

  describe('Input Validation', () => {
    it('POST /tasks should return 400 when title is missing', async () => {
      const response = await request
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);
      expect(response.body.message).toBe('title is required and must be a non-empty string');
    });

    it('POST /tasks should return 400 when dueDate format is invalid', async () => {
      const response = await request
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Bad date', dueDate: 'tomorrow' })
        .expect(400);
      expect(response.body.message).toBe('dueDate must be an ISO date string (YYYY-MM-DD)');
    });

    it('GET /tasks/:id should return 400 for invalid id', async () => {
      const response = await request
        .get('/tasks/abc')
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
      expect(response.body.message).toBe('task id must be a valid positive integer');
    });

    it('GET /tasks/:id should return 404 for nonexistent id', async () => {
      const response = await request
        .get('/tasks/99999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
      expect(response.body.message).toBe('Task 99999 not found');
    });

    it('DELETE /tasks/:id should return 404 for nonexistent id', async () => {
      const response = await request
        .delete('/tasks/99999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
      expect(response.body.message).toBe('Task 99999 not found');
    });
  });
});
