const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');
const mongoose = require('mongoose');

// In-memory user store when MongoDB is not connected
const inMemoryUsers = [];

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, district, orchardName, acreage, primaryVarieties, specialization, institution } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and role are required fields.',
      });
    }

    if (!['farmer', 'customer', 'expert'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be one of: farmer, customer, expert.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email address already exists. Please log in instead.',
        });
      }

      const userData = {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        location: {
          district: district || (role === 'farmer' ? 'Shopian' : 'Srinagar'),
          state: 'Jammu & Kashmir',
        },
      };

      if (role === 'farmer') {
        userData.orchardDetails = {
          orchardName: orchardName || `${name}'s Apple Orchard`,
          acreage: acreage ? parseFloat(acreage) : 4.5,
          primaryVarieties: primaryVarieties ? primaryVarieties.split(',').map(s => s.trim()) : ['Kashmiri Delicious', 'Royal Delicious'],
          treeCount: 350,
        };
      } else if (role === 'expert') {
        userData.expertProfile = {
          title: 'Horticultural Plant Pathologist',
          specialization: specialization || 'Temperate Pomology & Apple Scab Control',
          experienceYears: 6,
          institution: institution || 'SKUAST-Kashmir (Shalimar Campus)',
          isVerified: false,
          verificationNotes: 'Institutional ID verification pending review by department moderator',
          bio: 'Advising growers across Shopian, Baramulla, and Sopore fruit belts.',
          isAvailable: true,
        };
      }

      const newUser = await User.create(userData);
      const token = generateToken(newUser);

      const userResponse = newUser.toObject();
      delete userResponse.password;

      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: userResponse,
      });
    } else {
      // In-memory fallback
      const exists = inMemoryUsers.find(u => u.email === email.toLowerCase());
      if (exists) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email address already exists.',
        });
      }

      const newUser = {
        _id: 'mem_' + Date.now(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        location: { district: district || 'Shopian', state: 'Jammu & Kashmir' },
        orchardDetails: {
          orchardName: orchardName || `${name}'s Apple Orchard`,
          acreage: acreage ? parseFloat(acreage) : 4.0,
          primaryVarieties: ['Kashmiri Delicious', 'Royal Delicious'],
          treeCount: 320,
        },
        expertProfile: {
          title: 'Horticultural Plant Pathologist',
          specialization: specialization || 'Temperate Fruit Pathology',
          experienceYears: 7,
          institution: institution || 'SKUAST-Kashmir',
          isVerified: false,
          verificationNotes: 'Pending Review',
          bio: 'Specialist in apple canopy health and fungal management.',
          isAvailable: true,
        },
        createdAt: new Date(),
      };

      inMemoryUsers.push(newUser);
      const token = generateToken(newUser);
      const { password: _, ...userWithoutPass } = newUser;

      return res.status(201).json({
        success: true,
        message: 'Registration successful (Local In-Memory Mode)',
        token,
        user: userWithoutPass,
      });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration: ' + error.message,
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const isDbConnected = mongoose.connection.readyState === 1;
    let user = null;

    if (isDbConnected) {
      user = await User.findOne({ email: email.toLowerCase() });
    } else {
      user = inMemoryUsers.find(u => u.email === email.toLowerCase());
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No account found with this email.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password does not match.',
      });
    }

    const token = generateToken(user);
    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.password;

    return res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: userObj,
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login: ' + error.message,
    });
  }
};

// Get current profile
exports.getMe = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let user = null;

    if (isDbConnected) {
      user = await User.findById(req.user.id).select('-password');
    } else {
      user = inMemoryUsers.find(u => (u._id || u.id) === req.user.id);
      if (user) {
        const { password, ...clean } = user;
        user = clean;
      }
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile: ' + error.message,
    });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    const updates = req.body;

    // Disallow role or password update through this endpoint
    delete updates.role;
    delete updates.password;

    if (isDbConnected) {
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updates },
        { new: true, runValidators: true }
      ).select('-password');

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        user: updatedUser,
      });
    } else {
      const idx = inMemoryUsers.findIndex(u => (u._id || u.id) === req.user.id);
      if (idx !== -1) {
        inMemoryUsers[idx] = { ...inMemoryUsers[idx], ...updates };
        const { password, ...clean } = inMemoryUsers[idx];
        return res.json({
          success: true,
          message: 'Profile updated successfully',
          user: clean,
        });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile: ' + error.message,
    });
  }
};
