import { Router } from 'express';
import { createGpsData, getGpsDataByImei, getAllGpsData } from '../controllers/gps/gps.controller';

/**
 * GPS routes module for handling GPS data endpoints.
 * Defines REST API routes for GPS tracking functionality including:
 * - POST /api/gps - Create GPS data (public endpoint for IoT devices)
 * - GET /api/gps/:imei - Retrieve GPS data by device IMEI (authenticated)
 * - GET /api/gps - Retrieve all GPS data (authenticated)
 * 
 * @module GpsRoutes
 */
const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     GpsData:
 *       type: object
 *       required:
 *         - longitude
 *         - latitude
 *         - imei
 *       properties:
 *         longitude:
 *           type: number
 *           minimum: -180
 *           maximum: 180
 *           description: Longitude coordinate in decimal degrees
 *           example: 3.0573
 *         latitude:
 *           type: number
 *           minimum: -90
 *           maximum: 90
 *           description: Latitude coordinate in decimal degrees
 *           example: 50.6292
 *         imei:
 *           type: string
 *           pattern: '^\d{15}$'
 *           description: Device IMEI identifier (15 digits)
 *           example: "123456789012345"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the record was created
 *           example: "2024-01-15T10:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the record was last updated
 *           example: "2024-01-15T10:30:00.000Z"
 */

/**
 * @swagger
 * /api/gps:
 *   post:
 *     summary: Create new GPS data entry
 *     description: Receives GPS coordinates from IoT devices. This endpoint is public to allow ESP32 devices to send location data.
 *     tags: [GPS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - longitude
 *               - latitude
 *               - imei
 *             properties:
 *               longitude:
 *                 type: number
 *                 minimum: -180
 *                 maximum: 180
 *                 example: 3.0573
 *               latitude:
 *                 type: number
 *                 minimum: -90
 *                 maximum: 90
 *                 example: 50.6292
 *               imei:
 *                 type: string
 *                 pattern: '^\d{15}$'
 *                 example: "123456789012345"
 *     responses:
 *       201:
 *         description: GPS data created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GpsData'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "IMEI must be exactly 15 digits"
 */
router.post('/', createGpsData);

/**
 * @swagger
 * /api/gps/{imei}:
 *   get:
 *     summary: Get GPS data history by device IMEI
 *     description: Retrieves all GPS entries for a specific device, sorted by most recent first. Requires authentication.
 *     tags: [GPS]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: imei
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^\d{15}$'
 *         description: Device IMEI identifier (15 digits)
 *         example: "123456789012345"
 *     responses:
 *       200:
 *         description: GPS data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GpsData'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not authenticated"
 *       500:
 *         description: Internal server error
 */
router.get('/:imei', getGpsDataByImei);

/**
 * @swagger
 * /api/gps:
 *   get:
 *     summary: Get all GPS data from all devices
 *     description: Retrieves GPS entries from all registered devices, sorted by most recent first. Requires authentication. Used for administrative purposes.
 *     tags: [GPS]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: All GPS data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GpsData'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not authenticated"
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllGpsData);

export default router;
