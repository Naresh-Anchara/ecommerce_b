const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

// Define user schema
const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    profileImage: String,
    bio: { type: String, maxlength: 200 },
    profession: String,
    createdAt: { type: Date, default: Date.now }
});

// Pre-save middleware for hashing passwords
userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

//match password
userSchema.methods.comparePassword = function (cadidatePassword){
    return bcrypt.compare(cadidatePassword,this.password);
}

// Create and export the User model
const User = model('User', userSchema);
module.exports = User;
