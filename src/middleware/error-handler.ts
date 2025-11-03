import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../types/errors.js';
import { config } from '../config/index.js';

export async function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  request.log.error(error);

  if (error instanceof AppError) {
    await reply.status(error.statusCode).send({
      error: {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
      },
    });
    return;
  }

  // Handle Fastify validation errors
  if (error.validation) {
    await reply.status(400).send({
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        statusCode: 400,
        details: error.validation,
      },
    });
    return;
  }

  // Default error response
  const statusCode = error.statusCode || 500;
  const message = config.isProduction
    ? 'Internal server error'
    : error.message;

  await reply.status(statusCode).send({
    error: {
      message,
      code: 'INTERNAL_ERROR',
      statusCode,
      ...(config.isDevelopment && { stack: error.stack }),
    },
  });
}

