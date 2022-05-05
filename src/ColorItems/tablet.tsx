import React, { useEffect, useRef, useState } from 'react';
import { useMContext } from '../context';
import { Item } from '../item';
import { addClass, getMatrixAttr, getTransitionAttr, removeClass } from '../unit';
import { DeskProps } from './desk';

export const Tablet: React.FC<DeskProps> = ({ colors, handleChange, value, handleColorChange }) => {
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

    const { mouseUpOnStorage } = useMContext();

    const [list, setList] = useState([...listRef.current]);

    const [currentPage, setCurrentPage] = useState(0);

    const ref = useRef<HTMLDivElement | null>(null);

    const transitionData = useRef({
        count: 0,
        timeout: 0,
        active: '',
        propCount: 0,
    });

    const timeOut = useRef<number | null>(null);
    /**
     * status
     * 1 => 向右
     * -1 => 向左
     * null =>未声明
     */
    const touchData = useRef<{
        val: number;
        x: number;

        start: number;
        startTime: number;
        status: null | 1 | -1;
    }>({
        val: 0,
        x: 0,
        start: 0,
        startTime: 0,
        status: null,
    });

    /**
     * touch 事件的穿透处理
     * 本无穿透
     * 做穿透处理
     */
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
        handleColorChange(list);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list]);

    useEffect(() => {
        return () => {
            timeOut.current && window.clearTimeout(timeOut.current);
        };
    }, []);

    /**
     * 滑块功能 start
     */
    /**
     * 触摸时
     */
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;

        const x = e.changedTouches[0].pageX;

        const attr = getMatrixAttr(el);
        const val = Number(attr?.translateX) || 0;
        if (transitionData.current.active) {
            el.style.transform = `translateX(${val}px)`;
        }

        touchData.current = {
            x,
            start: x,
            val,
            startTime: Date.now(),
            status: 1,
        };

        timeOut.current && window.clearTimeout(timeOut.current);
        removeClass(el, 'transition');

        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
        document.addEventListener('touchcancel', handleTouchCancel);
    };
    /**
     * 触摸结束后
     */
    const handleTouchEnd = (e: TouchEvent) => {
        // var momentumTimeThreshold = 300; // 触发惯性滚动的最大时长，ms
        // var momentumYThreshold = 15; // 触发惯性滚动的最小位移距离，ms
        const el = ref.current;
        if (!el) return;
        const totalDistance = e.changedTouches[0].pageX - touchData.current.start;
        const totalTime = Date.now() - touchData.current.startTime;

        const v = Math.abs(totalDistance) / totalTime;
        console.log({
            totalDistance,
            totalTime,
            速度: Math.abs(totalDistance) / totalTime,
        });

        let value = currentPage;
        if (v > 0.8) {
            const total = Math.ceil(listRef.current.length / 6) - 1;

            if (touchData.current.status === 1) {
                console.log('向左移动');
                value -= 1;
            } else if (touchData.current.status === -1) {
                console.log('向右移动');
                value += 1;
            }
            console.log({ value, currentPage });

            if (value < 0) {
                value = 0;
            } else if (value > total) {
                value = total;
            }
        }
        console.log({ value });

        el.style.transform = `translateX(${(value ? -value : value) * el.offsetWidth}px)`;
        setCurrentPage(value);
        addClassName('transition');

        document.removeEventListener('touchend', handleTouchEnd);
        document.removeEventListener('touchcancel', handleTouchCancel);

        touchData.current.status = null;
        console.log(' ');
    };
    /**
     * 触摸移动中
     */
    const handleTouchMove = (e: TouchEvent) => {
        const el = ref.current;
        if (!el) return;

        const x = e.changedTouches[0].pageX;

        if (x >= touchData.current.x) {
            if (touchData.current.status !== 1) {
                touchData.current.status = 1;
                touchData.current.startTime = Date.now();
                touchData.current.start = x;
            }
        } else if (touchData.current.status !== -1) {
            touchData.current.status = -1;
            touchData.current.startTime = Date.now();
            touchData.current.start = x;
        }

        const moveVal = x - touchData.current.x;

        touchData.current.x = x;

        let val = touchData.current.val + moveVal;

        const total = Math.ceil(listRef.current.length / 6) - 1;

        if (val > 0) {
            val = 0;
        } else if (val < -total * el.offsetWidth) {
            val = -total * el.offsetWidth;
        }
        touchData.current.val = val;
        el.style.transform = `translateX(${val}px)`;
    };
    /**
     * 触摸取消
     */
    const handleTouchCancel = () => {
        const el = ref.current;
        if (!el) return;

        el.style.transform = `translateX(-${currentPage * el.offsetWidth}px);`;
        addClassName('transition');
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        document.removeEventListener('touchcancel', handleTouchCancel);
    };
    /**
     * 赋值过渡动画的class name
     */
    const addClassName = (name: string) => {
        const el = ref.current;
        if (!el) return;
        addClass(el, name);
        transitionData.current = {
            count: 0,
            active: name,
            ...getTransitionAttr(el),
        };
        el.addEventListener('transitionend', handleTransitionEnd);
        timeOut.current = window.setTimeout(transitionendFn, transitionData.current.timeout + 1);
    };
    /**
     *
     * 当过渡动画执行完成后
     */
    const handleTransitionEnd = () => {
        const el = ref.current;
        if (!el) return;

        ++transitionData.current.count;
        if (transitionData.current.count >= transitionData.current.propCount) {
            transitionendFn();
        }
    };

    const transitionendFn = () => {
        const el = ref.current;
        if (!el) return;
        removeClass(el, transitionData.current.active);
        transitionData.current = {
            count: 0,
            timeout: 0,
            active: '',
            propCount: 0,
        };
        el.removeEventListener('transitionend', handleTransitionEnd);
    };

    /**
     * 滑块功能 end
     */

    /**
     * 页码点击事件
     */
    const handlePageClick = (index: number) => {
        timeOut.current && window.clearTimeout(timeOut.current);
        const el = ref.current;
        if (!el) return;

        setCurrentPage(index);
        const val = -index * el.offsetWidth;
        el.style.transform = `translateX(${val}px)`;
        addClassName('transition');
    };

    /**
     * list的预处理
     * 每6个一组
     */
    const colorList: Array<
        Array<{
            name: string;
            values: string[];
        }>
    > = [];

    let start = -1;
    list.map((item, n) => {
        if (n % 6) {
            colorList[start].push({
                ...item,
            });
        } else {
            ++start;
            colorList[start] = [{ ...item }];
        }
    });

    return (
        <div className="tablet_colorWrap">
            <div className="tablet_colorContainer" onTouchStart={handleTouchStart}>
                <div className="tablet_colorContent" ref={ref}>
                    {colorList.map((colorArr, n) => {
                        return (
                            <ul key={n} className="tablet_colorList">
                                {colorArr.map((item, index) => {
                                    return (
                                        <li
                                            className="storageCabinet_item"
                                            key={item.name}
                                            data-i={n * 6 + index}
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
                                                            JSON.stringify(listRef.current),
                                                        ) as typeof listRef.current;

                                                        arr[n * 6 + index].values = [...res];
                                                        if (
                                                            JSON.stringify(arr) !==
                                                            JSON.stringify(listRef.current)
                                                        ) {
                                                            listRef.current = [...arr];
                                                            setList([...listRef.current]);
                                                        }
                                                    }}
                                                    index={n * 6 + index}
                                                    value={value}
                                                />
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        );
                    })}
                </div>
            </div>
            <div className="tablet_page">
                <div className="tablet_row">
                    {colorList.map((_, n) => {
                        return (
                            <span
                                className={`tablet_pageItem${currentPage === n ? ' active' : ''}`}
                                key={`page${n}`}
                                onTouchStart={(e) => e.stopPropagation()}
                                onClick={() => {
                                    handlePageClick(n);
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
