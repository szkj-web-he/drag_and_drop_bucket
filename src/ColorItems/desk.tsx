import React, { useEffect, useLayoutEffect, useRef } from "react";
import { Item } from "../item";
import { useMContext } from "../context";
import { ListItemProps, StorageCabinetProps } from "../storageCabinet";
import { OptionProps } from "../unit";

export interface DeskProps extends StorageCabinetProps {
    colors: Array<ListItemProps>;
    handleColorChange: (
        res: ListItemProps[]
    ) => void;
}

export const Desk: React.FC<DeskProps> = ({
    colors,
    handleChange,
    value,
    handleColorChange,
}) => {
    const listRef = useRef([...colors]);

    const { mouseUpOnStorage, position } = useMContext();

    const ref = useRef<HTMLDivElement | null>(null);


    useLayoutEffect(() => {
        listRef.current = [...colors];
    }, [colors]);

    useEffect(() => {
        const fn = () => {
            const el = ref.current;
            if (!el) return;

            const childList = el.children;

            const els = position
                ? document.elementsFromPoint(position.x, position.y)
                : [];

            for (let i = 0; i < childList.length; i++) {
                const child = childList[i];
                const status = els.some((item) => item === child);
                const classList = child.getAttribute("class")?.split(" ") || [];
                const n = classList?.findIndex((item) => item === "active");
                if (status) {
                    if (n === undefined || n < 0) {
                        classList.push("active");
                        child.setAttribute("class", classList.join(" "));
                    }
                } else if (typeof n === "number" && n > 0) {
                    classList.splice(n, 1);
                    child.setAttribute("class", classList.join(" "));
                }
            }
        };

        const timer = window.setTimeout(fn);
        return () => {
            window.clearTimeout(timer);
        };
    }, [position]);

    const handleMouseUp = (
        { values }: ListItemProps,
        n: number,

    ) => {

        if (!value) return;
        const status = values.some((val) => val.code === value.code);
        if (!status) {
            values.push({
                code: value.code,
                content: value.content
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
                content: value.content
            },
        };
    };

    const handleUp = (item: ListItemProps, n: number, res: OptionProps | undefined) => {

        const data = mouseUpOnStorage.current;

        if (n === data?.index) { return }

        const index = item.values.findIndex(val => val.code === res?.code);
        if (index >= 0) {
            item.values.splice(index, 1)
        }

        handleColorChange([...listRef.current]);
        handleChange(undefined)
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
                        <div className="storageCabinet_itemTitle">
                            {item.content}
                        </div>
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
