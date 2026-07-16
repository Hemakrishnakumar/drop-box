import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import type { GraphqlContext } from 'src/common/types/common';
import { SessionService } from 'src/modules/auth/services/session.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class SessionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly sessionService: SessionService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (context.getType<string>() !== 'graphql') {
            return true;
        }

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const graphqlContext = GqlExecutionContext.create(context).getContext<GraphqlContext>();
        const sessionId = this.getCookieValue(graphqlContext.req.headers.cookie, 'sessionId');

        if (!sessionId) {
            throw new UnauthorizedException('Authentication is required.');
        }

        const session = await this.sessionService.get(sessionId);

        if (!session) {
            throw new UnauthorizedException('Session has expired or is invalid.');
        }

        graphqlContext.userId = session.userId;
        return true;
    }

    private getCookieValue(cookie: string | undefined, name: string): string | undefined {
        if (!cookie) {
            return undefined;
        }

        const value = cookie
            .split(';')
            .map((part) => part.trim().split('='))
            .find(([key]) => key === name)?.[1];

        return value ? decodeURIComponent(value) : undefined;
    }
}
