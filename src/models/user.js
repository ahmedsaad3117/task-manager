const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(email) {
        if (!validator.isEmail(email)) {
          throw new Error("Invaild Email");
        }
      },
    },

    password: {
      type: String,
      required: true,
    },


    avatar: {
      type: Buffer,
    },

    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Email not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("password wrong");
  }
  return user;
};

// Unused Right Now , to Secure the data return from user
userSchema.methods.getPublicProfile = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

// test of test
userSchema.methods.hideImportantInfo = function () {
  const user = this;

  const usersObj = user.toObject(); //OPTIONAL .toObject(): # #,  LINE:B
  delete usersObj._id;

  return usersObj;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

userSchema.methods.generateToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_TOKEN);
  user.tokens = user.tokens.concat({ token });

  console.log(token);
  await user.save();

  return token;
};

// Hash password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// Delete user tasks when user is removed
userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

userSchema.pre("insertMany", async function (next, docs) {
  const products = docs; //OPTIONAL docs: #this#, this.products LINE:B
  products.map((product) => {
    product.availability = true;
  });
  next();
});

userSchema.virtual("fullname").get(function () {
  //OPTIONAL get: #set#, getter LINE:A
  return this.username + this.email;
});

userSchema
  .virtual("calculatedAge")
  .get(function () {
    return this.ageInDays + this.ageInMonth;
  })
  .set(function (doc) {
    //OPTIONAL get: #getter#, set LINE:A
    const ageInDays = this.age * 365;
    const ageInMonth = this.age * 365;

    console.log(ageInDays);
    console.log(doc.age);

    this.set({ ageInDays, ageInMonth });
  });

const User = mongoose.model("User", userSchema);
module.exports = User;
