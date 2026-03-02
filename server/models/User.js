const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        minlength: 6,
        select: false // Don't return password by default in queries
        // Not required — Google users won't have a password
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // allows multiple docs with null googleId
    },
    avatar: {
        type: String,
        default: '' // Optional profile picture URL
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Hash password before saving (Mongoose 9: async hooks don't receive 'next')
userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) return;
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password in DB
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) return false; // Google-only users have no password
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

