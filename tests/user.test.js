import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';
import { connectDBForTesting, disconnectDBForTesting } from './test_db_connect.js'
import { Users, encryptPassword } from '../data/user_model.js';
import UserService from '../service/user_service.js';

describe('Users tests', ()=>{
    beforeAll(async ()=>{
        await connectDBForTesting();
    });
    afterAll(async ()=>{
        await Users.collection.drop();
        await disconnectDBForTesting();
    });

    test('encrypt password', async ()=>{
        const password = 'password';
        const encrypted = await encryptPassword(password);
        expect(encrypted.length).toBeGreaterThan(0);
        expect(encrypted).not.toBe(password);
    });

    let user_id = null;
    test('user signup',async ()=>{
        const [name,email,password] = ['John Doe','jdoe@test.com','Password123!']; //Using the most secure password ever
        const user = await UserService.createUser({name, email, password});
        expect(user.email).toBe(email);
        expect(user.name).toBe(name);
        expect(user.password).toBeUndefined();
        user_id = user.id;
    });
    //user from "user signup" should be created
    test('user login',async ()=>{
        const [email,password] = ['jdoe@test.com','Password123!'];
        const login = await UserService.loginUser({email, password});
        expect(login.accessToken).toBeDefined();
        expect(login.password).toBeUndefined();
    });

    test('get users',async ()=>{
        const users = await UserService.getAllUsers();
        expect(Array.isArray(users)).toBe(true);
    });

    test('get individual user',async ()=>{
        const user = await UserService.getUser(user_id);
        expect(user.id).toBe(user_id);
    });
})