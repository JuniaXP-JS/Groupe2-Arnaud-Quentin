// src/config/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';

/**
 * Swagger configuration module for API documentation.
 * This module sets up OpenAPI 3.0 specification using swagger-jsdoc.
 * The generated documentation is served through Swagger UI at /api-docs endpoint.
 */

/**
 * Configuration options for swagger-jsdoc.
 * Defines the OpenAPI specification structure and file paths to scan for API documentation.
 */
const swaggerOptions: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'IoT GPS Tracking API',
            version: '1.0.0',
            description: 'RESTful API for managing GPS data from IoT devices with user authentication',
            contact: {
                name: 'API Support',
                email: 'support@example.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'connect.sid',
                    description: 'Session-based authentication using cookies'
                }
            }
        },
        security: [
            {
                cookieAuth: []
            }
        ]
    },
    apis: ['./src/routes/*.ts'], // Paths to files containing OpenAPI definitions
};

/**
 * Generated Swagger specification object.
 * This object contains the complete OpenAPI specification that will be used by Swagger UI
 * to generate the interactive API documentation interface.
 * 
 * @type {object} The complete OpenAPI 3.0 specification
 */
const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
