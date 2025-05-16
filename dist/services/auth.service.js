"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const client_1 = require("@prisma/client");
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
const prisma = new client_1.PrismaClient();
const registerUser = async (name, email, password) => {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
        throw new Error('Email already registered');
    const hashed = await (0, hash_1.hashPassword)(password);
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashed,
            role: 'CITIZEN'
        }
    });
    const token = (0, jwt_1.generateToken)(user.id, user.role);
    return { user, token };
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
        throw new Error('Invalid credentials');
    const match = await (0, hash_1.comparePasswords)(password, user.password);
    if (!match)
        throw new Error('Invalid credentials');
    const token = (0, jwt_1.generateToken)(user.id, user.role);
    return { user, token };
};
exports.loginUser = loginUser;
