export type WindDataType = {
	header: { [key: string]: string | number };
	data: number[];
};
export interface IWindDataInteractor {
	getWindData(timestamp: Date): Promise<[WindDataType, WindDataType] | null>;
}
