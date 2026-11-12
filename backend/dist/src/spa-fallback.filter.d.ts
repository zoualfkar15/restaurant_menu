import { ExceptionFilter, ArgumentsHost, NotFoundException } from '@nestjs/common';
export declare class SpaFallbackFilter implements ExceptionFilter {
    private readonly clientDir;
    constructor(clientDir: string);
    catch(exception: NotFoundException, host: ArgumentsHost): void;
}
