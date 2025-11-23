import Joi from 'joi';

/**
 * Validation Schemas using Joi
 * Validates request data before it reaches the service layer
 */

/**
 * Content Type validation
 */
const contentTypeSchema = Joi.string()
  .valid('Movie', 'TVShow')
  .required()
  .messages({
    'any.only': 'contentType must be either "Movie" or "TVShow"',
    'any.required': 'contentType is required',
  });

/**
 * Content ID validation
 * UUID or custom ID format
 */
const contentIdSchema = Joi.string()
  .trim()
  .required()
  .min(1)
  .max(100)
  .messages({
    'string.empty': 'contentId cannot be empty',
    'any.required': 'contentId is required',
    'string.max': 'contentId must be less than 100 characters',
  });

/**
 * Add to MyList Request Validation Schema
 * Validates POST /api/v1/my-list/items request body
 */
export const addToMyListRequestSchema = Joi.object({
  contentId: contentIdSchema,
  contentType: contentTypeSchema,
}).required();

/**
 * Remove from MyList Request Validation Schema
 * Validates DELETE /api/v1/my-list/items/:contentId path parameter
 */
export const removeFromMyListRequestSchema = Joi.object({
  contentId: contentIdSchema,
}).required();

/**
 * List My Items Query Validation Schema
 * Validates GET /api/v1/my-list/items query parameters
 */
export const listMyItemsQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.base': 'page must be a number',
      'number.integer': 'page must be an integer',
      'number.min': 'page must be at least 1',
    }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.base': 'limit must be a number',
      'number.integer': 'limit must be an integer',
      'number.min': 'limit must be at least 1',
      'number.max': 'limit must be at most 100',
    }),
  contentType: Joi.string()
    .valid('Movie', 'TVShow')
    .optional()
    .messages({
      'any.only': 'contentType must be either "Movie" or "TVShow"',
    }),
}).optional();

/**
 * User ID validation (from auth middleware)
 */
export const userIdSchema = Joi.string()
  .trim()
  .required()
  .min(1)
  .messages({
    'string.empty': 'userId cannot be empty',
    'any.required': 'userId is required',
  });

/**
 * Validation helper function
 * Validates data against a schema and returns validated value or throws error
 */
export function validate<T>(schema: Joi.Schema, data: unknown): T {
  const { error, value } = schema.validate(data, {
    abortEarly: false, // Return all errors, not just the first one
    stripUnknown: true, // Remove unknown fields
    convert: true, // Convert types (e.g., string "1" to number 1)
  });

  if (error) {
    const validationError = new Error('Validation failed');
    (validationError as any).details = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.context?.value,
    }));
    throw validationError;
  }

  return value as T;
}

/**
 * Validation middleware helper
 * Creates a validation function for Express middleware
 */
export function createValidator<T>(schema: Joi.Schema) {
  return (data: unknown): T => {
    return validate<T>(schema, data);
  };
}

/**
 * Common validation error formatter
 * Formats Joi validation errors for API response
 */
export function formatValidationError(error: any): {
  code: string;
  message: string;
  details: Array<{ field: string; message: string; value?: any }>;
} {
  if (error.details && Array.isArray(error.details)) {
    return {
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      details: error.details,
    };
  }

  return {
    code: 'VALIDATION_ERROR',
    message: error.message || 'Validation failed',
    details: [],
  };
}

