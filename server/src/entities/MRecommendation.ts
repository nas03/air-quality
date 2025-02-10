export class MRecommendation {
  public constructor(
    public color: string | null,
    public id: number | null,
    public max_threshold: number | null,
    public min_threshold: number | null,
    public recommendation: string | null,
    public status: string | null
  ) {}
}
