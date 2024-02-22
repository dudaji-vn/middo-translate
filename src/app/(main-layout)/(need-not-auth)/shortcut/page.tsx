import { Typography } from '@/components/data-display';
import React from 'react';



export default function Shortcuts() {
    const listItems = ['←', '↓ / J', '↑ / K', '→'];

    return (
        <section className="container my-10 max-w-screen-md space-y-3 divide-y [&_h3]:mt-3 [&_h3]:text-[1.25rem]">
            <Typography variant="h2" className="text-md font-bold">
                Shortcut Information
            </Typography>

            <div className="flex flex-row justify-between">
                <Typography variant="h3">Miido Translation</Typography>
                <div className="flex flex-row [&_span]:bg-stone-300 [&_span]:rounded-md  w-fit [&_span]:p-1 [&_span]:m-2">
                    {listItems.map((item, index) => (
                        <span key={index}>{item}</span>
                    ))}
                </div>
            </div>
            <div>
                <Typography variant="h3">Miido Conversation</Typography>
            </div>
            <ul></ul>
            <div>
                <Typography variant="h3">Miido call</Typography> <ul></ul>
            </div>
        </section>
    );
}
