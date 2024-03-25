import { Button } from "@/components/actions";
import { PaginationEllipsis, PaginationItem } from "@/components/ui/pagination";

const PaginationButton = ({ page, isActive, onClick }: {
    page: number,
    isActive: boolean,
    onClick: (page: number) => void

}) => (
    <PaginationItem>
        <Button.Icon size={'xs'} className='max-md:hidden' onClick={() => onClick(page)} variant={isActive ? 'outline' : 'ghost'}>
            {page}
        </Button.Icon>
    </PaginationItem>
);
const Ellipsis = () => (
    <PaginationItem>
        <PaginationEllipsis />
    </PaginationItem>
);


export const MiddlePaginationButtons = ({ pagination, onPageChange }: {
    pagination: {
        totalPage: number,
        currentPage: number
    },
    onPageChange: (page: number) => void
}) => {
    const { totalPage, currentPage } = pagination;
    const buttons = [];

    if (totalPage <= 5) {
        for (let i = 1; i <= totalPage; i++) {
            buttons.push(<PaginationButton key={i} page={i} isActive={currentPage === i} onClick={onPageChange} />);
        }
    } else {
        if (currentPage <= 3) {
            for (let i = 1; i <= 3; i++) {
                buttons.push(<PaginationButton key={i} page={i} isActive={currentPage === i} onClick={onPageChange} />);
            }
            buttons.push(<Ellipsis key="ellipsis" />);
            buttons.push(<PaginationButton key={totalPage} page={totalPage} isActive={currentPage === totalPage} onClick={onPageChange} />);
        } else if (currentPage >= totalPage - 2) {
            buttons.push(<PaginationButton key={1} page={1} isActive={currentPage === 1} onClick={onPageChange} />);
            buttons.push(<Ellipsis key="ellipsis" />);
            for (let i = totalPage - 2; i <= totalPage; i++) {
                buttons.push(<PaginationButton key={i} page={i} isActive={currentPage === i} onClick={onPageChange} />);
            }
        } else {
            buttons.push(<PaginationButton key={1} page={1} isActive={currentPage === 1} onClick={onPageChange} />);
            buttons.push(<Ellipsis key="ellipsis-start" />);
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                buttons.push(<PaginationButton key={i} page={i} isActive={currentPage === i} onClick={onPageChange} />);
            }
            buttons.push(<Ellipsis key="ellipsis-end" />);
            buttons.push(<PaginationButton key={totalPage} page={totalPage} isActive={currentPage === totalPage} onClick={onPageChange} />);
        }
    }

    return buttons;
};