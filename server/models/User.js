const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const sequelize = require("../db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: { args: [2, 50], msg: "Name must be between 2 and 50 characters" },
        notEmpty: { msg: "Name is required" },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "Please enter a valid email" },
        notEmpty: { msg: "Email is required" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      // Not required — Google users won't have a password
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      // PostgreSQL unique indexes allow multiple NULLs, so no sparse workaround needed
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
    tableName: "users",
  },
);

// Hash password before creating or updating (only when password field changed)
User.beforeSave(async (user) => {
  if (user.changed("password") && user.password) {
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Compare entered password with hashed password in DB
User.prototype.comparePassword = async function (candidatePassword) {
  if (!this.password) return false; // Google-only users have no password
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
