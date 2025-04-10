export class VerificationCode {
    public constructor(
        public id: number,
        public type: number,
        public user_id: number,
        public code: string,
        public created_at: Date,
    ) {}
}
