import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";

// Register function
export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, phone, password } = req.body;

  // Check if all required fields are provided
  if (!name || !email || !phone || !password) {
    return next(new ErrorHandler("Please fill full form!"));
  }

  // Check if email is already registered
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already registered!"));
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    phone,
    password,
  });

  // Send token and success response
  sendToken(user, 200, res, "User Registered Successfully");
});

// Login function
export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password."));
  }

  // Find user by email
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }

  // Check if password matches
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }

  // Send token and success response
  sendToken(user, 201, res, "User Logged In!");
});

// Logout function
export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()), // Set expiration date to the past
    })
    .json({
      success: true,
      message: "Logged Out Successfully.",
    });
});
