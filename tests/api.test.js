import request from 'supertest';
import { connectDBForTesting, disconnectDBForTesting } from './test_db_connect.js';
import { Users } from '../data/user_model.js';
import { Notes } from '../data/note_model.js';
import app from '../app.js';
import mongoose from "mongoose";

describe('Auth Endpoints', () => {
  beforeAll(async ()=>{
    await connectDBForTesting();
  });
  afterAll(async ()=>{
    await Users.collection.drop();
    await Notes.collection.drop();
    await disconnectDBForTesting();
  });

  let user_id = null;
  let accessToken = null;
  let authorization = null;
  let note_id = null;

  test('Test signup', async () => {
    const [name,email,password] = ['John Doe','jdoe@test.com','Password123!'];
    const res = await request(app)
      .post('/api/auth/signup')
      .send({name, email, password});

    expect(res.statusCode).toBe(200)
    expect(res.body.name).toBe(name);
  });

  test('Test login', async () => {
    const [email,password] = ['jdoe@test.com','Password123!'];
    const res = await request(app)
      .post('/api/auth/login')
      .send({email, password})
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBeDefined();
    expect(res.body.accessToken).toBeDefined();
    user_id = res.body.id;
    accessToken = res.body.accessToken;
    authorization = {Authorization:`Bearer ${accessToken}`};
  });

  test('Create Note', async () => {
    const [title,content,keywords] = ['Title','Big content',['word']];
    const res = await request(app)
      .post('/api/notes')
      .send({title,content,keywords})
      .set(authorization);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(title);
    expect(res.body._id).toBeDefined();

    note_id = res.body._id;
  });

  test('Unauthorized get all notes', async () => {
    const res = await request(app)
      .get('/api/notes');

    expect(res.statusCode).toBe(401);
  });
  test('Authorized get all notes', async () => {
    const res = await request(app)
      .get('/api/notes')
      .set(authorization);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Get individual note', async () => {
    const res = await request(app)
      .get(`/api/notes/${note_id}`)
      .set(authorization);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBeDefined();
  });

  test('Update note', async () => {
    const [id,title,content,keywords] = [note_id,'Bigger Title','More big content',['word']];
    const res = await request(app)
      .put('/api/notes/')
      .send({id,title,content,keywords})
      .set(authorization);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(title);
    expect(res.body.content).toBe(content);
  });

  test('Share note', async () => {
    const user_id2 = new mongoose.Types.ObjectId();
    const res = await request(app)
      .post(`/api/notes/${note_id}/${user_id2}`)
      .set(authorization);

    expect(res.statusCode).toBe(200);
    expect(res.body.shared).toContainEqual(user_id2.toString());
  });

  test('Search note by word', async () => {
    const search = 'word';
    const res = await request(app)
      .get(`/api/search?q=${search}`)
      .set(authorization);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Delete note', async () => {
    const res = await request(app)
      .delete(`/api/notes`)
      .send({id:note_id})
      .set(authorization);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBeDefined();
  });

})