import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';
import { connectDBForTesting, disconnectDBForTesting } from './test_db_connect.js'
import { Notes } from '../data/note_model.js';
import NoteService from '../service/note_service.js';
import mongoose from "mongoose";

const user_id = new mongoose.Types.ObjectId(); //primary user
const user_id2 = new mongoose.Types.ObjectId(); //secondary user

describe('Notes tests', ()=>{
    beforeAll(async ()=>{
        await connectDBForTesting();
    });
    afterAll(async ()=>{
        await Notes.collection.drop();
        await disconnectDBForTesting();
    });

    let note_id = null;
    //this will be the one note that's used again throughout the test
    test('create note',async ()=>{
        const [title,content,keywords] = ['Title','Big content',['word']];
        const note = await NoteService.createNote(user_id,{title, content, keywords});
        expect(note.title).toBe(title);
        expect(note.content).toBe(content);
        expect(Array.isArray(note.keywords)).toBe(true);
        expect(note.user.toString()).toBe(user_id.toString());
        expect(note.id).toBeDefined();
        note_id = note.id;
    });

    test('get notes',async ()=>{
        const notes = await NoteService.getAllNotes(user_id);
        expect(Array.isArray(notes)).toBe(true);
        expect(notes.length).toBeGreaterThan(0);
    });

    test('get individual note',async ()=>{
        const note = await NoteService.getNote(note_id, user_id);
        expect(note.title).toBeDefined();
        expect(note.content).toBeDefined();
        expect(note.keywords).toBeDefined();
    });

    test('update note',async ()=>{
        const [id,title,content,keywords] = [note_id,'Bigger Title','More big content',['word']];
        const note = await NoteService.updateNote(user_id, {id, title, content, keywords});
        expect(note.title).toBe(title);
        expect(note.content).toBe(content);
    });

    test('get individual other user note',async ()=>{
        const note = await NoteService.getNote(note_id, user_id2);
        expect(note).toBeNull();
    });
    test('share note',async ()=>{
        const note = await NoteService.shareNote(note_id, user_id, user_id2);
        expect(note.shared).toContainEqual(user_id2);
    });
    test('get individual other user note, now shared',async ()=>{
        const note = await NoteService.getNote(note_id, user_id2);
        expect(note.title).toBeDefined();
    });

    test('search for note by content',async ()=>{
        const note = await NoteService.searchNotes(user_id, 'content');
        expect(note.length).toBeGreaterThan(0);
    });
    test('search for note by keywords',async ()=>{
        const note = await NoteService.searchNotes(user_id, 'word');
        expect(note.length).toBeGreaterThan(0);
    });
    test('search for note without match',async ()=>{
        const note = await NoteService.searchNotes(user_id, 'asdfasdf');
        expect(note.length).toBe(0);
    });

    test('delete note', async ()=>{
        const deleted = await NoteService.deleteNote(note_id, user_id);
        expect(deleted.message).toBeDefined();

        const note = await NoteService.getNote(note_id, user_id);
        expect(note).toBeNull();
    });
});
