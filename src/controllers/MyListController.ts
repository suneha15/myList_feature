import { Request, Response, NextFunction } from 'express';
import { IMyListService } from '../services/interfaces/IMyListService';
import {
  AddToMyListRequestDto,
  RemoveFromMyListRequestDto,
  ListMyItemsQueryDto,
  PaginatedMyListResponseDto,
  toPaginatedMyListResponseDto,
  ErrorResponseDto,
  SuccessResponseDto,
} from '../dtos/myList.dto';
import {
  ContentNotFoundError,
  DuplicateItemError,
  ItemNotFoundError,
  UserNotFoundError,
} from '../services/MyListService';
import { logger } from '../config/logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * MyList Controller
 * Handles HTTP requests for MyList endpoints
 * Transforms between HTTP layer and service layer
 */
export class MyListController {
  constructor(private myListService: IMyListService) {}

  /**
   * Add item to MyList
   * POST /api/v1/my-list/items
   */
  addToMyList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const traceId = uuidv4();
    const userId = (req as any).userId; // Set by auth middleware

    try {
      const request: AddToMyListRequestDto = {
        contentId: req.body.contentId,
        contentType: req.body.contentType,
      };

      await this.myListService.addToMyList(userId, request);

      const response: SuccessResponseDto = {
        success: true,
        message: 'Item added to MyList successfully',
        data: {
          contentId: request.contentId,
          contentType: request.contentType,
        },
      };

      logger.info('Item added to MyList', {
        userId,
        contentId: request.contentId,
        contentType: request.contentType,
        traceId,
      });

      res.status(201).json(response);
    } catch (error) {
      next(this.handleError(error, traceId, 'addToMyList'));
    }
  };

  /**
   * Remove item from MyList
   * DELETE /api/v1/my-list/items/:contentId
   */
  removeFromMyList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const traceId = uuidv4();
    const userId = (req as any).userId; // Set by auth middleware

    try {
      const request: RemoveFromMyListRequestDto = {
        contentId: req.params.contentId,
      };

      await this.myListService.removeFromMyList(userId, request);

      logger.info('Item removed from MyList', {
        userId,
        contentId: request.contentId,
        traceId,
      });

      res.status(204).send(); // No Content
    } catch (error) {
      next(this.handleError(error, traceId, 'removeFromMyList'));
    }
  };

  /**
   * Get user's MyList with pagination
   * GET /api/v1/my-list/items
   */
  getMyList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const traceId = uuidv4();
    const userId = (req as any).userId; // Set by auth middleware

    try {
      const query: ListMyItemsQueryDto = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        contentType: req.query.contentType as any,
      };

      const result = await this.myListService.getMyList(userId, query);
      const response: PaginatedMyListResponseDto = toPaginatedMyListResponseDto(result);

      logger.info('Retrieved MyList', {
        userId,
        page: query.page || 1,
        limit: query.limit || 10,
        itemCount: response.data.length,
        traceId,
      });

      res.status(200).json(response);
    } catch (error) {
      next(this.handleError(error, traceId, 'getMyList'));
    }
  };

  /**
   * Error handler
   * Maps service errors to HTTP status codes and error responses
   */
  private handleError(error: unknown, traceId: string, operation: string): Error {
    const errorResponse: ErrorResponseDto = {
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
        traceId,
      },
    };

    // Handle known service errors
    if (error instanceof ContentNotFoundError) {
      errorResponse.error = {
        code: 'CONTENT_NOT_FOUND',
        message: error.message,
        traceId,
      };
      (error as any).statusCode = 404;
      (error as any).errorResponse = errorResponse;
      return error as Error;
    }

    if (error instanceof DuplicateItemError) {
      errorResponse.error = {
        code: 'DUPLICATE_ITEM',
        message: error.message,
        traceId,
      };
      (error as any).statusCode = 409; // Conflict
      (error as any).errorResponse = errorResponse;
      return error as Error;
    }

    if (error instanceof ItemNotFoundError) {
      errorResponse.error = {
        code: 'ITEM_NOT_FOUND',
        message: error.message,
        traceId,
      };
      (error as any).statusCode = 404;
      (error as any).errorResponse = errorResponse;
      return error as Error;
    }

    if (error instanceof UserNotFoundError) {
      errorResponse.error = {
        code: 'USER_NOT_FOUND',
        message: error.message,
        traceId,
      };
      (error as any).statusCode = 404;
      (error as any).errorResponse = errorResponse;
      return error as Error;
    }

    // Handle validation errors
    if ((error as any).details) {
      errorResponse.error = {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: (error as any).details,
        traceId,
      };
      (error as any).statusCode = 400;
      (error as any).errorResponse = errorResponse;
      return error as Error;
    }

    // Unknown error
    logger.error('Unexpected error in MyListController', {
      operation,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      traceId,
    });

    (error as any).statusCode = 500;
    (error as any).errorResponse = errorResponse;
    return error as Error;
  }
}

