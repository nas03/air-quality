export const resMessage = {
  field_invalid: "Fields are invalid",
  server_error: "Server error",
  db_failed: "Failed to update database",
  wrong_credentials: "Email/Username or password is not correct",
  user_not_exists: "User does not exist",
  user_existed: "User is existed",
  user_not_authorized: "User is not authorized",
  token_invalid: "Token is invalid",
} as const;

export const statusCode = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  METHOD_NOT_ALLOWED: 405,
  ERROR: 500,
} as const;

export const flag = {
  FALSE: 0,
  TRUE: 1,
} as const;

export const encryptionSalt = {
  DEFAULT: 15,
};
