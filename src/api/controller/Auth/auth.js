
const User = require("../../model/User");
const bcrypt = require("bcrypt");
const statusMessages = require("../../constant/messages");
const { checkPassword } = require("../../../utils/passwordUtils");
const statusCodes = require("../../constant/status");
const registerSchema = require("../../validationSchema/registerSchema");
module.exports.register = async (req, res, next) => {
    const { fullname, email, password, role } = req.body;
    try {
      //check if the user already regsiter
      const checkUser = await User.findOne({ email }).exec();
      if (checkUser) {
        return res.status(statusCodes.CONFLICT).json({
          data: {
            message: "This email already existed",
          },
        });
      } else {
        bcrypt.hash(password, 10, (err, hashPassword) => {
          if (err) {
            return res.status(statusCodes.SERVER_ERROR).json({
              data: {
                message: err,
              },
            });
          } else {
            const userData = {
              fullname: fullname,
              email: email,
              password: hashPassword,
              role: role
            };
            const { error } = registerSchema.validate(userData, {
              abortEarly: false,
            });
            if (error) {
              return res.status(statusCodes. UNAUTHORIZED).json({
                data: {
                  message: error.details[0].message,
                },
              });
            } else {
              const user = new User(userData);
              user.save();
              return res.status(statusCodes.CREATED).json({
                data: {
                  message: "Your account has been created successfully",
                },
              });
            }
          }
        });
      }
    } catch (err) {
      return res.status(statusCodes.SERVER_ERROR).json({
        data: {
          message: err.message,
        },
      });
    }
  };

  module.exports.login = (req, res) => {
    const { email, password } = req.body;
  console.log(req.body);
    if (!email || !password) {
      return res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        message: statusMessages.PROVIDE_REQUIRED_FIELDS,
      });
    }
  
    User.findOne({ email })
      .select("+password")
      .then(async (user) => {
        if (!user || !(await checkPassword(user["password"], password))) {
          return res.status(statusCodes.BAD_REQUEST).json({
            succes: false,
            data: {
              message: statusMessages.INVALID_CREDENTIALS
            }
          });
        }
  
        delete user["password"];
        return res.status(statusCodes.OK).json({
          success: true,
          data: {
            user,
            token: User.createSessionToken(user._id, user.role),
          },
        });
      })
      .catch((err) => {
        return res.status(statusCodes.SERVER_ERROR).json({
          success: false,
          data: {
            message: err.message,
          },
        });
      });
  };