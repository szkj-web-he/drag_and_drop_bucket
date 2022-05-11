/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import { ConfigYML } from "@possie-engine/dr-plugin-sdk/config/yml";
import { PluginComms } from "@possie-engine/dr-plugin-sdk/pluginComms";
import React, { useEffect, useRef, useState } from "react";
import { useMContext } from "./context";
import { Product } from "./product";
import { OptionProps } from "./unit";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
const comms = new PluginComms({ defaultConfig: new ConfigYML() });

const options = comms.getConfigNode('options')[1] as Array<Record<string, string>>;

// const fruits = options.map(item => { const key = Object.keys(item)[0]; return item[key] });

/** This section will include all the interface for this tsx file */
export interface WarehouseProps {
    handleChange: (res: OptionProps | undefined) => void;
    value?: OptionProps;

}
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
export const Warehouse: React.FC<WarehouseProps> = ({
    handleChange,
    value,
}) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/
    const listRef = useRef(JSON.parse(JSON.stringify(options)) as Array<OptionProps>);

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

                const data = listRef.current.some((item) => item.code === val.code);

                if (!data) {
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

    const onChange = (res: OptionProps | undefined) => {
        if (
            mouseUpOnStorage.current &&
            "storageCabinet" in mouseUpOnStorage.current &&
            !res
        ) {
            const data = mouseUpOnStorage.current.storageCabinet;
            const n = listRef.current.findIndex((item) => item.code === data.val.code);
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
