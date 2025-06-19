import User, { IUser } from '../models/user.model';

/**
 * User service containing business logic for user operations.
 * This service acts as an abstraction layer between controllers and the database.
 */

/**
 * Creates a new user in the database
 * @param userData - Partial user data containing at least email and password
 * @returns Promise resolving to the created user document
 * @throws Error if user creation fails or validation errors occur
 */
export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  const user = new User(userData);
  return await user.save();
};

/**
 * Finds a user by their email address
 * @param email - The email address to search for
 * @returns Promise resolving to the user document or null if not found
 */
export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email });
};

/**
 * Finds a user by their unique database ID
 * @param id - The MongoDB ObjectId as a string
 * @returns Promise resolving to the user document or null if not found
 */
export const getUserById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id);
};

/**
 * Updates a user's information
 * @param id - The user's unique identifier
 * @param updateData - Partial user data to update
 * @returns Promise resolving to the updated user document or null if not found
 */
export const updateUser = async (id: string, updateData: Partial<IUser>): Promise<IUser | null> => {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
};

/**
 * Deletes a user from the database
 * @param id - The user's unique identifier
 * @returns Promise resolving to the deleted user document or null if not found
 */
export const deleteUser = async (id: string): Promise<IUser | null> => {
  return await User.findByIdAndDelete(id);
};

/**
 * Checks if a user exists with the given email
 * @param email - The email address to check
 * @returns Promise resolving to true if user exists, false otherwise
 */
export const userExists = async (email: string): Promise<boolean> => {
  const user = await User.findOne({ email });
  return !!user;
};
