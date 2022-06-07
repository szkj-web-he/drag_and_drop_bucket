import React, { useEffect, useRef, useState } from "react";
import { Item } from "../item";
import { ScrollComponent } from "../Scroll";
import { DeskProps } from "./desk";
import flower from "../Assets/svg/lotus_flower.svg";
import Iframe from "../typeIcon";
import Arrow from "../arrow";
import ArrowBg from "../arrowBg";

export const SmallDesk: React.FC<DeskProps> = ({ colors, activeIndex }) => {
    const ref = useRef<HTMLDivElement | null>(null);

    const scrollEl = useRef<HTMLDivElement | null>(null);

    const [showBtn, setShowBtn] = useState(false);

    const scrollTimer = useRef<number>();
    /**
     * 0 起点
     * 1 终点
     * 2 在起点或终点之间
     */
    const [scrollStatus, setScrollStatus] = useState<0 | 1 | 2>(0);

    useEffect(() => {
        const fn = () => {
            const el = ref.current;

            if (!el) return;
            setShowBtn(el.scrollWidth > el.offsetWidth);
        };

        window.addEventListener("resize", fn);
        fn();
        return () => {
            window.removeEventListener("resize", fn);
            scrollTimer.current && window.clearTimeout(scrollTimer.current);
        };
    }, []);

    const getScrollEl = () => {
        const el = scrollEl.current;
        if (!el) return;
        let node: null | Element = null;
        for (let i = 0; i < el.children.length; ) {
            const item = el.children[i];
            if (
                item
                    .getAttribute("class")
                    ?.split(" ")
                    .some((val) => val === "scroll_scrollBody")
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
            behavior: "smooth",
        });
    };
    const toRight = () => {
        if (scrollStatus === 1) return;
        const node = getScrollEl();
        if (!node) return;
        node.scrollTo({
            left: node.scrollLeft + 164,
            behavior: "smooth",
        });
    };

    const handleScroll = ({
        left,
        scrollWidth,
        clientWidth,
        offsetWidth,
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
        if (scrollTimer.current) {
            window.clearTimeout(scrollTimer.current);
        }
        scrollTimer.current = window.setTimeout(() => {
            window.clearTimeout(scrollTimer.current);
            scrollTimer.current = undefined;

            const el = scrollEl.current;
            if (!el) return;
            const childrenList = el.children;

            let scrollBody: null | HTMLElement = null;
            for (let i = 0; i < childrenList.length; ) {
                const childrenElement = childrenList[i];
                const classAttr = childrenElement.getAttribute("class")?.split(" ");
                if (classAttr?.includes("smallDesk_scrollBody")) {
                    i = childrenList.length;
                    if (childrenElement instanceof HTMLElement) {
                        scrollBody = childrenElement;
                    }
                } else {
                    ++i;
                }
            }

            if (!scrollBody) return;

            const rect = scrollBody.getBoundingClientRect();

            left = Math.round(left);
            if (
                left + clientWidth >= scrollWidth ||
                left + offsetWidth >= scrollWidth ||
                Math.ceil(rect.width) + left >= scrollWidth
            ) {
                setScrollStatus(1);
            } else if (left <= 0) {
                setScrollStatus(0);
            } else {
                setScrollStatus(2);
            }
        });
    };

    return (
        <>
            {showBtn && (
                <div className="arrowContainer">
                    <div
                        className={`arrowContainer_pre${scrollStatus === 0 ? " gray" : ""}`}
                        onClick={toLeft}
                    >
                        <ArrowBg className="arrowContainer_bgIcon" />
                        <Arrow className="arrowContainer_icon" />
                    </div>
                    <div
                        className={`arrowContainer_next${scrollStatus === 1 ? " gray" : ""}`}
                        onClick={toRight}
                    >
                        <ArrowBg className="arrowContainer_bgIcon" />
                        <Arrow className="arrowContainer_icon" />
                    </div>
                </div>
            )}
            <ScrollComponent
                height="220px"
                className="smallDesk_scrollWrap"
                bodyClassName="smallDesk_scrollBody"
                handleBarChange={handleScroll}
                ref={scrollEl}
            >
                <div className="storageCabinet_smallDeskRow" ref={ref}>
                    {colors.map((item, n) => {
                        return (
                            <div
                                className={`storageCabinet_item${
                                    activeIndex === n ? " active" : ""
                                }`}
                                key={item.code}
                                data-i={n}
                            >
                                <Iframe className="storageCabinet_view" />
                                <div
                                    className="storageCabinet_itemBg"
                                    dangerouslySetInnerHTML={{
                                        __html: flower,
                                    }}
                                />

                                <div className="storageCabinet_itemTitle">{item.content}</div>
                                <div className="storageCabinet_itemValues">
                                    <Item values={item.values} index={n} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollComponent>
        </>
    );
};
