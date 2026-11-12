import { Catch, ExceptionFilter, ArgumentsHost, NotFoundException } from '@nestjs/common';
import { join } from 'path';
import type { Request, Response } from 'express';

@Catch(NotFoundException)
export class SpaFallbackFilter implements ExceptionFilter {
  constructor(private readonly clientDir: string) {}

  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const path = req.path || '';
    if (path.startsWith('/api') || path.startsWith('/uploads')) {
      const status = exception.getStatus();
      res.status(status).json(exception.getResponse());
      return;
    }
    res.sendFile(join(this.clientDir, 'index.html'));
  }
}
