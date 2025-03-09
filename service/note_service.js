import { Notes } from '../data/note_model.js';

const NoteService = {
    //Gets a single note
    getNote: async (id, user_id)=>{
        try{
            console.log(user_id);
            //find by note id AND then user=user_id OR shared containing user_id
            const note = await Notes.findOne({_id:id, $or:[{user:user_id}, {shared: user_id}]});
            return note;
        }catch(error){
            throw new Error(error);
        }
    },
    //Gets a list of notes
    getAllNotes: async (id)=>{
        try{
            //find users notes OR notes shared with user
            const notes = await Notes.find({$or:[
                {user:id},
                {shared:id}
            ]});
            return notes;
        }catch(error){
            throw new Error(error);
        }
    },
    //creates a new note
    createNote: async (id, input)=>{
        try{
            const note = {
                title:input.title,
                content:input.content,
                keywords:input.keywords,
                user: id
            };
            const new_note = await Notes.create(note);
            const note_result = await Notes.findById(new_note.id);
            return note_result;
        }catch(error){
            throw new Error(error);
        }
    },
    //updates an existing note
    updateNote: async (user_id, input)=>{
        try{
            const query = { _id: input.id, user:user_id };
            const note = {
                title:input.title,
                content:input.content,
                keywords:input.keywords
            };
            const updated = await Notes.findOneAndUpdate(query, input, {new:true});

            return updated;
        }catch(error){
            throw new Error(error);
        }
    },
    //deletes a note
    deleteNote: async (note_id, user_id)=>{
        try{
            await Notes.findOneAndDelete({_id:note_id, user:user_id});
            return {
                id:note_id,
                message:'Note deleted!'
            }
        }catch(error){
            throw new Error(error);
        }
    },
    //shares a note with another user, where it adds the other users id to "shared"
    shareNote: async (note_id, user_id, share)=>{
        try{
            let note = await Notes.findOne({_id:note_id, user:user_id}).select('shared');
            if (note){
                if (!note.shared.includes(share)){ //check if already shared
                    note.shared.push(share);
                }
                console.log(note);
                return await Notes.findOneAndUpdate({_id:note_id}, note, {new: true});
            }else{
                throw new Error('Note not found');
            }

        }catch(error){
            throw new Error(error);
        }
    },
    //searches the notes the user has access to, which is either one the user wrote or is shared with them
    searchNotes: async (user_id, search)=>{
        try{
            console.log(search);
            const notes = await Notes.find({
                $or:[
                    {user:user_id},
                    {shared:user_id}
                ],
                $text:{$search:search} //use text indexes
            });
            return notes;
        }catch(error){
            throw new Error(error);
        }
    }

}
export default NoteService;