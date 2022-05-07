/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { useEffect, useState } from "react";
import { updateStateListener } from "./boilerplate";
import { useMContext } from "./context";
import { ConfigYML } from "@possie-engine/dr-plugin-sdk/config/yml";
import { PluginComms } from "@possie-engine/dr-plugin-sdk/pluginComms";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
const comms = new PluginComms({ defaultConfig: new ConfigYML() });

// !等下放开
const _f: string[] = comms.getConfigNode("colors");
// console.log({a})
let colors: string[] = [];
for (let i = 0; i < _f.length; i++) {
    if (!colors.some((item) => item.toLowerCase() === _f[i].toLowerCase())) {
        colors.push(_f[i]);
    } else {
        console.log("重复", _f[i]);
    }
}
// import { colors } from './defaultData';
import { Desk } from "./ColorItems/desk";
import { SmallDesk } from "./ColorItems/smallDesk";
import { Tablet } from "./ColorItems/tablet";
import { Mobile } from "./ColorItems/mobile";
export interface StorageCabinetProps {
    handleChange: (res: string | undefined) => void;
    value?: string;
}
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
export const StorageCabinet: React.FC<StorageCabinetProps> = ({
    handleChange,
    value,
}) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/

    const { isMobile } = useMContext();

    const [is1024, setIs1024] = useState(
        window.matchMedia("(max-width: 1000px)").matches
    );

    const [is375, setIs375] = useState(
        window.matchMedia("(max-width: 703px)").matches
    );

    const [list, setList] = useState<
        Array<{
            name: string;
            values: string[];
        }>
    >(
        colors.map((item) => ({
            name: item,
            values: [],
        }))
    );

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    useEffect(() => {
        const fn = () => {
            setIs1024(window.matchMedia("(max-width: 1000px)").matches);
            setIs375(window.matchMedia("(max-width: 703px)").matches);
        };
        window.addEventListener("resize", fn);
        return () => {
            window.removeEventListener("resize", fn);
        };
    }, []);

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/

    const handleColorChange = (
        res: {
            name: string;
            values: string[];
        }[]
    ) => {
        setList([...res]);
        const data: Record<string, string> = {};
        for (let i = 0; i < res.length; i++) {
            const item = res[i];
            data[item.name] = item.values.join(",");
        }
        updateStateListener(data);
    };

    let classStr = "storageCabinet_wrap";

    let mainEl = <></>;

    if (isMobile) {
        mainEl = is375 ? (
            <Mobile
                value={value}
                handleChange={handleChange}
                handleColorChange={handleColorChange}
                colors={list}
            />
        ) : (
            <Tablet
                value={value}
                handleChange={handleChange}
                handleColorChange={handleColorChange}
                colors={list}
            />
        );
    } else {
        mainEl = is1024 ? (
            <SmallDesk
                value={value}
                handleChange={handleChange}
                handleColorChange={handleColorChange}
                colors={list}
            />
        ) : (
            <Desk
                value={value}
                handleChange={handleChange}
                handleColorChange={handleColorChange}
                colors={list}
            />
        );
    }

    if (isMobile) {
        classStr += is375 ? " mobile" : " tablet";
    } else if (is1024) {
        classStr += " small_desk";
    }
    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <div className={classStr}>
            <div className="storageCabinet_total">
                共<span>{list.length}</span>
                个分类
            </div>
            {mainEl}
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
