/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import { ConfigYML } from "@possie-engine/dr-plugin-sdk/config/yml";
import { PluginComms } from "@possie-engine/dr-plugin-sdk/pluginComms";
import React, { useEffect, useRef, useState } from "react";
import { useMContext } from "./context";
import { Product } from "./product";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
const comms = new PluginComms({ defaultConfig: new ConfigYML() });
// !等下放开
const _f = comms.getConfigNode("fruits");
let fruits: string[] = [];
for (let i = 0; i < _f.length; i++) {
    if (!fruits.some((item) => item.toLowerCase() === _f[i].toLowerCase())) {
        fruits.push(_f[i]);
    } else {
        console.log("重复水果", _f[i]);
    }
}

// import { fruits } from './defaultData';

/** This section will include all the interface for this tsx file */
export interface WarehouseProps {
    handleChange: (res: string | undefined) => void;
    value?: string;
}
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
export const Warehouse: React.FC<WarehouseProps> = ({
    handleChange,
    value,
}) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/
    const listRef = useRef(JSON.parse(JSON.stringify(fruits)) as Array<string>);

    const [list, setList] = useState([...listRef.current]);

    const { mouseUpOnStorage } = useMContext();

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/
    useEffect(() => {
        const fn = () => {
            if (
                mouseUpOnStorage.current &&
                "warehouse" in mouseUpOnStorage.current
            ) {
                const val = mouseUpOnStorage.current.warehouse;

                const status = listRef.current.some((item) => item === val);

                if (!status) {
                    const arr = [...listRef.current];
                    arr.push(val);
                    listRef.current = [...arr];
                    setList([...listRef.current]);
                }
            }
        };
        document.addEventListener("touchend", fn);

        return () => {
            document.removeEventListener("touchend", fn);
        };
    }, [mouseUpOnStorage]);

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/

    const handleMouseUp = () => {
        if (!value) return;
        const status = listRef.current.some((item) => item === value);
        if (!status) {
            const arr = [...listRef.current];
            arr.push(value);
            listRef.current = [...arr];
            setList([...listRef.current]);
        }
        mouseUpOnStorage.current = { warehouse: value };
    };

    const onChange = (res: string | undefined) => {
        if (
            mouseUpOnStorage.current &&
            "storageCabinet" in mouseUpOnStorage.current &&
            !res
        ) {
            const data = mouseUpOnStorage.current.storageCabinet;
            const n = listRef.current.findIndex((item) => item === data.val);
            if (n >= 0) {
                const arr = [...listRef.current];
                arr.splice(n, 1);
                listRef.current = [...arr];
                setList([...arr]);
            }
        }

        handleChange(res);
    };

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <div className="warehouse_wrap">
            <div className="warehouse_total">
                共
                <span
                    className={`warehouse_totalVal${list.length ? "" : " red"}`}
                >
                    {list.length}
                </span>
                项
            </div>
            <div className="warehouse_items" onMouseUp={handleMouseUp}>
                <div
                    className="warehouse_placeholder"
                    style={list.length ? { display: "none" } : {}}
                >
                    无可拖拽的选项
                </div>
                <Product list={list} handleChange={onChange} value={value} />
            </div>
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
