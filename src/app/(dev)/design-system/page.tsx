import {
  ArrowBack,
  ArrowBackOutline,
  ArrowCircleDown,
  ArrowCircleDownOutline,
  ArrowCircleLeftOutline,
  ArrowIosDownward,
  ArrowIosDownwardOutline,
  CheckmarkCircle2,
  CheckmarkCircle2Outline,
  Close,
  CloseCircle,
  CloseCircleOutline,
  CloseOutline,
  Copy,
  CopyOutline,
  Edit,
  EditOutline,
  FileAdd,
  FileAddOutline,
  FileText,
  FileTextOutline,
  Globe2,
  Globe2Outline,
  Heart,
  HeartOutline,
  Image as ImageIcon,
  ImageOutline,
  Menu,
  Mic,
  MicOutline,
  Options2,
  Options2Outline,
  Refresh,
  RefreshOutline,
  Swap,
  SwapOutline,
} from '@easy-eva-icons/react';
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/data-entry';

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
    <main className="max-w-screen flex min-h-screen flex-col items-center overflow-x-hidden p-4">
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
              <Button startIcon={<ArrowCircleLeftOutline />}>Button</Button>
              <Button variant="outline" startIcon={<ArrowCircleLeftOutline />}>
                Button
              </Button>
              <Button disabled>Button</Button>
            </div>
          </Section>
        </div>
        <div className="flex h-full  basis-1/4 flex-col gap-4">
          <Section title="5. Icon">
            <div className="flex w-full flex-wrap gap-2">
              <div className="w-fit rounded-md border border-dashed border-purple-500 p-2">
                <Menu className="h-7 w-7" />
                <Menu className="h-7 w-7" />
              </div>
              <div className="w-fit rounded-md border border-dashed border-purple-500 p-2">
                <MicOutline className="h-7 w-7" />
                <Mic className="h-7 w-7" />
              </div>
              <div className="w-fit rounded-md border border-dashed border-purple-500 p-2">
                <EditOutline className="h-7 w-7" />
                <Edit className="h-7 w-7" />
              </div>
              <div className="w-fit rounded-md border border-dashed border-purple-500 p-2">
                <CloseCircleOutline className="h-7 w-7" />
                <CloseCircle className="h-7 w-7" />
              </div>
              <div className="w-fit rounded-md border border-dashed border-purple-500 p-2">
                <HeartOutline className="h-7 w-7" />
                <Heart className="h-7 w-7" />
              </div>
              <div className="w-fit rounded-md border border-dashed border-purple-500 p-2">
                <FileAddOutline className="h-7 w-7" />
                <FileAdd className="h-7 w-7" />
              </div>
              <div className="w-fit rounded-md border border-dashed border-purple-500 p-2">
                <ArrowCircleDownOutline className="h-7 w-7" />
                <ArrowCircleDown className="h-7 w-7" />
              </div>
              <div className="w-fit rounded-md border border-dashed border-purple-500 p-2">
                <FileTextOutline className="h-7 w-7" />
                <FileText className="h-7 w-7" />
              </div>
              <div className="w-fit rounded-md border border-dashed border-purple-500 p-2">
                <ImageOutline className="h-7 w-7" />
                <ImageIcon className="h-7 w-7" />
              </div>
              <div className="w-fit rounded-md border border-dashed border-purple-500 p-2">
                <ArrowBackOutline className="h-7 w-7" />
                <ArrowBack className="h-7 w-7" />
              </div>
              <div className="w-fit rounded-md border border-dashed border-purple-500 p-2">
                <ArrowIosDownwardOutline className="h-7 w-7" />
                <ArrowIosDownward className="h-7 w-7" />
              </div>
              <div className="w-fit rounded-md border border-dashed border-purple-500 p-2">
                <CheckmarkCircle2Outline className="h-7 w-7" />
                <CheckmarkCircle2 className="h-7 w-7" />
              </div>
              <div className="w-fit rounded-md border border-dashed border-purple-500 p-2">
                <CloseOutline className="h-7 w-7" />
                <Close className="h-7 w-7" />
              </div>
              <div className="w-fit rounded-md border border-dashed border-purple-500 p-2">
                <Options2Outline className="h-7 w-7" />
                <Options2 className="h-7 w-7" />
              </div>

              <div className="w-fit rounded-md border border-dashed border-purple-500 p-2">
                <CopyOutline className="h-7 w-7" />
                <Copy className="h-7 w-7" />
              </div>
              <div className="w-fit rounded-md border border-dashed border-purple-500 p-2">
                <Globe2Outline className="h-7 w-7" />
                <Globe2 className="h-7 w-7" />
              </div>
              <div className="w-fit rounded-md border border-dashed border-purple-500 p-2">
                <SwapOutline className="h-7 w-7" />
                <Swap className="h-7 w-7" />
              </div>
              <div className="w-fit rounded-md border border-dashed border-purple-500 p-2">
                <RefreshOutline className="h-7 w-7" />
                <Refresh className="h-7 w-7" />
              </div>
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
