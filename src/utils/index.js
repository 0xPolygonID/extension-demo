export const hideString = (input, first = 15, second = -10) => {
	return `${input.slice(0, first)} ... ${input.slice(second)}`;
};

export const byteEncoder = new TextEncoder();