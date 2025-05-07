const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength: 8
  },
  role: {
    type: String,
    enum: ['user', 'chef', 'admin'],
    default: 'user'
  },
  userNumber: {
    type: String,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  },

  likedRecipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  dislikedRecipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  bookmarkedRecipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  ratedRecipes: [{
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  }],
  commentedRecipes: [{
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  }],

  createdAt: {
    type: Date,
    default: Date.now
  }
});


// Pre-save hook to hash the password and generate userNumber
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
  
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
  
      if (this.isNew) {
        const lastUser = await this.constructor.findOne({}, {}, { sort: { createdAt: -1 } });
        if (lastUser && lastUser.userNumber) {
          const lastNumber = parseInt(lastUser.userNumber.replace('USER', ''));
          this.userNumber = `USER${String(lastNumber + 1).padStart(3, '0')}`;
        } else {
          this.userNumber = 'USER001';
        }
      }
  
      next();
    } catch (error) {
      next(error);
    }
  });
  

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
