const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper: Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide name, email, and password" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Create new user (password is hashed via beforeSave hook)
    const user = await User.create({ name, email, password });

    // Generate token and respond
    const token = generateToken(user.id);

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res
      .status(500)
      .json({
        message: "Server error during registration",
        error: error.message,
      });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Find user (password is included for comparison)
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token and respond
    const token = generateToken(user.id);

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ message: "Server error during login", error: error.message });
  }
};

// @desc    Login or register with Google OAuth
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
  try {
    const { credential, access_token } = req.body;

    let googleId, email, name, picture;

    if (credential) {
      // Verify the Google ID token (from GoogleLogin component)
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      googleId = payload.sub;
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
    } else if (access_token) {
      // Fetch user info using access token (from useGoogleLogin hook)
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${access_token}` },
        },
      );
      if (!response.ok) {
        return res.status(401).json({ message: "Invalid Google access token" });
      }
      const payload = await response.json();
      googleId = payload.sub;
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
    } else {
      return res
        .status(400)
        .json({ message: "Google credential or access_token is required" });
    }

    // Try to find user by googleId first, then by email
    let user = await User.findOne({ where: { googleId } });

    if (!user) {
      // Check if a user with this email already exists (registered via email/password)
      user = await User.findOne({ where: { email } });

      if (user) {
        // Link the Google account to the existing user
        user.googleId = googleId;
        if (picture && !user.avatar) {
          user.avatar = picture;
        }
        await user.save();
      } else {
        // Create a brand-new user (no password needed)
        user = await User.create({
          name,
          email,
          googleId,
          avatar: picture || "",
        });
      }
    }

    // Generate token and respond
    const token = generateToken(user.id);

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token,
    });
  } catch (error) {
    console.error("Google login error:", error);
    res
      .status(500)
      .json({ message: "Google authentication failed", error: error.message });
  }
};

// @desc    Get current logged-in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // req.user is attached by the protect middleware
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("GetMe error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update user profile (name, avatar)
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name !== undefined) {
      if (!name || name.trim().length < 2) {
        return res
          .status(400)
          .json({ message: "Name must be at least 2 characters" });
      }
      user.name = name.trim();
    }
    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    await user.save();

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("UpdateProfile error:", error.message);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    // Fetch user with password included
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Google-only users may not have a password — allow them to set one
    if (user.password) {
      if (!currentPassword) {
        return res
          .status(400)
          .json({ message: "Current password is required" });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });
      }
    }

    user.password = newPassword;
    await user.save(); // beforeSave hook will hash the new password

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("ChangePassword error:", error.message);
    res.status(500).json({ message: "Server error changing password" });
  }
};

module.exports = {
  register,
  login,
  googleLogin,
  getMe,
  updateProfile,
  changePassword,
};
