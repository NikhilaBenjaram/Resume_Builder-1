const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
let { ObjectId } = require("mongodb");
const validate = require("../helper/validator");
const bcrypt = require("bcryptjs");
const async = require("hbs/lib/async");
const saltRounds = 16;

async function loginUser(username, password) {
  validate.checkNonNull(username);
  validate.checkNonNull(password);

  validate.checkString(username);
  validate.checkString(password);

  const usercol = await users();
  const user = await usercol.findOne({ username: username.toLowerCase() });
  if (user == null) {
    const error = new Error("Either username or password is invalid");
    error.code = 403;
    throw error;
  }
  let isAuthenticated = false;
  try {
    isAuthenticated = await bcrypt.compare(password, user.password);
  } catch (e) {
    throw new Error(e.message);
  }

  if (!isAuthenticated) {
    const error = new Error("Either username or password is invalid");
    error.code = 403;
    throw error;
  } else {
    return user;
  }
}

async function create( 
  firstname,
  lastname,
  email,
  linkedin,
  phonenumber,
  username,
  password,
) {
  // Input Validation by calling functions from validation.js
  const userCol = await users();
  const existingUser = await userCol.findOne({ username: username });
  if (existingUser != null) {
    throw `Username is available!`;
  }
  password = await bcrypt.hash(password, saltRounds);
  
  let newUser = {
    firstname: firstname,
    lastname: lastname,
    email: email,
    linkedin: linkedin,
    phonenumber: phonenumber,
    username: username.toLowerCase(),
    password: password
  };
  const insertInfo = await userCol.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw "Could not add user";
  const newId = insertInfo.insertedId;
  const curruser = await this.get(newId.toString());
  return curruser;
}

async function get(id) {
  validate.checkNonNull(id);
  validate.checkString(id);
  if (ObjectId.isValid(id) !== true) throw "ID is not a valid Object ID";

  const usercol = await users();
  const user = await usercol.findOne({ _id: ObjectId(id) });
  if (user) {
    user._id = user._id.toString();
    return user;
  } else throw "Could not find user in database";
}
// update data
// async function update(
//   id,
//   firstName,
//   lastName,
//   email,
//   phoneNumber,
//   gender,
//   profilePicture,
//   address,
//   biography
// ) {
//   validate.checkNonNull(id);
//   validate.checkString(id); //update validation
//   validate.checkNonNull(firstName);
//   validate.checkNonNull(lastName);
//   validate.checkNonNull(email);
//   validate.checkNonNull(phoneNumber);
//   validate.checkNonNull(gender);
//   validate.checkNonNull(profilePicture);
//   validate.checkNonNull(address);
//   validate.checkNonNull(biography);
//   validate.checkString(firstName);
//   validate.checkString(lastName);
//   validate.checkString(email);
//   validate.checkString(phoneNumber);
//   validate.checkString(gender);
//   validate.checkString(profilePicture);
//   validate.checkEmail(email);
//   validate.checkPhoneNumber(phoneNumber);
//   validate.checkLocation(address);
//   const userCol = await users();

//   const updated_users = {
//     firstName: firstName,
//     lastName: lastName,
//     email: email,
//     phoneNumber: phoneNumber,
//     gender: gender,
//     profilePicture: profilePicture,
//     address: address,
//     biography: biography,
//   };

//   const updatedone = await userCol.updateOne(
//     { _id: ObjectId(id) },
//     { $set: updated_users }
//   );

//   if (updatedone.modifiedCount == 0) {
//     throw "No update made to profile";
//   }
//   let a = await this.get(id);
//   return a;
// }



// delete data
async function remove(id) {
  validate.checkNonNull(id);
  validate.checkString(id);
  const user = await users();
  const Del = await user.findOne({ _id: ObjectId(id) });

  const usersdel = await user.deleteOne({ _id: ObjectId(id) });

  if (usersdel.deletedCount !== 1)
    throw new Error(`No user exists with id${id}`);
  return { deleted: true };
}

async function getAll() {
  const usercol = await users();
  const allusers = await usercol.find({}).toArray();
  let finalUsers = [];
  let thisUser = {};
  allusers.forEach((x) => {
    thisUser["id"] = x._id.toString();
    fname = x.firstName;
    lname = x.lastName;
    thisUser["name"] = fname + " " + lname;
    thisUser["img"] = x.profilePicture;
    finalUsers.push(thisUser);
    thisUser = {};
  });
  if (!Array.isArray(finalUsers) || finalUsers.length == 0) {
    const error = new Error(`No users found`);
    error.code = errorCode.NOT_FOUND;
    throw error;
  }
  return finalUsers;
}
module.exports = {
  create,
  get,
  remove,
  getAll,
  loginUser,
};
