import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    //User's name
    name: {
        type:String,
        required:true,
        trim:true
    },
    //email which is used to login, and it needs to be unique
    email: {
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    //password which should be hashed
    password: {
        type:String,
        required:true
    }
});
//encrypt password
const encryptPassword = async (password)=>{
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    return password;
}
//Before saving password make sure to encrypt it
userSchema.pre('save', async function(next) {
    try {
        // Check if the password has been modified
        if (!this.isModified('password')) return next();

        this.password = await encryptPassword(this.password);

        next(); // Proceed to save
    } catch (error) {
        next(error); // Pass any errors to the next middleware
    }
});
//Function to check if password is valid
userSchema.methods.isValidPassword = async function(password) {
    try {
        // Compare provided password with stored hash
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

const Users = mongoose.model('users', userSchema);

export { Users, userSchema, encryptPassword }