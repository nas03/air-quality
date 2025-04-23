import moment from "moment";

export const dateTransformer = (val: unknown) => {
	if (typeof val !== "string") return undefined;
	const isValid = moment(val, "YYYY-MM-DD").isValid();
	return isValid ? val : undefined;
};

export const numberTransformer = (val: unknown) => {
	if (typeof val !== "number" || typeof val !== "string") return undefined;
	const isValid = !isNaN(Number(val));
	return isValid ? val : undefined;
};
