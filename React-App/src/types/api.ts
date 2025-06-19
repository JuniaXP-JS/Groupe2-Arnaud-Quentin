// Types for API requests and responses

// Generic type for API responses
export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
}

// Types for API errors
export interface ApiError {
    message: string;
    status: number;
    code?: string;
}

// Types for authentication requests
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name?: string;
}

// Types for authentication responses
export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name?: string;
    };
}

// Types for GPS data
export interface GpsDataResponse {
    id: number;
    updatedAt: number;
    latitude: number;
    longitude: number;
    accuracy: number;
    imei: string;
}

// Types for pagination requests
export interface PaginationParams {
    page: number;
    limit: number;
    sort?: string;
    order?: 'asc' | 'desc';
}

// Types for paginated responses
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}