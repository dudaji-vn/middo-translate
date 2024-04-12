import { useEffect, useRef } from 'react';

import { ReactSketchCanvasRef } from 'react-sketch-canvas';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { cn } from '@/utils/cn';
import { DoodleProvider } from './context/doodle-context-context';
import DrawlingShareScreen from './components/drawling-share-screen';

interface IDoodleShareScreenProps {
    width: number;
    height: number;
}
export const DoodleShareScreen = (props: IDoodleShareScreenProps) => {

    const { width, height } = props;

    const colorDoodle = useVideoCallStore(state => state.colorDoodle);
    const isDrawing = useVideoCallStore(state => state.isDrawing);

    const canvasRef = useRef<ReactSketchCanvasRef>(null);
    // const {width, height} = useFitSizeImage({imageRef, canvasRef});

    useEffect(() => {
        // socket.emit(SOCKET_CONFIG.EVENTS.CALL.REQUEST_GET_OLD_DOODLE_DATA)
    }, [])

    return (
        <DoodleProvider>
            <div className='rounded-xl overflow-hidden absolute top-0 left-0 transition-all w-full h-full  bg-transparent'>
                <DrawlingShareScreen
                    ref={canvasRef} 
                    color={colorDoodle}
                    width={width} 
                    height={height}
                    className={cn('absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 z-10 bg-transparent', isDrawing ? 'cursor-drawing' : 'cursor-auto pointer-events-none')}
                />
            </div>
        </DoodleProvider>
    );
};
