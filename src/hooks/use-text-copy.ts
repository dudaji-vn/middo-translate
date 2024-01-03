import toast from 'react-hot-toast';

export const useTextCopy = (_text?: string) => {
  const copy = (text?: string) => {
    const textToCopy = text || _text || '';
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast.success('Copied to clipboard');
    });
  };
  return { copy };
};
