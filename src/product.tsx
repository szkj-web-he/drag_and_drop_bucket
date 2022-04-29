/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import { createPortal } from 'react-dom';
import React, { useLayoutEffect, useRef } from 'react';
import { stopSelect } from './noSelected';
import { useMContext } from './context';
import { getScrollValue } from './getScrollValue';

/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
export interface ProductProps {
    list: Array<string>;
    handleChange: (res: string | undefined) => void;
    value?: string;
}
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
export const Product: React.FC<ProductProps> = ({ list, handleChange, value }) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/

    const { mouseUpOnStorage, isMobile, position, setPosition } = useMContext();

    const selectedFn = useRef<typeof document.onselectstart>(null);

    const point = useRef({
        pageX: 0,
        pageY: 0,
        x: 0,
        y: 0,
    });

    // const [style, setStyle] = useState<React.CSSProperties>();

    const valRef = useRef(value);

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    useLayoutEffect(() => {
        valRef.current = value;
    }, [value]);

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/

    // 当移动时
    const handleMove = (e: MouseEvent | React.TouchEvent<HTMLDivElement>) => {
        if (!valRef.current) return;

        let x = 0;
        let y = 0;
        if (e instanceof MouseEvent) {
            x = e.pageX;
            y = e.pageY;
        } else {
            const position = e.changedTouches[0];
            x = position.pageX;
            y = position.pageY;
        }
        const moveX = x - point.current.pageX;
        const moveY = y - point.current.pageY;

        point.current.x = moveX + point.current.x;
        point.current.y = moveY + point.current.y;
        point.current.pageX = x;
        point.current.pageY = y;

        setPosition({ ...point.current });
    };

    // 当鼠标 或者手 弹起时的通用事件
    const handleUp = () => {
        document.onselectstart = selectedFn.current;
        point.current = {
            x: 0,
            y: 0,
            pageX: 0,
            pageY: 0,
        };

        setPosition(undefined);
        handleChange(undefined);
    };

    // 当鼠标弹起时
    const handleMouseUp = () => {
        handleUp();
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    // 当手离开屏幕时
    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!valRef.current) return;

        const position = e.changedTouches[0];

        const x = position.pageX;
        const y = position.pageY;
        const els = document.elementsFromPoint(x, y);

        for (let i = 0; i < els.length; ) {
            const el = els[i];

            if (el.nodeName !== 'HTML' && el.nodeName !== 'BODY') {
                const className = el.getAttribute('class');
                if (className?.split(' ').includes('storageCabinet_item')) {
                    const n = el.getAttribute('data-i');
                    if (n) {
                        mouseUpOnStorage.current = {
                            storageCabinet: { index: Number(n), val: valRef.current },
                        };
                    }
                    i = els.length;
                } else if (className?.includes('warehouse_items')) {
                    mouseUpOnStorage.current = { warehouse: valRef.current };
                    i = els.length;
                }
            }
            ++i;
        }

        handleUp();
    };

    // 手或者鼠标 按下的通用事件
    const handleDown = (
        item: string,
        e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>,
        position: {
            x: number;
            y: number;
        },
    ) => {
        handleChange(item);
        stopSelect(e, selectedFn, true);

        const scrollData = getScrollValue();
        const rect = e.currentTarget.getBoundingClientRect();
        const rectX = rect.left + scrollData.x;
        const rectY = rect.top + scrollData.y;

        point.current = {
            pageX: position.x,
            pageY: position.y,
            x: rectX,
            y: rectY,
        };
        setPosition({
            ...point.current,
        });

        mouseUpOnStorage.current = undefined;
    };

    // 当鼠标按下时
    const handleMouseDown = (item: string, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        handleDown(item, e, {
            x: e.pageX,
            y: e.pageY,
        });
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    //当手触摸时
    const handleTouchStart = (item: string, e: React.TouchEvent<HTMLDivElement>) => {
        const position = e.changedTouches[0];
        handleDown(item, e, {
            x: position.pageX,
            y: position.pageY,
        });
    };

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <>
            {list.map((item) => {
                return (
                    <div
                        className={`item${value === item ? ' gray' : ''}`}
                        key={item}
                        {...(isMobile
                            ? {
                                  onTouchStart: (e) => {
                                      handleTouchStart(item, e);
                                  },
                                  onTouchMove: handleMove,
                                  onTouchEnd: handleTouchEnd,
                              }
                            : {
                                  onMouseDown: (e) => {
                                      handleMouseDown(item, e);
                                  },
                              })}
                    >
                        {item}
                    </div>
                );
            })}

            {!!position &&
                createPortal(
                    <div
                        className="floating"
                        style={{
                            left: `${position.x}px`,
                            top: `${position.y}px`,
                        }}
                    >
                        {value}
                    </div>,
                    document.body,
                )}
        </>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
