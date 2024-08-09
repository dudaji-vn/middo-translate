import CreateStation from '../station-crud/station-creation/create-station';

const CreateStationPage = async () => {
  return (
    <main className="h-full w-full">
      <CreateStation open />
    </main>
  );
};

export default CreateStationPage;
