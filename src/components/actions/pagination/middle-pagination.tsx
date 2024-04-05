import { Button, ButtonProps } from "@/components/actions";
import { PaginationEllipsis, PaginationItem } from "@/components/ui/pagination";

const PaginationButton = ({ page, isActive, onClick, itemProps, ...props }: {
    page: number,
    isActive: boolean,
    onClick: (page: number) => void
    itemProps?: ButtonProps

}) => (
    <PaginationItem {...props}>
        <Button.Icon size={'xs'} className="!w-7 p-1 !h-7" onClick={() => onClick(page)} variant={isActive ? 'outline' : 'ghost'} {...itemProps}>
            {page}
        </Button.Icon>
    </PaginationItem>
);
const Ellipsis = () => (
    <PaginationItem>
        <PaginationEllipsis />
    </PaginationItem>
);


export const MiddlePaginationButtons = ({ pagination, onPageChange, itemProps, ...props }: {
    pagination: {
        totalPage: number,
        currentPage: number
    },
    itemProps?: ButtonProps,
    onPageChange: (page: number) => void
} & React.HTMLProps<HTMLDivElement>) => {

    const { totalPage, currentPage } = pagination;
    const buttons = [];

    if (totalPage <= 5) {
        for (let i = 1; i <= totalPage; i++) {
            buttons.push(<PaginationButton key={i} page={i} isActive={currentPage === i} onClick={onPageChange} itemProps={itemProps} />);
        }
    } else {
        if (currentPage <= 3) {
            for (let i = 1; i <= 3; i++) {
                buttons.push(<PaginationButton key={i} page={i} isActive={currentPage === i} onClick={onPageChange} itemProps={itemProps} />);
            }
            buttons.push(<Ellipsis key="ellipsis" />);
            buttons.push(<PaginationButton key={totalPage} page={totalPage} isActive={currentPage === totalPage} onClick={onPageChange} itemProps={itemProps} />);
        } else if (currentPage >= totalPage - 2) {
            buttons.push(<PaginationButton key={1} page={1} isActive={currentPage === 1} onClick={onPageChange} itemProps={itemProps} />);
            buttons.push(<Ellipsis key="ellipsis" />);
            for (let i = totalPage - 2; i <= totalPage; i++) {
                buttons.push(<PaginationButton key={i} page={i} isActive={currentPage === i} onClick={onPageChange} itemProps={itemProps} />);
            }
        } else {
            buttons.push(<PaginationButton key={1} page={1} isActive={currentPage === 1} onClick={onPageChange} itemProps={itemProps} />);
            buttons.push(<Ellipsis key="ellipsis-start" />);
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                buttons.push(<PaginationButton key={i} page={i} isActive={currentPage === i} onClick={onPageChange} itemProps={itemProps} />);
            }
            buttons.push(<Ellipsis key="ellipsis-end" />);
            buttons.push(<PaginationButton key={totalPage} page={totalPage} isActive={currentPage === totalPage} onClick={onPageChange} itemProps={itemProps} />);
        }
    }

    return <div {...props}>{buttons}</div>;
};