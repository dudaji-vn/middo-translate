export interface TranslateResultProps {
	result: string;
	resultEnglish: string;
}

export const TranslateResult = (props: TranslateResultProps) => {
	return (
		<div>
			<h1 className="text-2xl">{props.result}</h1>
			<p className="text-2xl">{props.resultEnglish}</p>
		</div>
	);
};
