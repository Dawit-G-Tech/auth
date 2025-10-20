// Extend Express types to include user on Request
// ... existing code ...
declare namespace Express {
	interface UserContext {
		id: string;
		email: string;
		role: string;
	}
	interface Request {
		user?: UserContext;
	}
}
// ... existing code ...
