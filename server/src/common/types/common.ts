import { Request, Response } from 'express';

export interface GraphqlContext {
    req: Request;
    res: Response;
    userId?: string;
}

export interface AuthenticatedGraphqlContext extends Omit<GraphqlContext, 'userId'> {
    userId: string;
}
