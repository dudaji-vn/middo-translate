import StationsList from './_components/stations-list';
import CreateStation from './station-crud/station-creation/create-station';

enum WorkStationModalType {
  CreateStation = 'create-station',
}
const StationStationPage = async (props: {
  searchParams: {
    modal: WorkStationModalType;
  };
}) => {
  const { searchParams } = props;
  const modal = searchParams.modal;
  const isCreateStationModalOpen = Boolean(
    modal === WorkStationModalType.CreateStation,
  );
  return (
    <main className="h-full w-full">
      {!isCreateStationModalOpen && <StationsList />}
      <CreateStation open={isCreateStationModalOpen} />
    </main>
  );
};

export default StationStationPage;
