import "./style.scss";

import { Warehouse } from "./warehouse";
import React, { useEffect, useRef, useState } from "react";
import { StorageCabinet } from "./storageCabinet";
import { BasketUpFnProps, Context } from "./context";
import { isMobile } from "./isMobile";
import { PluginComms, ConfigYML } from "@possie-engine/dr-plugin-sdk";
import Hr from "./hr";

export const comms = new PluginComms({
    defaultConfig: new ConfigYML(),
}) as {
    config: {
        question?: string;
        instruction?: string;
        options?: Array<Array<{ code: string; content: string }>>;
    };
    state: unknown;
    renderOnReady: (res: React.ReactNode) => void;
};
const Main: React.FC = () => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/

    const [mobileStatus, setMobileStatus] = useState(isMobile);

    const basketFn = useRef<{
        move: (x: number, y: number) => undefined;
        up: (res: BasketUpFnProps) => undefined;
    }>({
        move: () => undefined,
        up: () => undefined,
    });
    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    useEffect(() => {
        const fn = () => {
            setMobileStatus(isMobile);
        };
        window.addEventListener("resize", fn);
        return () => {
            window.removeEventListener("resize", fn);
        };
    }, []);

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <div className={`wrapper${mobileStatus ? ` mobile` : ""}`}>
            <div className="question">
                <div
                    className="questionContent"
                    dangerouslySetInnerHTML={{
                        __html: comms.config.question ?? "",
                    }}
                />
                <div
                    className="questionDes"
                    dangerouslySetInnerHTML={{
                        __html: `(${comms.config.instruction ?? ""})`,
                    }}
                />
            </div>
            <Context.Provider
                value={{
                    isMobile: mobileStatus,
                    basketFn,
                }}
            >
                <Warehouse />
                <Hr />
                <StorageCabinet />
            </Context.Provider>
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */

void comms.renderOnReady(<Main />);
