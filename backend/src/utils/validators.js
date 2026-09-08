const Joi = require("joi");

const signupSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.min": "ስም ቢያንስ 3 ቁምፊዎች መሆን አለበት",
    "string.max": "ስም ከ30 ቁምፊዎች መብለጥ አይችልም",
    "any.required": "ስም ያስፈልጋል",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "ትክክለኛ ኢሜይል ያስገቡ",
    "any.required": "ኢሜይል ያስፈልጋል",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "ምስጢር ቃል ቢያንስ 6 ቁምፊዎች መሆን አለበት",
    "any.required": "ምስጢር ቃል ያስፈልጋል",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "ትክክለኛ ኢሜይል ያስገቡ",
    "any.required": "ኢሜይል ያስፈልጋል",
  }),
  password: Joi.string().required().messages({
    "any.required": "ምስጢር ቃል ያስፈልጋል",
  }),
});

const messageSchema = Joi.object({
  text: Joi.string().allow(""),
  image: Joi.string().allow(""),
  receiverId: Joi.string().required(),
});

module.exports = { signupSchema, loginSchema, messageSchema };
