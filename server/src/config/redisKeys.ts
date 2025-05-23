export const USER_KEY = Object.freeze({
	EMAIL_KEY: (email: string) => `user:email:${email}`,
	USERNAME_KEY: (username: string) => `user:username:${username}`,
	USERID_KEY: (user_id: number) => `user:user_id:${user_id}`,
});

export const STATISTICS_KEY = Object.freeze({
	DISTRICT_HISTORY_KEY: (district_id: string, start_date: Date, end_date: Date) =>
		`statistics:${district_id}:history:${start_date.toString()}:${end_date.toString()}`,
});

export const USER_SETTING_KEY = Object.freeze({
	SETTING_ALL_KEY: (user_id: number) => `users_setting:${user_id}:*`,
});

export const ALERT_SETTING_KEY = Object.freeze({
	USER_KEY: (user_id: number) => `alert_setting:user_id:${user_id}`,
	ID_KEY: (id: number) => `alert_setting:${id}:*`,
});
