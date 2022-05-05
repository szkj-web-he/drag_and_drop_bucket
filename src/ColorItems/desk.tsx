import { useEffect, useRef, useState } from 'react';
import { Item } from '../item';
import { useMContext } from '../context';
import { StorageCabinetProps } from '../storageCabinet';

export interface DeskProps extends StorageCabinetProps {
    colors: string[];
    handleColorChange: (
        res: {
            name: string;
            values: string[];
        }[],
    ) => void;
}

export const Desk: React.FC<DeskProps> = ({ colors, handleChange, value, handleColorChange }) => {
    const listRef = useRef<
        Array<{
            name: string;
            values: string[];
        }>
    >(
        colors.map((item) => {
            return {
                name: item,
                values: [],
            };
        }),
    );

    const { mouseUpOnStorage, position } = useMContext();

    const [list, setList] = useState([...listRef.current]);

    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fn = () => {
            const el = ref.current;
            if (!el) return;

            const childList = el.children;

            const els = position ? document.elementsFromPoint(position.x, position.y) : [];

            for (let i = 0; i < childList.length; i++) {
                const child = childList[i];
                const status = els.some((item) => item === child);
                const classList = child.getAttribute('class')?.split(' ') || [];
                const n = classList?.findIndex((item) => item === 'active');
                if (status) {
                    if (n === undefined || n < 0) {
                        classList.push('active');
                        child.setAttribute('class', classList.join(' '));
                    }
                } else if (typeof n === 'number' && n > 0) {
                    classList.splice(n, 1);
                    child.setAttribute('class', classList.join(' '));
                }
            }
        };

        const timer = window.setTimeout(fn);
        return () => {
            window.clearTimeout(timer);
        };
    }, [position]);

    useEffect(() => {
        handleColorChange(list);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list]);

    const handleMouseUp = ({ values }: { name: string; values: string[] }, n: number) => {
        if (!value) return;
        const status = values.some((val) => val === value);
        if (!status) {
            values.push(value);
        }

        const arr = [...listRef.current];
        arr[n].values = [...values];

        if (JSON.stringify(listRef.current) !== JSON.stringify(arr)) {
            listRef.current = [...arr];
            setList([...listRef.current]);
        }

        mouseUpOnStorage.current = {
            storageCabinet: {
                index: n,
                val: value,
            },
        };
    };

    return (
        <div className="storageCabinet_row" ref={ref}>
            {list.map((item, n) => {
                return (
                    <div
                        className="storageCabinet_item"
                        key={`${item.name}`}
                        data-i={n}
                        onMouseUp={() => handleMouseUp(item, n)}
                    >
                        <div className="storageCabinet_itemTitle">{item.name}</div>
                        <div className="storageCabinet_itemValues">
                            <Item
                                values={item.values}
                                handleChange={handleChange}
                                handleValuesChange={(res) => {
                                    const arr = JSON.parse(
                                        JSON.stringify(listRef.current),
                                    ) as typeof listRef.current;

                                    arr[n].values = [...res];
                                    if (JSON.stringify(arr) !== JSON.stringify(listRef.current)) {
                                        listRef.current = [...arr];
                                        setList([...listRef.current]);
                                    }
                                }}
                                index={n}
                                value={value}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
