/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { useEffect, useRef, useState } from "react";
import { drawItemRoundRect } from "./unit";
import { useLayoutEffect } from "react";
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
    const [el, setEl] = useState<HTMLCanvasElement | null>(null);

    const timer = useRef<number>();

    const elRef = useRef(el);

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/
    useLayoutEffect(() => {
        elRef.current = el;
        if (el) {
            timer.current && window.clearTimeout(timer.current);
            timer.current = window.setTimeout(() => {
                timer.current = undefined;

                drawItemRoundRect(el);
            });
        }
    }, [el]);

    useEffect(() => {
        const fn = () => {
            timer.current && window.clearTimeout(timer.current);
            timer.current = window.setTimeout(() => {
                const node = elRef.current;
                timer.current = undefined;
                if (!node) {
                    return;
                }

                drawItemRoundRect(node);
            });
        };
        window.addEventListener("resize", fn);
        return () => {
            window.removeEventListener("resize", fn);
            timer.current && window.clearTimeout(timer.current);
        };
    }, []);

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */

    return (
        <>
            <canvas className={className} style={style} ref={(el) => setEl(el)} />
            <div className="triangle" />
        </>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
export default Temp;
