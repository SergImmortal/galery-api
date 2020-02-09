import {Schema, model, Document} from 'mongoose';
import bcrypt from 'bcryptjs';

type validPassword = (password: string) => any;

export type UserDocument = Document & {
    email: string
    password: string,
    role: string,
    validPassword: validPassword
};

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    } 
});

userSchema.methods.validPassword = function(password: string) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.pre('save', function(next) {
    const user = this as UserDocument;

    if (!user.isModified('password')) return next();
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(12))
    console.log(user.password);
    return next();
});

const User = model('users', userSchema);
export default User;