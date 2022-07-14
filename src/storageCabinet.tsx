/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { BasketUpFnProps, useMContext } from "./context";
import { comms } from ".";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */

import { Desk } from "./ColorItems/desk";
import { SmallDesk } from "./ColorItems/smallDesk";
import { Tablet } from "./ColorItems/tablet";
import { Mobile } from "./ColorItems/mobile";
import { OptionProps } from "./unit";

export interface ListItemProps {
    code: string;
    content: string;
    values: OptionProps[];
}
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
export const StorageCabinet: React.FC = () => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/

    const { isMobile, basketFn } = useMContext();

    const [is1024, setIs1024] = useState(window.matchMedia("(max-width: 1000px)").matches);

    const [is375, setIs375] = useState(window.matchMedia("(max-width: 703px)").matches);

    const listRef = useRef<Array<ListItemProps>>(
        (comms.config.options?.[0] ?? []).map((item) => ({
            code: item.code,
            content: item.content,
            values: [],
        })),
    );
    const [list, setList] = useState([...listRef.current]);

    const indexRef = useRef<number>();
    const [activeIndex, setActiveIndex] = useState(indexRef.current);

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    useLayoutEffect(() => {
        let timer: null | number = null;
        const findIndex = (x: number, y: number) => {
            const els = document.elementsFromPoint(x, y);
            let n: number | null = null;
            for (let i = 0; i < els.length;) {
                const el = els[i];
                const classAttr = el.getAttribute("class")?.split(" ");
                if (classAttr?.includes("storageCabinet_item")) {
                    n = Number(el.getAttribute("data-i"));
                    i = els.length;
                } else {
                    ++i;
                }
            }
            return n;
        };

        basketFn.current = {
            move: (x: number, y: number) => {
                timer && window.clearTimeout(timer);
                timer = window.setTimeout(() => {
                    const n = findIndex(x, y);

                    indexRef.current = n ?? undefined;
                    setActiveIndex(indexRef.current);
                });
            },
            up: (res: BasketUpFnProps) => {
                timer && window.clearTimeout(timer);
                indexRef.current = undefined;
                setActiveIndex(indexRef.current);
                const n = findIndex(res.x, res.y);
                if (n === res.index) {
                    return;
                }

                const arr: typeof listRef.current = [];
                for (let i = 0; i < listRef.current.length; i++) {
                    if (i !== res.index) {
                        arr[i] = { ...listRef.current[i] };
                    } else {
                        arr[i] = {
                            code: listRef.current[i].code,
                            content: listRef.current[i].content,
                            values: [],
                        };
                        for (let j = 0; j < listRef.current[i].values.length; ++j) {
                            const item = listRef.current[i].values[j];
                            if (item.code !== res.data.code) {
                                arr[i].values.push({ ...item });
                            }
                        }
                    }
                }
                if (
                    typeof n === "number" &&
                    !listRef.current[n].values.some((item) => item.code === res.data.code)
                ) {
                    arr[n].values.push({
                        code: res.data.code,
                        content: res.data.content,
                    });
                }

                listRef.current = [...arr];
                setList([...listRef.current]);
            },
        };
        return () => {
            timer && window.clearTimeout(timer);
        };
    }, [basketFn]);

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

    useEffect(() => {
        const data: Record<string, Record<string, 0 | 1>> = {};

        const rows = comms.config.options?.[0] ?? [];
        const cols = comms.config.options?.[1] ?? [];

        for (let i = 0; i < rows.length; i++) {
            const subData: Record<string, 0 | 1> = {};


            for (let j = 0; j < cols.length; j++) {
                const item = cols[j];
                let val: 0 | 1 = 0;
                const selectData = list.find(a => a.code === rows[i].code);

                if (selectData?.values.some(a => a.code === item.code)) {
                    val = 1;
                }
                subData[item.code] = val;


            }
            data[rows[i].code] = subData;
        }


        comms.state = data;

    }, [list])
    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/

    let classStr = "storageCabinet_wrap";

    let mainEl = <></>;

    if (isMobile) {
        mainEl = is375 ? (
            <Mobile activeIndex={activeIndex} colors={list} />
        ) : (
            <Tablet activeIndex={activeIndex} colors={list} />
        );
    } else {
        mainEl = is1024 ? (
            <SmallDesk activeIndex={activeIndex} colors={list} />
        ) : (
            <Desk activeIndex={activeIndex} colors={list} />
        );
    }

    if (isMobile) {
        classStr += is375 ? " mobile" : " tablet";
    } else if (is1024) {
        classStr += " small_desk";
    } else {
        classStr += " desk";
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
