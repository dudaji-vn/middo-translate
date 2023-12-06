import { AlertCircleOutline, CheckmarkCircle2, EyeOff2Outline, EyeOutline } from "@easy-eva-icons/react";
import Image from "next/image";
import { useId, useMemo, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../data-entry";
import { CircleFlag } from "react-circle-flags";
import { LANGUAGE_CODES_MAP, SUPPORTED_LANGUAGES } from "@/configs/default-language";

interface InputSelectLanguageProps {
    className?: string;
    register?: any;
    errors?: any;
    setValue?: any;
    field?: string;
    trigger?: any;
}
interface InputSelect {
    value: string;
    title: string;
}
export const InputSelectLanguage = ( props: InputSelectLanguageProps ) => {
    const id = useId();
    const [valueSelect, setValueSelect] = useState<InputSelect>({value: '', title: ''});
    const { errors, className, setValue, field, trigger } = props;

    const languageOptions = useMemo(()=> {
        return SUPPORTED_LANGUAGES.map((language) => {
            return {
                value: language.code,
                title: language.name,
            }
        })
    }, [])

    const handleSelectChange = (value: any) => {
        let itemSelected = languageOptions?.find((item: any) => item.value === value);
        setValue(field, value);
        trigger(field)
        setValueSelect(itemSelected as InputSelect);
    }
    
    return (
        <div className={className}>
            <label className="mb-2 ml-5 inline-block" htmlFor={id}>Language</label>
            <Select onValueChange={handleSelectChange}>
                <SelectTrigger className="w-full px-5 flex">
                    {!valueSelect?.value && <span className="opacity-60">Select your native language</span>}
                    {valueSelect?.value && 
                    <>
                        <CircleFlag countryCode={LANGUAGE_CODES_MAP[valueSelect.value as keyof typeof LANGUAGE_CODES_MAP].toLowerCase()} className="w-5 h-5 inline-block mr-2" />
                        <span className="flex-1 text-left">{valueSelect.title}</span>
                    </>}
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                    {languageOptions?.length > 0 && languageOptions?.map((option: any) => {
                        return <SelectItem value={option.value} key={option.value} className="">
                            <CircleFlag countryCode={LANGUAGE_CODES_MAP[option.value as keyof typeof LANGUAGE_CODES_MAP].toLowerCase()} className="w-5 h-5 inline-block mr-2" />
                            <span>{option.title}</span>
                        </SelectItem>
                    })}
                </SelectContent>
            </Select>
            {errors && (
                <div className="mt-2 flex items-center gap-2 pl-5 text-error-2 ">
                    <AlertCircleOutline className="min-w-[20px] h-7 w-5 " />
                    {errors?.message?.message as string || errors?.message as string}
                </div>
            )}
        </div>
    )
}