export const useScrollIntoView = (
  ref: React.RefObject<Element>,
  options?: ScrollIntoViewOptions,
) => {
  const scrollIntoView = () => {
    if (ref.current) {
      ref.current.scrollIntoView(
        options || {
          behavior: 'instant',
          block: 'start',
          inline: 'nearest',
        },
      );
    }
  };
  return { scrollIntoView };
};
