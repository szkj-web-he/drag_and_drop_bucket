/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { useEffect, useState } from "react";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
interface TempProps {
    style?: React.CSSProperties;
    className?: string;
}
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const Temp: React.FC<TempProps> = ({ style, className }) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/
    const [el, setEl] = useState<SVGElement | null>(null);
    const [size, setSize] = useState<{
        width: number;
        height: number;
    }>();
    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/
    useEffect(() => {
        const fn = () => {
            if (!el) {
                return;
            }
            const parent = el.parentElement;

            if (parent instanceof HTMLElement) {
                setSize({
                    width: parent.offsetWidth,
                    height: parent.offsetHeight,
                });
            }
        };
        fn();
        window.addEventListener("resize", fn);
        return () => {
            window.removeEventListener("resize", fn);
        };
    }, [el]);

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/
    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    const width = size?.width ?? 52;
    const height = size?.height ?? 37;

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            style={style}
            className={className}
            fill="none"
            width={width}
            height={height}
            ref={setEl}
            xmlns="http://www.w3.org/2000/svg"
        >
            <g filter="url(#filter0_b_4520_10915)">
                <rect
                    width={width}
                    height={height}
                    rx="6"
                    fill="url(#paint0_linear_4520_10915)"
                    fillOpacity="0.4"
                />
                <rect
                    x="0.3"
                    y="0.3"
                    strokeDashoffset="0"
                    width={width - 0.6}
                    height={height - 0.6}
                    rx="5.7"
                    stroke="url(#paint1_linear_4520_10915)"
                    strokeWidth="0.6"
                />
            </g>
            <defs>
                <filter
                    id="filter0_b_4520_10915"
                    x="-6"
                    y="-6"
                    width={width + 12}
                    height={height + 12}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feGaussianBlur in="BackgroundImage" stdDeviation="3" />
                    <feComposite
                        in2="SourceAlpha"
                        operator="in"
                        result="effect1_backgroundBlur_4520_10915"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_backgroundBlur_4520_10915"
                        result="shape"
                    />
                </filter>
                <linearGradient
                    id="paint0_linear_4520_10915"
                    x1="-14"
                    y1="-12.5"
                    x2={width}
                    y2={height - 4}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#57F1F1" stopOpacity="0.9" />
                    <stop offset="1" stopColor="#0045A6" />
                </linearGradient>
                <linearGradient
                    id="paint1_linear_4520_10915"
                    x1="4.5"
                    y1="-3.5"
                    x2={width + 13}
                    y2={height + 11.5}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#57F1F1" />
                    <stop offset="1" stopColor="#007EFE" />
                </linearGradient>
            </defs>
        </svg>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
export default Temp;
