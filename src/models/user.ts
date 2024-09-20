import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
    username: string;
    password: string;
    passwordUpdatedAt: Date,
    email: string;
    createdAt: Date; 
    role: string; 
}

const generateRandomUsername = () => {
    const randomSuffix = Math.floor(Math.random() * 1000); // Generate random number
    return `user_${randomSuffix}`;
};

const userSchema: Schema<IUser> = new Schema({
    username: {
        type: String,
        default: generateRandomUsername()
    },
    password: {
        type: String,
        required: true, 
    },

    passwordUpdatedAt: {
        type: Date,
        require: true
    },
    email: {
        type: String,
        required: true, 
    },
    createdAt: {
        type: Date,
        default: Date.now, 
    },
    role: {
        type: String,
        default: "member"
    }
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;