import express from "express";
import NoteService from "../service/note_service.js";

const NoteRouter = express.Router();

/**
 * Lists all notes from user
 * @returns [{note}]
 */
NoteRouter.get('/', async (req, res)=>{
    try{
        const id = req.userData.id;
        const notes = await NoteService.getAllNotes(id);
        res.send(notes);
    }catch(err){
        res.status(500).send({error:err.message});
    }
});
/**
 * Show a note by id, if it's either one of the user's notes or one shared to the user
 * @returns [{note}]
 */
NoteRouter.get('/:id', async (req, res)=>{
    try{
        const id = req.params.id;
        const user_id = req.userData.id;
        const note = await NoteService.getNote(id, user_id);
        res.send(note);
    }catch(err){
        res.status(500).send({error:err.message});
    }
});
/**
 * Creates a new note
 */
NoteRouter.post('/', async (req, res)=>{
    try{
        const id = req.userData.id;
        const input = req.body;
        const note = await NoteService.createNote(id, input);
        res.send(note);
    }catch(err){
        res.status(500).send({error:err.message});
    }
});
/**
 * updates one of the user's note
 */
NoteRouter.put('/', async (req, res)=>{
    try{
        const id = req.userData.id;
        const input = req.body;
        const note = await NoteService.updateNote(id, input);
        res.send(note);
    }catch(err){
        res.status(500).send({error:err.message});
    }
});
/**
 * deletes one of the user's notes by id
 */
NoteRouter.delete('/', async (req, res)=>{
    try{
        const note_id = req.body.id;
        const user_id = req.userData.id;
        const result = await NoteService.deleteNote(note_id, user_id);
        res.send(result);
    }catch(err){
        res.status(500).send({error:err.message});
    }
});
/**
 * Shares note with another user
 * @return {note}
 */
NoteRouter.post('/:id/:share', async (req, res)=>{
    try{
        const user_id = req.userData.id;
        const note_id = req.params.id;
        const share = req.params.share;
        console.log(share);
        const note = await NoteService.shareNote(note_id, user_id, share);
        res.send(note);
    }catch(err){
        res.status(500).send({error:err.message});
    }
});


export default NoteRouter;