const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const chefSchema = new mongoose.Schema({
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
    enum: ['chef'],
    default: 'chef'
  },
  chefNumber: {
    type: String,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to hash the password and generate chefNumber
chefSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    // Generate the chefNumber (e.g., CHEF001, CHEF002, ...)
    if (this.isNew) {
      const lastChef = await this.constructor.findOne({}, {}, { sort: { createdAt: -1 } });
      if (lastChef && lastChef.chefNumber) {
        const lastNumber = parseInt(lastChef.chefNumber.replace('CHEF', ''));
        this.chefNumber = `CHEF${String(lastNumber + 1).padStart(3, '0')}`;
      } else {
        this.chefNumber = 'CHEF001';
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
chefSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Chef', chefSchema);
