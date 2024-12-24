// Currently there are 2 approaches for using users field in Request
// - implementing CustomRequest under jwtVerify
// - extend base Request to have new user field (user > userId)
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };
    }
  }
}

export {};
