const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- 1. Configuration and Setup ---
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
// Note: express.json() and express.urlencoded() handle JSON/form data, 
// but Multer handles multipart/form-data for file uploads.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images (Make the 'uploads' folder publicly accessible)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 2. Multer Configuration for File Uploads ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '/uploads');
    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    // Save file with a unique timestamp as the name
    cb(null, `${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// --- 3. MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI, { autoIndex: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --- 4. User Schema and Model ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  city: String,
  state: String,
  country: String,
  pincode: String,
  address: String,
  profile_image: String, // Stores the filename/path
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// --- 5. Authentication Middleware ---
const authMiddleware = async (req, res, next) => {
  // Token is typically sent as 'Bearer <token>'
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach decoded payload (id and role) to the request
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ===================================
//         6. API Routes
// ===================================

// --- AUTH ROUTES ---

// 1. Register User (POST /api/auth/register)
app.post('/api/auth/register', upload.single('profile_image'), async (req, res) => {
  try {
    const { name, email, password, phone, city, state, country, pincode, address, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email, password required.' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name, email, 
      password: hashedPassword, // Store the hash
      phone, city, state, country, pincode, address,
      profile_image: req.file ? req.file.filename : null, // Store filename
      role: role || 'user'
    });

    await newUser.save();
    // Optionally remove the password from the response object
    newUser.password = undefined; 
    res.status(201).json({ message: 'User registered successfully', user: newUser });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 2. Login User (POST /api/auth/login)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// --- USER CRUD ROUTES (Requires authMiddleware) ---

// 3. Get All Users (GET /api/users) - All logged-in users can view
app.get('/api/users', authMiddleware, async (req, res) => {
  try {
    // Exclude password field from the result
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 4. Get User by ID (GET /api/users/:id)
app.get('/api/users/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Security check: Only allow admin or the user themselves to view details
    if (req.user.role !== 'admin' && req.user.id !== user._id.toString()) {
        return res.status(403).json({ message: 'Access denied. You can only view your own profile.' });
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 5. Update User (PUT /api/users/:id) - Admin only, handles file upload
app.put('/api/users/:id', authMiddleware, upload.single('profile_image'), async (req, res) => {
  if (req.user.role !== 'admin') {
    // If authorization fails, delete the file if it was uploaded during the attempt
    if (req.file) fs.unlinkSync(req.file.path); 
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }

  try {
    const userId = req.params.id;
    const updates = { ...req.body };
    
    const existingUser = await User.findById(userId);
    if (!existingUser) return res.status(404).json({ message: 'User not found' });
    
    // Handle Password update
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    } else {
      delete updates.password; 
    }
    
    // Handle Profile Image update
    if (req.file) {
      updates.profile_image = req.file.filename;

      // Delete old image file from the disk to save space
      if (existingUser.profile_image) {
        const oldImagePath = path.join(__dirname, 'uploads', existingUser.profile_image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error("Failed to delete old image:", err);
          });
        }
      }
    }
    
    // Perform the update
    const updatedUser = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true, runValidators: true }).select('-password');
    
    res.json({ 
      message: 'User updated successfully', 
      user: updatedUser 
    });
    
  } catch (err) {
    // If any error occurs, delete the uploaded file to prevent orphans
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 6. Delete User (DELETE /api/users/:id) - Admin only, handles image cleanup
app.delete('/api/users/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Access denied. Admins only.' });

  try {
    // Find user before deleting to get image filename
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Delete associated profile image file from disk
    if (user.profile_image) {
      const imagePath = path.join(__dirname, 'uploads', user.profile_image);
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) console.error("Failed to delete user image on disk:", err);
        });
      }
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// --- 7. Start Server ---
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));