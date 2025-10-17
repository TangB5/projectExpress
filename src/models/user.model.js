import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    postalCode: { type: String, default: "" },
    country: { type: String, default: "" },
});

const preferencesSchema = new mongoose.Schema({
    newsletter: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    emailNotifications: { type: Boolean, default: true },
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: "",
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        default: "",
    },
    password: {
        type: String,
        required: false, // optionnel pour les utilisateurs OAuth ou provisoires
    },
    phone: {
        type: String,
        default: "",
    },
    avatar: {
        type: String,
        default: "",
    },
    address: {
        type: addressSchema,
        default: () => ({}),
    },
    preferences: {
        type: preferencesSchema,
        default: () => ({}),
    },
    roles: {
        type: [String],
        enum: ["user", "admin"],
        default: ["user"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', userSchema);

export default User;
