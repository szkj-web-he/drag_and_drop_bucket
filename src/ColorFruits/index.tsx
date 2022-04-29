/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { useEffect, useRef, useState } from 'react';
import { updateStateListener } from '../boilerplate';
import { useMContext } from '../context';
import { Item } from './item';
// import { defaultTypes } from './unit';
import { ConfigYML } from '@possie-engine/dr-plugin-sdk/config/yml';
import { PluginComms } from '@possie-engine/dr-plugin-sdk/pluginComms';
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
const comms = new PluginComms({ defaultConfig: new ConfigYML() });

// !等下放开
// const colors: string[] = comms.getConfigNode('colors');
import { colors } from '../defaultData';
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
        colors.map((item) => {
            return {
                name: item,
                values: [],
            };
        }),
    );

    const [list, setList] = useState([...listRef.current]);

    const { mouseUpOnStorage, isMobile, position } = useMContext();

    const [is1024, setIs1024] = useState(window.matchMedia('(max-width: 1000px)').matches);

    const [is375, setIs375] = useState(window.matchMedia('(max-width: 768px)').matches);

    const ref = useRef<HTMLDivElement | null>(null);

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    useEffect(() => {
        const fn = () => {
            setIs1024(window.matchMedia('(max-width: 1000px)').matches);
            setIs375(window.matchMedia('(max-width: 768px)').matches);
        };
        window.addEventListener('resize', fn);
        return () => {
            window.removeEventListener('resize', fn);
        };
    }, []);

    useEffect(() => {
        const data: Record<string, string> = {};
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            data[item.name] = item.values.join(',');
        }
        updateStateListener(data);
    }, [list]);

    useEffect(() => {
        const fn = () => {
            if (mouseUpOnStorage.current && 'storageCabinet' in mouseUpOnStorage.current) {
                const data = mouseUpOnStorage.current['storageCabinet'];
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

                setList([...listRef.current]);
            }
        };
        document.addEventListener('touchend', fn);

        return () => {
            document.removeEventListener('touchend', fn);
        };
    }, [mouseUpOnStorage]);

    useEffect(() => {
        const fn = () => {
            const el = ref.current;
            if (!el) return;

            const childList = el.children;

            const els = position ? document.elementsFromPoint(position.x, position.y) : [];

            for (let i = 0; i < childList.length; i++) {
                const child = childList[i];
                const status = els.some((item) => item === child);
                const classList = child.getAttribute('class')?.split(' ') || [];
                const n = classList?.findIndex((item) => item === 'active');
                if (status) {
                    if (n === undefined || n < 0) {
                        classList.push('active');
                        child.setAttribute('class', classList.join(' '));
                    }
                } else if (typeof n === 'number' && n > 0) {
                    classList.splice(n, 1);
                    child.setAttribute('class', classList.join(' '));
                }
            }
        };

        const timer = window.setTimeout(fn);
        return () => {
            window.clearTimeout(timer);
        };
    }, [position]);

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

        mouseUpOnStorage.current = {
            storageCabinet: {
                index: n,
                val: value,
            },
        };
    };

    let classStr = 'storageCabinet_wrap';
    if (isMobile) {
        classStr += is375 ? ' 375' : ' mobile';
    } else {
        classStr += is1024 ? ' 1024' : '';
    }
    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <div className={classStr}>
            <div className="storageCabinet_total">
                共<span>{list.length}</span>
                个分类
            </div>
            <div className="storageCabinet_row" ref={ref}>
                {list.map((item, n) => {
                    return (
                        <div
                            className="storageCabinet_item"
                            key={`${item.name}`}
                            data-i={n}
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
