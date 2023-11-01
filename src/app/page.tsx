import { TranslateEditor } from '@/components/translate-editor';
import { TranslateResult } from '@/components/translate-result';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { getSupportLanguages, translateText } from '@/services/languages';
interface HomeProps {
	searchParams: {
		query?: string;
		sourceLanguage?: string;
		targetLanguage?: string;
	};
}

export default async function Home(props: HomeProps) {
	const sourceText = props.searchParams.query || '';
	const sourceLanguage =
		props.searchParams.sourceLanguage || DEFAULT_LANGUAGES_CODE.VN;
	const targetLanguage =
		props.searchParams.targetLanguage || DEFAULT_LANGUAGES_CODE.KR;
	const targetResult = await translateText(
		sourceText,
		sourceLanguage,
		targetLanguage,
	);
	const sourceEnglishResult = await translateText(
		sourceText,
		sourceLanguage,
		DEFAULT_LANGUAGES_CODE.EN,
	);
	const targetEnglishResult = await translateText(
		targetResult,
		targetLanguage,
		DEFAULT_LANGUAGES_CODE.EN,
	);
	const supportLanguages = await getSupportLanguages();
	return (
		<main className="flex min-h-screen flex-col items-center p-24">
			<div className="max-h-24 overflow-scroll mb-10">
				{supportLanguages.map((language) => (
					<div
						key={language.code}
						className="flex flex-col items-center justify-center"
					>
						<h1 className="text-2xl">{language.name}</h1>
						<p className="text-2xl">{language.code}</p>
					</div>
				))}
			</div>
			<TranslateEditor />
			<div>
				<span>{sourceEnglishResult}</span>
			</div>
			<TranslateResult
				result={targetResult}
				resultEnglish={targetEnglishResult}
			/>
		</main>
	);
}
