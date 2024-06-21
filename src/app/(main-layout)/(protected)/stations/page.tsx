import StationsList from './_components/stations-list';
import CreateStation from './station-crud/create-station';

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

  return (
    <main className="h-full w-full">
      <StationsList />
      <CreateStation
        open={Boolean(modal === WorkStationModalType.CreateStation)}
      />
    </main>
  );
};

export default StationStationPage;
