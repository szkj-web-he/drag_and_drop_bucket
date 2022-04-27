/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { useRef, useState } from 'react';
import { useMContext } from './context';
import { Item } from './item';
import { defaultTypes } from './unit';
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
export interface StorageCabinetProps {
    handleChange: (res: string | undefined) => void;
    value?: string;
}
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
export const StorageCabinet: React.FC<StorageCabinetProps> = ({ handleChange, value }) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/

    const listRef = useRef<
        Array<{
            name: string;
            values: string[];
        }>
    >(
        defaultTypes.map((item) => {
            return {
                name: item,
                values: [],
            };
        }),
    );

    const [list, setList] = useState([...listRef.current]);

    const { mouseUpOnStorage } = useMContext();

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/

    const handleMouseUp = ({ values }: { name: string; values: string[] }, n: number) => {
        if (!value) return;
        const status = values.some((val) => val === value);
        if (!status) {
            values.push(value);
        }

        const arr = [...listRef.current];
        arr[n].values = [...values];
        listRef.current = [...arr];
        setList([...listRef.current]);

        mouseUpOnStorage.current = { storageCabinet: n };
    };

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <div className="storageCabinet_wrap">
            <div className="storageCabinet_total">
                共<span>{list.length}</span>
                个分类
            </div>
            <div className="storageCabinet_row">
                {list.map((item, n) => {
                    return (
                        <div
                            className="storageCabinet_item"
                            key={item.name}
                            onMouseUp={() => handleMouseUp(item, n)}
                        >
                            <div className="storageCabinet_itemTitle">{item.name}</div>
                            <div className="storageCabinet_itemValues">
                                <Item
                                    values={item.values}
                                    handleChange={handleChange}
                                    handleValuesChange={(res) => {
                                        listRef.current[n].values = [...res];
                                        setList([...listRef.current]);
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
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
