const signup = require("./auth/signup");
const login = require("./auth/login");
const {verifyOtpSignUp, verifyOtpLogin} = require("./auth/verifyOtp");
const forgetPassword = require("./auth/forgetPassword");
const resetPassword = require("./auth/resetPassword");
const getProfile = require("./auth/getProfile");
const {updateProfile} = require("./auth/updateProfile");

const userDashboard = require("./dasboard/userDashboard")

const {getBookById, getAllBooks } = require("./book/getBooks");
const rateBook = require("./book/bookRating");

const { getDhyaanById, getAllDhyaans} = require("./dhyaan/getDhyaan");
const rateDhyaan = require("./dhyaan/dhyaanRating");

const addFavourite = require("./favourites/addFavourite")
const getFavorites = require("./favourites/getFavourite")
const removeFromFavorites = require("./favourites/removefavourite")
const checkFavoriteStatus = require('./favourites/checkIsFavourite')

const logout = require("./auth/logout")
const getTags = require("./Tags/getTags")

const getAllAppData = require("./appData/getAppDatas")
const getAppData = require("./appData/getAppData")

module.exports = {
  signup,
  login,
  verifyOtpSignUp, verifyOtpLogin,
  forgetPassword,
  resetPassword,
  getProfile,
  updateProfile,
  logout,

  //dashboard
  userDashboard,

  //books
  getBookById, getAllBooks,
  rateBook,

  //dhyaan
  getDhyaanById, getAllDhyaans,
  rateDhyaan,

  //appData
  getAllAppData,
  getAppData,

  //favourites
  addFavourite,
  getFavorites,
  removeFromFavorites,
  checkFavoriteStatus,

  //tags
  getTags,
 

};

