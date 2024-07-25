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
import { useParams, useRouter } from 'next/navigation';
import { userJoinAnonymousCall } from '@/services/video-call.service';
import { useAuthStore } from '@/stores/auth.store';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { setCookieService } from '@/services/auth.service';
import { ACCESS_TOKEN_NAME } from '@/configs/store-key';

export default function JoinCallForm() {
  const { t } = useTranslation('common');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [defaultLanguage, setDefaultLanguage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const setData = useAuthStore(state => state.setData)
  const setRoom = useVideoCallStore(state =>state.setRoom)
  const setFullScreen = useVideoCallStore(state => state.setFullScreen)
  const params = useParams();
  const callId = params?.id;
  const router = useRouter();
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
        const {name, language} = values
        const res = await userJoinAnonymousCall({
          callId: callId as string,
          name,
          language
        })
        const data = res.data;
        await setCookieService([
          { 
            key: ACCESS_TOKEN_NAME, 
            value: data.token, 
            time: 60 * 60 * 24,
          },
        ]);
        const {user, call} = data
        setData({user})
        setRoom(call)
        setFullScreen(true)
        router.push(`/call/${callId}`)
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
