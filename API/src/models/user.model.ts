import mongoose, { Document, Schema } from 'mongoose';

/**
 * User document interface extending Mongoose Document.
 * Defines the structure and types for user data in the database.
 */
export interface IUser extends Document {
  /** MongoDB ObjectId - automatically generated unique identifier */
  _id: mongoose.Types.ObjectId;

  /** User's display name (optional) */
  name: string;

  /** User's email address - must be unique and is used for authentication */
  email: string;

  /** Hashed password for authentication - never store plain text passwords */
  password: string;

  /** User's age (optional field for additional profile information) */
  age?: number;

  /** Timestamp when the user was created - automatically managed by timestamps */
  createdAt?: Date;

  /** Timestamp when the user was last updated - automatically managed by timestamps */
  updatedAt?: Date;
}

/**
 * Mongoose schema definition for the User model.
 * Defines validation rules, indexes, and field properties.
 */
const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true, // Removes leading and trailing spaces
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // Ensures email uniqueness across all users
      trim: true,
      lowercase: true, // Converts to lowercase before saving
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    age: {
      type: Number,
      required: false,
      min: [0, 'Age cannot be negative'],
      max: [150, 'Age cannot exceed 150 years'],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    collection: 'users', // Explicitly set collection name
  }
);

/**
 * Pre-save middleware to ensure email is always lowercase.
 * This runs before every save operation.
 */
userSchema.pre('save', function (next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

/**
 * Instance method to get user's public profile (excluding sensitive data).
 * @returns Object containing only safe user data for public consumption
 */
userSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    age: this.age,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

/**
 * Static method to find user by email (case-insensitive).
 * @param email - Email address to search for
 * @returns Promise resolving to user document or null
 */
userSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

/**
 * Virtual property to get full name display.
 * Returns email if name is not provided.
 */
userSchema.virtual('displayName').get(function () {
  return this.name || this.email.split('@')[0];
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });

/**
 * User model based on the schema.
 * Use this model for all user database operations.
 */
const User = mongoose.model<IUser>('User', userSchema);

export default User;
