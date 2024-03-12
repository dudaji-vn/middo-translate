import { redirect, } from "next/navigation";


const Page = async (props: {
  params: {
    id: string;
  };
}) => {
  redirect('/business/conversations');
};

export default Page;
