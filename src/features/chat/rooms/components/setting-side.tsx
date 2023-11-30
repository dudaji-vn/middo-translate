export interface SettingSideProps {
  onBack?: () => void;
}

export const SettingSide = (props: SettingSideProps) => {
  return (
    <div className="h-full w-full rounded-md bg-black bg-card shadow-sm"></div>
  );
};
