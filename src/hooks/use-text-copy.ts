import { useToast } from '@/components/toast';

export const useTextCopy = (_text?: string) => {
  const { toast } = useToast();
  const copy = (text?: string) => {
    const textToCopy = text || _text || '';
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast({ description: 'Text copied!' });
    });
  };
  return { copy };
};
