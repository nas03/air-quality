export const USER_KEY = Object.freeze({
  EMAIL_KEY: (email: string) => `user:email:${email}`,
  USERNAME_KEY: (username: string) => `user:username:${username}`,
  USERID_KEY: (user_id: number) => `user:user_id:${user_id}`,
});

export const STATISTICS_KEY = Object.freeze({
  DISTRICT_HISTORY_KEY: (district_id: string, start_date: Date, end_date: Date) =>
    `statistics:${district_id}:history:${start_date.toString()}:${end_date.toString()}`,
});
