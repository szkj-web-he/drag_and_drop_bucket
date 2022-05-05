import { useEffect, useRef, useState } from 'react';
import { useMContext } from '../context';
import { Item } from '../item';
import { ScrollComponent } from '../Scroll';
import { Icon } from '../icon';
import { DeskProps } from './desk';

export const SmallDesk: React.FC<DeskProps> = ({
    colors,
    handleChange,
    value,
    handleColorChange,
}) => {
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

    const { mouseUpOnStorage, position } = useMContext();

    const [list, setList] = useState([...listRef.current]);

    const ref = useRef<HTMLDivElement | null>(null);

    const scrollEl = useRef<HTMLDivElement | null>(null);
    /**
     * 0 起点
     * 1 终点
     * 2 在起点或终点之间
     */
    const [scrollStatus, setScrollStatus] = useState<0 | 1 | 2>(0);

    useEffect(() => {
        console.log({ scrollStatus });
    }, [scrollStatus]);

    const getScrollEl = () => {
        const el = scrollEl.current;
        if (!el) return;
        let node: null | Element = null;
        for (let i = 0; i < el.children.length; ) {
            const item = el.children[i];
            if (
                item
                    .getAttribute('class')
                    ?.split(' ')
                    .some((val) => val === 'scroll_scrollBody')
            ) {
                i = el.children.length;

                node = item;
            } else {
                ++i;
            }
        }
        return node;
    };

    const toLeft = () => {
        if (scrollStatus === 0) return;
        const node = getScrollEl();
        if (!node) return;
        node.scrollTo({
            left: node.scrollLeft - 165,
            behavior: 'smooth',
        });
    };
    const toRight = () => {
        if (scrollStatus === 1) return;
        const node = getScrollEl();
        if (!node) return;
        node.scrollTo({
            left: node.scrollLeft + 164,
            behavior: 'smooth',
        });
    };

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

    useEffect(() => {
        handleColorChange(list);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list]);

    const handleMouseUp = ({ values }: { name: string; values: string[] }, n: number) => {
        if (!value) return;
        const status = values.some((val) => val === value);
        if (!status) {
            values.push(value);
        }

        const arr = [...listRef.current];
        arr[n].values = [...values];

        if (JSON.stringify(listRef.current) !== JSON.stringify(arr)) {
            listRef.current = [...arr];
            setList([...listRef.current]);
        }

        mouseUpOnStorage.current = {
            storageCabinet: {
                index: n,
                val: value,
            },
        };
    };

    const handleScroll = ({
        left,
        scrollWidth,
        clientWidth,
    }: {
        left: number;
        top: number;
        scrollHeight: number;
        scrollWidth: number;
        offsetHeight: number;
        offsetWidth: number;
        clientHeight: number;
        clientWidth: number;
    }) => {
        if (Math.ceil(left + clientWidth) >= scrollWidth) {
            setScrollStatus(1);
        } else if (left <= 0) {
            setScrollStatus(0);
        } else {
            setScrollStatus(2);
        }
    };

    return (
        <>
            <div className="arrowContainer">
                <div
                    className={`arrowContainer_pre${scrollStatus === 0 ? ' gray' : ''}`}
                    onClick={toLeft}
                >
                    <Icon className="arrowContainer_icon" />
                </div>
                <div
                    className={`arrowContainer_next${scrollStatus === 1 ? ' gray' : ''}`}
                    onClick={toRight}
                >
                    <Icon className="arrowContainer_icon" />
                </div>
            </div>
            <ScrollComponent
                height="220px"
                className="smallDesk_scrollWrap"
                bodyClassName="smallDesk_scrollBody"
                handleBarChange={handleScroll}
                ref={scrollEl}
            >
                <div className="storageCabinet_smallDeskRow" ref={ref}>
                    {list.map((item, n) => {
                        return (
                            <div
                                className="storageCabinet_item"
                                key={item.name}
                                data-i={n}
                                onMouseUp={() => handleMouseUp(item, n)}
                            >
                                <div className="storageCabinet_itemTitle">{item.name}</div>
                                <div className="storageCabinet_itemValues">
                                    <Item
                                        values={item.values}
                                        handleChange={handleChange}
                                        handleValuesChange={(res) => {
                                            const arr = JSON.parse(
                                                JSON.stringify(listRef.current),
                                            ) as typeof listRef.current;

                                            arr[n].values = [...res];
                                            if (
                                                JSON.stringify(arr) !==
                                                JSON.stringify(listRef.current)
                                            ) {
                                                listRef.current = [...arr];
                                                setList([...listRef.current]);
                                            }
                                        }}
                                        index={n}
                                        value={value}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollComponent>
        </>
    );
};
