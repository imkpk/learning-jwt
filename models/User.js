// creating modal for mongo

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

UserSchema.pre("save", async function (next) {
  const user = this;
  try {
    if (!user.isModified("password")) next();

    let hash = await bcrypt.hash(user.password, 13);
    user.password = hash;

    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (password) {
  try {
    let result = await bcrypt.compare(password, this.password);
    console.log(this.password, 'what is this.password')
    console.log(
      result
    );
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports=mongoose.model("user", UserSchema);