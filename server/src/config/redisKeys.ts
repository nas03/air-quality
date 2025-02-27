export const USER_KEY = Object.freeze({
  EMAIL_KEY: (email: string) => `user:email:${email}`,
  USERNAME_KEY: (username: string) => `user:username:${username}`,
  USERID_KEY: (user_id: number) => `user:user_id:${user_id}`,
});
