import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/data-entry';

import { ArrowLeftCircleIcon } from 'lucide-react';
import { Button } from '@/components/actions';
import { Switch } from '@/components/data-entry';

interface HomeProps {
  searchParams: {
    query?: string;
    sourceLanguage?: string;
    targetLanguage?: string;
  };
}

export default async function DesignSystem(props: HomeProps) {
  return (
    <main className="max-w-screen flex min-h-screen flex-col items-center overflow-x-hidden bg-white p-4">
      <div className="flex w-full flex-1 pb-2">
        <div className="flex h-full basis-1/4 flex-col gap-4">
          <Section title="1. Color">
            <div className="flex gap-2">
              <div className="flex flex-col gap-2">
                <div className="h-8 w-8 rounded-md bg-primary" />
                <div className="h-8 w-8 rounded-md bg-secondary" />
                <div className="h-8 w-8 rounded-md bg-lighter" />
                <div className="h-8 w-8 rounded-md bg-shading" />
                <div className="h-8 w-8 rounded-md bg-success" />
                <div className="h-8 w-8 rounded-md bg-success" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="h-8 w-8 rounded-md border bg-background" />
                <div className="h-8 w-8 rounded-md bg-background-darker" />
                <div className="h-8 w-8 rounded-md bg-stroke" />
                <div className="h-8 w-8 rounded-md bg-text" />
              </div>
            </div>
          </Section>
          <Section title="2. Text">
            <div className="flex gap-2">
              <div>
                <h1>Heading 1</h1>
                <h2>Heading 2</h2>
                <h3>Heading 3</h3>
                <h4>Heading 4</h4>
                <p className="font-light">Paragraph light</p>
                <p className="font-normal">Paragraph normal</p>
                <p className="font-medium">Paragraph medium</p>
                <p className="font-semibold">Paragraph semibold</p>
                <p className="font-bold">Paragraph bold</p>
              </div>
            </div>
          </Section>
        </div>
        <div className="flex h-full basis-1/4 flex-col gap-4">
          <Section title="3. Drop shadow">
            <div className="flex gap-2">
              <div className="flex flex-col gap-2">
                <div className="h-8 w-8 rounded-md bg-background shadow-1" />
                <div className="h-8 w-8 rounded-md bg-background shadow-2" />
                <div className="h-8 w-8 rounded-md bg-background shadow-3" />
              </div>
            </div>
          </Section>
          <Section title="4. Button">
            <div className="flex flex-col gap-2">
              <Button
                size="lg"
                variant="ghost"
                color="error"
                startIcon={<ArrowLeftCircleIcon />}
              >
                Button
              </Button>
              <Button
                size="lg"
                variant="ghost"
                color="error"
                disabled
                startIcon={<ArrowLeftCircleIcon />}
              >
                Button
              </Button>
            </div>
          </Section>
        </div>

        <div className="flex h-full  basis-1/4 flex-col gap-4">
          <Section title="6. Form">
            <div>
              <h4>Input</h4>
              <div className="space-y-2">
                <Input />
                <Input isError />
              </div>
            </div>
            <div className="mt-4">
              <h4>Select</h4>
              <div className="space-y-2">
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <h4>Switch</h4>
              <div className="space-y-2">
                <Switch />
              </div>
            </div>
          </Section>
        </div>
      </div>
    </main>
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
