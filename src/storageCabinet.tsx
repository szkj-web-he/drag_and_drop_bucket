/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { useEffect, useRef, useState } from "react";
import { comms } from ".";
import { BasketUpFnProps, useMContext } from "./context";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */

import { Desk } from "./ColorItems/desk";
import { Mobile } from "./ColorItems/mobile";
import { SmallDesk } from "./ColorItems/smallDesk";
import { Tablet } from "./ColorItems/tablet";
import Frame from "./frame";
import { OptionProps } from "./unit";
import { isMobile } from "./isMobile";
import { deepCloneData } from "./unit";

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

    const { basketFn } = useMContext();

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

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

    const [contentEl, setContentEl] = useState(() => {
        if (isMobile()) {
            return window.matchMedia("(max-width: 703px)").matches ? (
                <Mobile activeIndex={activeIndex} colors={list}>
                    <Frame type="bottom" />
                </Mobile>
            ) : (
                <Tablet activeIndex={activeIndex} colors={list}>
                    <Frame type="bottom" />
                </Tablet>
            );
        } else {
            return window.matchMedia("(max-width: 1000px)").matches ? (
                <SmallDesk activeIndex={activeIndex} colors={list}>
                    <Frame type="bottom" />
                </SmallDesk>
            ) : (
                <Desk activeIndex={activeIndex} colors={list}>
                    <Frame type="bottom" />
                </Desk>
            );
        }
    });
    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    useEffect(() => {
        const timer: null | number = null;
        const findIndex = (x: number, y: number) => {
            const els = document.elementsFromPoint(x, y);
            let n: number | null = null;
            for (let i = 0; i < els.length; ) {
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
                setActiveIndex(() => {
                    const n = findIndex(x, y);
                    indexRef.current = n ?? undefined;
                    return n ?? undefined;
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

                const arr = deepCloneData(listRef.current);
                let status = false;
                if (typeof n === "number") {
                    //是否已经存在
                    for (let i = 0; i < arr[n].values.length; ) {
                        const item = arr[n].values[i];
                        if (item.code === res.data.code) {
                            status = true;
                            i = arr[n].values.length;
                        } else {
                            ++i;
                        }
                    }
                }
                if (status && res.index === undefined) {
                    return;
                }

                //这里 删除
                for (let i = 0; i < arr.length; ) {
                    if (i === res.index) {
                        let index = -1;
                        for (let j = 0; j < arr[i].values.length; ) {
                            const item = arr[i].values[j];
                            if (item.code === res.data.code) {
                                index = j;
                                j = arr[i].values.length;
                            } else {
                                ++j;
                            }
                        }
                        if (index >= 0) {
                            arr[i].values.splice(index, 1);
                        }

                        i = arr.length;
                    } else {
                        ++i;
                    }
                }
                //这里添加
                if (typeof n === "number" && !status) {
                    arr[n].values.push({
                        code: res.data.code,
                        content: res.data.content,
                    });
                }
                listRef.current = [...arr];
                setList(deepCloneData([...listRef.current]));
            },
        };
        return () => {
            timer && window.clearTimeout(timer);
        };
    }, [basketFn]);

    useEffect(() => {
        const fn = () => {
            setScreenWidth(window.innerWidth);
        };
        window.addEventListener("resize", fn);
        return () => {
            window.removeEventListener("resize", fn);
        };
    }, []);

    useEffect(() => {
        setContentEl(() => {
            if (isMobile()) {
                return window.matchMedia("(max-width: 703px)").matches ? (
                    <Mobile activeIndex={activeIndex} colors={list}>
                        <Frame type="bottom" />
                    </Mobile>
                ) : (
                    <Tablet activeIndex={activeIndex} colors={list}>
                        <Frame type="bottom" />
                    </Tablet>
                );
            } else {
                return window.matchMedia("(max-width: 1000px)").matches ? (
                    <SmallDesk activeIndex={activeIndex} colors={list}>
                        <Frame type="bottom" />
                    </SmallDesk>
                ) : (
                    <Desk activeIndex={activeIndex} colors={list}>
                        <Frame type="bottom" />
                    </Desk>
                );
            }
        });
    }, [activeIndex, list, screenWidth]);

    useEffect(() => {
        const data: Record<string, Record<string, string>> = {};

        const rows = comms.config.options?.[0] ?? [];
        const cols = comms.config.options?.[1] ?? [];

        for (let i = 0; i < rows.length; i++) {
            const subData: Record<string, string> = {};

            for (let j = 0; j < cols.length; j++) {
                const item = cols[j];
                let val = "0";
                const selectData = list.find((a) => a.code === rows[i].code);

                if (selectData?.values.some((a) => a.code === item.code)) {
                    val = "1";
                }
                subData[item.code] = val;
            }
            data[rows[i].code] = subData;
        }
        comms.state = data;
    }, [list]);
    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/

    let classStr = "storageCabinet_wrap";

    if (isMobile()) {
        classStr += window.matchMedia("(max-width: 703px)").matches ? " mobile" : " tablet";
    } else if (window.matchMedia("(max-width: 1000px)").matches) {
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
            {contentEl}
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
