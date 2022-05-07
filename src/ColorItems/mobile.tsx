import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useMContext } from "../context";
import { Item } from "../item";
import { DeskProps } from "./desk";

export const Mobile: React.FC<DeskProps> = ({
    colors,
    handleChange,
    value,
    handleColorChange,
}) => {
    const listRef = useRef([...colors]);

    const { mouseUpOnStorage } = useMContext();

    useLayoutEffect(() => {
        listRef.current = [...colors];
    }, [colors]);
    /**
     * touch 事件的穿透处理
     * 本无穿透
     * 做穿透处理
     */
    useEffect(() => {
        const fn = () => {
            if (
                mouseUpOnStorage.current &&
                "storageCabinet" in mouseUpOnStorage.current
            ) {
                const data = mouseUpOnStorage.current["storageCabinet"];
                const n = data.index;
                const values = listRef.current[n].values;
                const val = data.val;
                const status = values.some((item) => item === val);

                if (!status) {
                    values.push(val);
                }
                const arr = [...listRef.current];
                arr[n].values = [...values];
                listRef.current = [...arr];

                handleColorChange([...listRef.current]);
            }
        };
        document.addEventListener("touchend", fn);

        return () => {
            document.removeEventListener("touchend", fn);
        };
    }, [mouseUpOnStorage]);

    return (
        <div className="mobile_colorWrap">
            <div className="mobile_colorContainer">
                {colors.map((item, n) => {
                    return (
                        <div
                            className="storageCabinet_item"
                            key={item.name}
                            data-i={n}
                        >
                            <div className="storageCabinet_itemTitle">
                                {item.name}
                            </div>
                            <div className="storageCabinet_itemValues">
                                <Item
                                    values={item.values}
                                    handleChange={handleChange}
                                    handleValuesChange={(res) => {
                                        const arr = JSON.parse(
                                            JSON.stringify(listRef.current)
                                        ) as typeof listRef.current;

                                        arr[n].values = [...res];
                                        if (
                                            JSON.stringify(arr) !==
                                            JSON.stringify(listRef.current)
                                        ) {
                                            listRef.current = [...arr];
                                            handleColorChange([
                                                ...listRef.current,
                                            ]);
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
        </div>
    );
};
