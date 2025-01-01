export class User {
	public constructor(
		public username: string,
		public email: string,
		public password: string,
		public phone_number: string,
		public user_id?: number,
		public updated_at?: Date | null,
		public created_at?: Date | null
	) {}
}