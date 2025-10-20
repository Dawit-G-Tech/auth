import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, email, password } = req.body || {};
		if (!name || !email || !password) {
			return next({ status: 400, code: 'VALIDATION_ERROR', message: 'Name, email and password are required.' });
		}
		const user = await AuthService.register({ name, email, password });
		return res.status(201).json({ success: true, data: { user } });
	} catch (err) {
		return next(err);
	}
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password } = req.body || {};
		if (!email || !password) {
			return next({ status: 400, code: 'VALIDATION_ERROR', message: 'Email and password are required.' });
		}
		const result = await AuthService.login({ email, password });
		return res.json({ success: true, data: result });
	} catch (err) {
		return next(err);
	}
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { refreshToken } = req.body || {};
		if (!refreshToken) {
			return next({ status: 400, code: 'VALIDATION_ERROR', message: 'refreshToken is required.' });
		}
		const result = await AuthService.refresh(refreshToken);
		return res.json({ success: true, data: result });
	} catch (err) {
		return next(err);
	}
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { refreshToken } = req.body || {};
		if (!refreshToken) {
			return next({ status: 400, code: 'VALIDATION_ERROR', message: 'refreshToken is required.' });
		}
		await AuthService.logout(refreshToken);
		return res.json({ success: true, data: { loggedOut: true } });
	} catch (err) {
		return next(err);
	}
};


