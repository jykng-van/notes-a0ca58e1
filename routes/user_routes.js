import express from "express";
import UserService from '../service/user_service.js';

const UserRouter = express.Router();

//get all users
UserRouter.get('/', async (req, res)=>{
    const users = await UserService.getAllUsers();
    res.send(users);
});
//gets a user
UserRouter.get('/:id', async (req, res)=>{
    const id = req.params.id;
    const user = await UserService.getUser(id);
    res.send(user);
});
/**
 * Signup function
 * @var req.body JSON {name, email, password}
 * @returns {name, email, _id}
 */
UserRouter.post('/signup', async (req, res)=>{
    try{
        const input = req.body;
        console.log(input);
        const new_user = await UserService.createUser(input);
        res.send(new_user);
    }catch(err){
        res.status(500).send({error:err.message});
    }
});
/**
 * Login function
 * @var req.body JSON {email, password}
 * @returns {accessToken, id}
 */
UserRouter.post('/login', async (req, res)=>{
    try{
        const input = req.body;
        console.log(input);
        const token = await UserService.loginUser(input);
        res.send(token);
    }catch(err){
        console.error(err);
        res.status(401).send({error:'Login invalid'});
    }
});

export default UserRouter;