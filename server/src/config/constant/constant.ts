export const resMessage = Object.freeze({
    field_invalid: "Fields are invalid",
    server_error: "Server error",
    db_failed: "Failed to update database",
    wrong_credentials: "Email/Username or password is not correct",
    user_not_exists: "User does not exist",
    user_existed: "User is existed",
    user_not_authorized: "User is not authorized",
    token_invalid: "Token is invalid",
    wrong_old_password: "Your old password is invalid",
    not_found: "Data not found",
});

export const statusCode = Object.freeze({
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    METHOD_NOT_ALLOWED: 405,
    ERROR: 500,
    NOT_FOUND: 404,
});

export const flag = Object.freeze({
    FALSE: 0,
    TRUE: 1,
});

export const encryptionSalt = Object.freeze({
    DEFAULT: 15,
});

export const cacheTime = Object.freeze({
    DEFAULT: 3600,
    DEV: 5,
});

export const AUTHENTICATION = Object.freeze({
    TOKEN_VERIFICATION: Object.freeze({
        INVALID: 0,
        VALID: 1,
        EXPIRED: 2,
    }),
    USER_ROLE: Object.freeze({
        USER: 1,
        ADMIN: 2,
    }),
});

export const receiveNotification = Object.freeze({
    DISABLED: 0,
    EMAIL_NOTIFICATION: 1,
    SMS_NOTIFICATION: 2,
    BOTH: 3,
});
