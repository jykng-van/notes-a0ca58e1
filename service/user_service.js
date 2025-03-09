import { Users } from '../data/user_model.js';
import jwt from 'jsonwebtoken';

const UserService = {
    //gets all users
    getAllUsers: async ()=>{
        try{
            const users = await Users.find({}).select('-password');
            return users;
        }catch(error){
            throw new Error(error);
        }
    },
    //get a user
    getUser: async (id)=>{
        try{
            return Users.findById(id).select('-password');
        }catch(error){
            throw new Error(error);
        }
    },
    //creates a new user
    createUser: async (input)=>{
        try{
            const user = {
                name:input.name,
                email:input.email,
                password:input.password,
            };
            const new_user = await Users.create(user);
            const user_output = await Users.findById(new_user.id).select('-password'); //result without password
            return user_output;
        }catch(error){
            throw new Error(error.message);
        }
    },
    //authenticates a user with an Access Token
    loginUser: async (input)=>{
        try{
            const email = input.email;
            const password = input.password;
            const user = await Users.findOne({ email });
            const jwt_secret = process.env.JWT_SECRET;
            if (user){
                const valid = await user.isValidPassword(password);
                if (valid){
                    console.log('Login is correct!');
                    //Build JWT token
                    let jwtToken = jwt.sign(
                        {
                            email: user.email,
                            id: user.id
                        },
                        //Signign the token with the JWT_SECRET in the .env
                        jwt_secret,
                        {
                            expiresIn: "1h"
                        }
                    )
                    return {
                        accessToken: jwtToken,
                        id: user.id, //probably not necessary because token has user id
                    };
                }else{
                    throw new Error('Password is not valid');
                }
            }else{
                throw new Error('User not found');
            }
        }catch(error){
            throw new Error(error.message);
        }
    }
}
export default UserService;