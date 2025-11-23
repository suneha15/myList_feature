import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { validate, formatValidationError } from '../dtos/validators';
import { logger } from '../config/logger';

/**
 * Validation Middleware Factory
 * Creates middleware to validate request data against a Joi schema
 * 
 * @param schema - Joi validation schema
 * @param source - Where to get data from ('body', 'query', 'params')
 * @returns Express middleware function
 */
export function validateRequest(
  schema: Joi.Schema,
  source: 'body' | 'query' | 'params' = 'body'
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = source === 'body' ? req.body : source === 'query' ? req.query : req.params;
      
      // Validate and transform data
      const validated = validate(schema, data);
      
      // Replace original data with validated data
      if (source === 'body') {
        req.body = validated;
      } else if (source === 'query') {
        req.query = validated as any;
      } else {
        req.params = validated as any;
      }

      next();
    } catch (error) {
      const validationError = formatValidationError(error);
      
      logger.warn('Validation failed', {
        source,
        path: req.path,
        errors: validationError.details,
      });

      res.status(400).json({
        error: {
          ...validationError,
          traceId: (req as any).traceId,
        },
      });
    }
  };
}

/**
 * Validate request body
 */
export function validateBody(schema: Joi.Schema) {
  return validateRequest(schema, 'body');
}

/**
 * Validate query parameters
 */
export function validateQuery(schema: Joi.Schema) {
  return validateRequest(schema, 'query');
}

/**
 * Validate path parameters
 */
export function validateParams(schema: Joi.Schema) {
  return validateRequest(schema, 'params');
}

