"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_github2_1 = require("passport-github2");
const models_1 = require("../../models");
const { User, Role } = models_1.db;
// Google OAuth Strategy
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:4000/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Google OAuth Strategy - Profile:', profile);
        console.log('Google OAuth Strategy - Access Token:', accessToken);
        // Check if user already exists with this Google ID
        let user = await User.findOne({ where: { googleId: profile.id } });
        if (user) {
            return done(null, user);
        }
        // Check if user exists with same email
        user = await User.findOne({ where: { email: profile.emails?.[0]?.value } });
        if (user) {
            // Link Google account to existing user
            user.googleId = profile.id;
            user.avatar = profile.photos?.[0]?.value;
            user.provider = 'google';
            await user.save();
            return done(null, user);
        }
        // Create new user
        const role = await Role.findOne({ where: { name: 'user' } });
        const newUser = await User.create({
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value,
            provider: 'google',
            roleId: role?.id
        });
        return done(null, newUser);
    }
    catch (error) {
        return done(error, false);
    }
}));
// GitHub OAuth Strategy
passport_1.default.use(new passport_github2_1.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:4000/api/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('GitHub OAuth Strategy - Profile:', profile);
        console.log('GitHub OAuth Strategy - Access Token:', accessToken);
        // Check if user already exists with this GitHub ID
        let user = await User.findOne({ where: { githubId: profile.id } });
        if (user) {
            return done(null, user);
        }
        // Check if user exists with same email
        user = await User.findOne({ where: { email: profile.emails?.[0]?.value } });
        if (user) {
            // Link GitHub account to existing user
            user.githubId = profile.id;
            user.avatar = profile.photos?.[0]?.value;
            user.provider = 'github';
            await user.save();
            return done(null, user);
        }
        // Create new user
        const role = await Role.findOne({ where: { name: 'user' } });
        const newUser = await User.create({
            name: profile.displayName || profile.username,
            email: profile.emails?.[0]?.value,
            githubId: profile.id,
            avatar: profile.photos?.[0]?.value,
            provider: 'github',
            roleId: role?.id
        });
        return done(null, newUser);
    }
    catch (error) {
        return done(error, false);
    }
}));
// Serialize user for session
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
// Deserialize user from session
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id, { include: [Role] });
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
});
exports.default = passport_1.default;
