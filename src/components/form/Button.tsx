import Link from "next/link";

interface ButtonProps {
    href?: string;
    tag?: string;
    children?: React.ReactNode;
    [x:string]: any;
}

export const Button = ( props: ButtonProps ) => {
    let { tag, href, children, ...rest } = props;

    let Component = null;
    const componentProps:any = {}

    if (tag === 'a') {
        Component = Link;
        componentProps.href = href;
    } else {
        Component = 'button';
    }

    return (
        <Component
            className={`relative mt-10 mx-auto flex w-full items-center justify-center rounded-full border border-transparent bg-primary px-8 py-4 font-semibold text-background active:!border-transparent active:!bg-shading active:!text-background md:max-w-[320px] md:hover:border md:hover:border-primary md:hover:bg-background md:hover:text-primary ${props.disabled && '!bg-slate-400 pointer-events-none'}`}
            {...componentProps}
            {...rest}
        >
            {children}
        </Component>
    )
}