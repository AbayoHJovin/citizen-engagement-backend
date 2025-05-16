"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const result = await (0, auth_service_1.registerUser)(name, email, password);
        res.status(201).json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await (0, auth_service_1.loginUser)(email, password);
        res.status(200).json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.login = login;
