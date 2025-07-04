const { Schema, model } = require('mongoose');

// Define user schema
const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },  // plain text password (not secure)
    role: { type: String, default: 'user' },
    profileImage: String,
    bio: { type: String, maxlength: 200 },
    profession: String,
    createdAt: { type: Date, default: Date.now }
});

// Pre-save hook removed – no password hashing

// Plain text password comparison (not secure)
userSchema.methods.comparePassword = function (candidatePassword) {
    return candidatePassword === this.password;
};

// Create and export the User model
const User = model('User', userSchema);
module.exports = User;
