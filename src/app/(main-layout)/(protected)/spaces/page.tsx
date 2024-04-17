import BusinessSpaces from "./[spaceId]/_components/business-spaces";
import CreateOrEditSpace from "./[spaceId]/_components/spaces-crud/create-or-edit-space";

enum BusinessModalType {
  CreateSpace = 'create-space',
}
const BusinessSpacePage = async (props: {
  params: {
    id: string;
  },
  searchParams: {
    modal: BusinessModalType;
  }
}) => {
  const { searchParams } = props;
  const modal = searchParams.modal;



  return <main className="w-full h-full">
    <BusinessSpaces />
    <CreateOrEditSpace open={Boolean(modal === BusinessModalType.CreateSpace)} />
  </main>
};

export default BusinessSpacePage;
