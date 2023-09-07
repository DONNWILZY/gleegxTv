const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  verifiedEmail: {
    type: Boolean,
    default: false,
  },
  activeStatus: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline',
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  dob: {
    type: Date,
  },
  role: {
    type: String,
    enum: ['isUser', 'isAdmin', 'isModerator'],
    default: 'isUser',
  },
  relationshipStatus: {
    type: String,
    enum: ['single', 'divorced', 'departed', 'married'],
  },
 

  placeOfOrigin: {
    town: String,
    state: String,
    country: String,
  },
  resident: {
    town: String,
    state: String,
    country: String,
  },
  academic: {
    primarySchools: [
      {
        name: String,
        yearOfStarting: Number,
        yearOfGraduation: Number,
      },
    ],
    highSchools: [
      {
        name: String,
        yearOfEntry: Number,
        yearOfGraduation: Number,
      },
    ],
    colleges: [
      {
        schoolName: String,
        yearAdmitted: Number,
        yearGraduated: Number,
        currentlyStudying: Boolean,
        course: String,
        honours: String, // Bsc, diploma, etc.
       // cgpa: Number,
      },
    ],
  },
  employment: {
    employmentStatus: {
      type: String,
      enum: ['employed', 'self-employed', 'job hunting', 'building a career'],
    },
    employer: String,
    role: String,
    city: String,
    businessName: String,
    businessDescription: String,
  },
  interestedIn: {
    type: String,
    enum: ['man', 'woman'],
  },
  lookingFor: {
    type: String,
    enum: ['seriousRelationship', 'date', 'marriage', 'sexmate', 'friendship'],
  },
  bio: String,
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String,
    github: String,
    personalWebsite: String,
    others: [String], // Add other social media platforms as needed
  },
  pastRelationship: {
    maritalStatus: {
      type: String,
      enum: ['married', 'separated', 'neverMarried'],
    },
    haveKids: Boolean,
    numberOfKids: Number,
  },
  yourChoiceOfPartner: {
    ageRange: {
      min: Number,
      max: Number,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    careerPath: String,
    financialBackground: String,
    familyBackground: String,
  },
  redFlags:{
   type: [String]
  } ,
  
  dealBreaker: {
    type: [String]
  },
  dislikes: {
    type: [String]
  },

  likes: {
    type: [String]
  },
  expectations: {
    type: [String]
  },

  yourKindOfPartner: {
    type: [String]
  },
  
  yourIdealPartner: {
    type: [String]
  },
  profilePhotos: [
    {
      url: String,
      description: String,
    },
  ],
  timelinePhotos: [
    {
      url: String,
      description: String,
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],

  messages: [
    {
      from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      content: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],

   // createdBy field as an array of objects
   createdBy: [
    {
      admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      firstName: String,
      lastName: String,
      content: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],

 

},
//////// TIME STAMPS -- CREATED AT AND UPDATED //////
{ timestamps: true }
);

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
