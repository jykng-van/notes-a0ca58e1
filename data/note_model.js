import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    //note title
    title: {
        type:String,
        required:true,
        trim:true
    },
    //content, meant to be a lot of text
    content: {
        type:String,
        required:true
    },
    //keywords for searching
    keywords: {
        type:[String]
    },
    //user that wrote the note
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref : 'users'
    },
    //other users that the note is being shared with
    shared:{
        type:[mongoose.Schema.Types.ObjectId],
        ref: 'users'
    }
},
{
    timestamps:true
});
//Add text indexing
noteSchema.index({title:'text', content:'text', keywords:'text'});

const Notes = mongoose.model('notes', noteSchema);

export { Notes }