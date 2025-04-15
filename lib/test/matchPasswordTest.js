const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Simulated User schema
const UserSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
  },
});

// Your password checking method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);

// Testing "sapana"
(async () => {
  const plainPassword = "sapana";

  // Simulate how the password is stored (hashed)
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // Fake user object with hashed password
  const user = new User({ password: hashedPassword });

  // Test matchPassword
  const matchCorrect = await user.matchPassword("sapana"); // should be true
  const matchIncorrect = await user.matchPassword("wrongone"); // should be false

  console.log("Correct password matched:", matchCorrect);
  console.log("Wrong password matched:", matchIncorrect);

  process.exit();
})();
