import {} from '@/components/select';

interface HomeProps {}

export default async function DesignSystem(props: HomeProps) {
  return (
    <main className="max-w-screen flex min-h-screen flex-col items-center overflow-x-hidden p-4"></main>
  );
}

const Section = ({
  children,
  title,
}: React.PropsWithChildren & {
  title: string;
}) => {
  return (
    <section className="">
      <h4 className="mb-2 text-xs font-bold text-primary">{title}</h4>
      {children}
    </section>
  );
};
