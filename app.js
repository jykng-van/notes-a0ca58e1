/**
 * Everything essential in all environments goes here
 */
import express from 'express';
import jwt from 'jsonwebtoken';
import UserRouter from './routes/user_routes.js';
import NoteRouter from './routes/note_routes.js';
import NoteService from './service/note_service.js';

const app = express();

//use json responses
app.use(express.json());

//authentication middleware, the header should have "Authorization":"Bearer <accessToken>"
app.use((req, res, next) => {
    //allowed paths for where it won't check for the token, because otherwise no one would be able to access
    const no_auth = ['/api/auth/login', '/api/auth/signup'];

    if (no_auth.includes(req.path)){
        console.log('No Auth!');
        next();
    }else{
        try {
            const token = req.headers.authorization.replace("Bearer ", ""); //get rid of "Bearer " so we can have the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET); //verify
            req.userData = decoded; //Adds user data from token to req
            next();
        } catch (err) {
            return res.status(401).json({
                message: "Authentification Failed"
            });
        }
    }
});


//basic test
app.get('/', (req,res)=>{
    res.send('API functions are under /api');
});

//setup sub routes
app.use('/api/auth', UserRouter);
app.use('/api/notes', NoteRouter);

/**
 * Searches the users notes
 * @returns [{note}]
 */
app.get('/api/search', async (req, res)=>{
    try{
        const id = req.userData.id;
        const query = req.query.q;
        const notes = await NoteService.searchNotes(id, query);
        res.send(notes);
    }catch(err){
        res.status(500).send({error:err.message});
    }
});

//because server.js and the tests need to refer to app
export default app;