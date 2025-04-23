export class MRecommendation {
	public constructor(
		public color: string | null,
		public id: number | null,
		public max_threshold: number | null,
		public min_threshold: number | null,
		public en_recommendation: string | null,
		public vn_recommendation: string | null,
		public vn_status: string | null,
		public en_status: string | null,
	) {}
}
