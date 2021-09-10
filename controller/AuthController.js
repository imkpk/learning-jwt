const jwt = require("jsonwebtoken");
const User = require("../models/User");
const env = require("process")

// signup controller
const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      let newUser = new User({ name, email, password });
      await newUser.save();
      return res.status(200).json({ msg: "user successfully created" });
    }else{
      return res.status(422).json({ errors: ["this email already registed"] });
    }
  } catch (error) {
    console.error(e);
    return res.status(500).json({ errors: ["some error occured"] });
  }
};

// login controller
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user){
      return res.status(422).json({ errors: ["no such user exists"] });
    } else if (await user.comparePassword(password)) {
      const token = jwt.sign({ id: user._id }, process.env.SECRET, {
        expiresIn: "24h",
      });
      console.log(token, 'json-web signin token');
      return res.status(200).json({errors:"user logged in", token})
    }else{
      return res.status(403).json({ errors: ["invalid password"] });
    }
  } catch (error) {
    console.error(e);
    res.staus(500).json({ errors: ["some error occured"] });
  }
};

// me endpoint
const me=async(req,res)=>{
  let token=req.header("X-Auth");
  try {
    if(!token) return res.status(403).json({errors:'"unauthorized access'})

    let decoded=jwt.verify(token,env.SECRET);
    let user=await User.findById(decoded.id, "name email");
    if(!user) return res.status(403).json({errors:["unauthorized"]});
    return res.status(200).status(200).json({user})

  } catch (error) {
    console.error(e);
    res.staus(500).json({ errors: ["some error occured"] });
  }
}

module.exports = {
  signup,
  login,
  me,
};