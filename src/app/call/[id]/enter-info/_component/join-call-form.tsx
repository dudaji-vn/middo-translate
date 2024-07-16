import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { InputSelectLanguage } from '@/components/form/input-select-language';
import { AlertError } from '@/components/alert/alert-error';
import { Button } from '@/components/actions';
import { useEffect, useState } from 'react';
import { PhoneIcon } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '@/configs/default-language';
import { PageLoading } from '@/components/feedback';

export default function JoinCallForm() {
  const { t } = useTranslation('common');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [defaultLanguage, setDefaultLanguage] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const form = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      language: '',
    },
    resolver: zodResolver(
      z
        .object({
          name: z
            .string()
            .min(1, {
              message: t('MESSAGE.ERROR.REQUIRED'),
            })
            .refine((value: string) => value.trim().length > 0, {
              message: t('MESSAGE.ERROR.REQUIRED'),
            }),
          language: z.string().min(1, {
            message: t('MESSAGE.ERROR.REQUIRED'),
          }),
        })
        .optional(),
    ),
  });

  const {
    register,
    setValue,
    watch,
    trigger,
    handleSubmit,
    setError,
    clearErrors,
    getFieldState,
    formState: { errors, isValid },
  } = form;

  const { name, language } = watch();

  const submit = async (values: any) => {
    // e.preventDefault();
    trigger();
    if (!isValid) return;
    try {
        setLoading(true);
        console.log('JoinCallForm - Line 116 :: submit -> values', values);
      //   setLoading(true);
      //   let img = {secure_url: ''};
      //   if(avatar) {
      //     img = await uploadImage(avatar as File);
      //   }
      //   let res = await addInfoUserService({
      //     avatar: img.secure_url,
      //     name,
      //     language,
      //     username,
      //   });
      //   setDataAuthStore({ user: res.data });
      //   router.push(ROUTE_NAMES.ONLINE_CONVERSATION);
      //   setErrorMessage('');
    } catch (err: any) {
        setErrorMessage(t(err?.response?.data?.message));
    } finally {
        setLoading(false);
    }
  };


  useEffect(() => {
    const browserLanguage = navigator.language.split('-')[0];
    const isLanguageSupported = SUPPORTED_LANGUAGES.some(
      (lang) => lang.code === browserLanguage,
    );
    if (isLanguageSupported) {
      setDefaultLanguage(browserLanguage);
    } else {
      setDefaultLanguage('en');
    }
  }, []);

  return (
    <Form {...form}>
        {loading && <PageLoading />}
      <form onSubmit={handleSubmit(submit)}>
        <RHFInputField
          name="name"
          formLabel={t('COMMON.NAME')}
          inputProps={{
            placeholder: t('COMMON.NAME_PLACEHOLDER'),
            suffix: (
              <span className="text-sm text-gray-400">{`${name?.length}/60`}</span>
            ),
            onKeyDown: (e) => {
              if (
                name?.length >= 60 &&
                e.key !== 'Backspace' &&
                e.key !== 'Delete'
              ) {
                e.preventDefault();
              }
            },
          }}
        />
        <InputSelectLanguage
          className="mt-5"
          field="language"
          setValue={setValue}
          errors={errors.language}
          trigger={trigger}
          defaultValue={defaultLanguage}
        ></InputSelectLanguage>
        <AlertError errorMessage={errorMessage}></AlertError>
        <Button
          variant={'default'}
          size={'md'}
          shape={'square'}
          color={'primary'}
          className="mx-auto mt-5 md:mt-10 block w-full max-w-[360px]"
          type="submit"
          startIcon={<PhoneIcon size={16} />}
          disabled={
            !watch().name || !watch().language || Object.keys(errors).length > 0
          }
        >
          {t('COMMON.JOIN_CALL')}
        </Button>
      </form>
    </Form>
  );
}
