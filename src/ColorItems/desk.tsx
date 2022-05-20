import React, { useLayoutEffect, useRef } from "react";
import { Item } from "../item";
import { useMContext } from "../context";
import { ListItemProps, StorageCabinetProps } from "../storageCabinet";
import { useListenPosition } from "../useListenPosition";
import { OptionProps } from "../unit";

export interface DeskProps extends StorageCabinetProps {
    colors: Array<ListItemProps>;
    handleColorChange: (res: ListItemProps[]) => void;
}

export const Desk: React.FC<DeskProps> = ({ colors, handleChange, value, handleColorChange }) => {
    const listRef = useRef([...colors]);

    const { mouseUpOnStorage } = useMContext();

    const ref = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
        listRef.current = [...colors];
    }, [colors]);

    useListenPosition(ref);

    const handleMouseUp = ({ values }: ListItemProps, n) => {
        if (!value) return;

        const status = values.some((val) => val.code === value.code);
        if (!status) {
            values.push({
                code: value.code,
                content: value.content,
            });
        }
        const arr = [...listRef.current];

        arr[n].values = [...values];

        listRef.current = [...arr];

        handleColorChange([...listRef.current]);

        mouseUpOnStorage.current = {
            index: n,
            val: {
                code: value.code,
                content: value.content,
            },
        };
    };

    const handleUp = (item: ListItemProps, n: number, res: OptionProps | undefined) => {
        const data = mouseUpOnStorage.current;
        handleChange(undefined);
        if (n === data?.index) {
            return;
        }
        const index = item.values.findIndex((val) => val.code === res?.code);
        if (index >= 0) {
            item.values.splice(index, 1);
        }

        handleColorChange([...listRef.current]);
    };

    return (
        <div className="storageCabinet_row" ref={ref}>
            {colors.map((item, n) => {
                return (
                    <div
                        className="storageCabinet_item"
                        key={`${item.code}`}
                        data-i={n}
                        onMouseUp={() => handleMouseUp(item, n)}
                    >
                        <div className="storageCabinet_itemTitle">{item.content}</div>
                        <div className="storageCabinet_itemValues">
                            <Item
                                values={item.values}
                                handleChange={handleChange}
                                onUp={(res) => handleUp(item, n, res)}
                                index={n}
                                value={value ? JSON.parse(JSON.stringify(value)) : undefined}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
