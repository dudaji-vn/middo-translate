export const useScrollIntoView = (ref: React.RefObject<HTMLDivElement>) => {
  const scrollIntoView = () => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return { scrollIntoView };
};
