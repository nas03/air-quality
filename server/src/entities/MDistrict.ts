export class MDistrict {
	constructor(
		public district_id: string | null,
		public province_id: string | null,
		public vn_province: string | null,
		public vn_district: string | null,
		public eng_district: string | null,
		public vn_type: string | null,
		public eng_type: string | null,
		public deleted?: number | null,
		public updated_at?: Date | null,
		public created_at?: Date | null,
	) {}
}
