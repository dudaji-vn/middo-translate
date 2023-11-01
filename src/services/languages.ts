import { Country } from '@/types/country';

export async function getSupportLanguages() {
	const response = await fetch('http://localhost:3000/api/languages');
	const json = await response.json();
	return json.data as Country[];
}
export async function translateText(text: string, from: string, to: string) {
	if (!text) return '';
	console.log(text, from, to);
	const response = await fetch(
		`http://localhost:3000/api/languages/translate?query=${text}&from=${from}&to=${to}`,
	);
	const json = await response.json();
	return json.data as string;
}

export async function detectLanguage(text: string) {
	if (!text) return '';
	const response = await fetch(
		`http://localhost:3000/api/languages/detect?query=${text}`,
	);
	const json = await response.json();
	return json.data as string;
}
