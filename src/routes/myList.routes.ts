import { Router } from 'express';
import { MyListController } from '../controllers/MyListController';
import { ServiceFactory } from '../services';
import { validate, addToMyListRequestSchema, listMyItemsQuerySchema } from '../dtos/validators';

/**
 * MyList Routes
 * Defines all routes for MyList feature
 * 
 * Routes:
 * - POST   /api/v1/my-list/items          - Add item to list
 * - DELETE /api/v1/my-list/items/:contentId - Remove item from list
 * - GET    /api/v1/my-list/items          - Get paginated list
 */

const router = Router();

// Initialize controller with service
let myListController: MyListController | null = null;

/**
 * Initialize controller (lazy initialization)
 * This ensures services are initialized before routes are used
 */
async function getController(): Promise<MyListController> {
  if (!myListController) {
    const myListService = await ServiceFactory.getMyListService();
    myListController = new MyListController(myListService);
  }
  return myListController;
}

/**
 * POST /api/v1/my-list/items
 * Add item to user's MyList
 * 
 * Request Body:
 * {
 *   "contentId": "movie-1",
 *   "contentType": "Movie"
 * }
 * 
 * Response: 201 Created
 * {
 *   "success": true,
 *   "message": "Item added to MyList successfully",
 *   "data": {
 *     "contentId": "movie-1",
 *     "contentType": "Movie"
 *   }
 * }
 * 
 * Errors:
 * - 400 Bad Request: Validation error
 * - 404 Not Found: Content or User not found
 * - 409 Conflict: Item already exists
 * - 500 Internal Server Error: Server error
 */
router.post(
  '/items',
  async (req, _res, next) => {
    try {
      // Validate request body
      const validatedBody = validate(addToMyListRequestSchema, req.body);
      req.body = validatedBody;
      next();
    } catch (error) {
      next(error);
    }
  },
  async (req, res, next) => {
    try {
      const controller = await getController();
      await controller.addToMyList(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/v1/my-list/items/:contentId
 * Remove item from user's MyList
 * 
 * Path Parameters:
 * - contentId: Content ID to remove
 * 
 * Response: 204 No Content
 * 
 * Errors:
 * - 404 Not Found: Item not found in list
 * - 500 Internal Server Error: Server error
 */
router.delete(
  '/items/:contentId',
  async (req, res, next) => {
    try {
      const controller = await getController();
      await controller.removeFromMyList(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/v1/my-list/items
 * Get user's MyList with pagination
 * 
 * Query Parameters:
 * - page: Page number (default: 1, min: 1)
 * - limit: Items per page (default: 10, min: 1, max: 100)
 * - contentType: Filter by content type (optional: "Movie" | "TVShow")
 * 
 * Response: 200 OK
 * {
 *   "data": [
 *     {
 *       "contentId": "movie-1",
 *       "contentType": "Movie",
 *       "title": "The Matrix",
 *       "description": "...",
 *       "genres": ["Action", "SciFi"],
 *       "addedAt": "2024-01-10T00:00:00.000Z",
 *       "releaseDate": "1999-03-31T00:00:00.000Z",
 *       "director": "Lana Wachowski, Lilly Wachowski",
 *       "actors": ["Keanu Reeves", ...]
 *     }
 *   ],
 *   "pagination": {
 *     "page": 1,
 *     "limit": 10,
 *     "total": 25,
 *     "totalPages": 3,
 *     "hasNextPage": true,
 *     "hasPreviousPage": false
 *   }
 * }
 * 
 * Errors:
 * - 400 Bad Request: Validation error
 * - 500 Internal Server Error: Server error
 */
router.get(
  '/items',
  async (req, _res, next) => {
    try {
      // Validate query parameters
      const validatedQuery = validate(listMyItemsQuerySchema, req.query);
      req.query = validatedQuery as any;
      next();
    } catch (error) {
      next(error);
    }
  },
  async (req, res, next) => {
    try {
      const controller = await getController();
      await controller.getMyList(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

export default router;

