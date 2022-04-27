/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { useLayoutEffect, useRef, useState } from 'react';
import { useMContext } from './context';
import { Product } from './product';
import { defaultItems } from './unit';
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
export interface WarehouseProps {
    handleChange: (res: string | undefined) => void;
    value?: string;
}
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
export const Warehouse: React.FC<WarehouseProps> = ({ handleChange, value }) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/
    const [list, setList] = useState(JSON.parse(JSON.stringify(defaultItems)) as Array<string>);

    const { mouseUpOnStorage } = useMContext();

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

    const handleMouseUp = () => {
        if (!value) return;
        const status = list.some((item) => item === value);
        if (!status) {
            const arr = [...list];
            arr.push(value);
            setList([...arr]);
        }
        mouseUpOnStorage.current = 'warehouse';
    };

    const onChange = (res: string | undefined) => {
        if (valRef.current && !res) {
            const n = list.findIndex((item) => item === valRef.current);
            if (n >= 0 && typeof mouseUpOnStorage.current === 'object') {
                const arr = [...list];
                arr.splice(n, 1);
                setList([...arr]);
            }
        }
        handleChange(res);
    };

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <div className="warehouse_wrap">
            <div className="warehouse_total">
                共<span className="warehouse_totalVal">{list.length}</span>项
            </div>
            <div className="warehouse_items" onMouseUp={handleMouseUp}>
                <Product list={list} handleChange={onChange} value={value} />
            </div>
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
