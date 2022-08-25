/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React from "react";
import { Product } from "./product";
import { ScrollComponent } from "./Scroll";
import { OptionProps } from "./unit";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
export interface ItemProps {
    values: OptionProps[];
    index: number;
}
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
export const Item: React.FC<ItemProps> = ({ values, index }) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */

    const content = (
        <div className="scrollBody">
            <Product list={values} index={index} />
        </div>
    );

    return <ScrollComponent hidden={{ x: true, y: false }}>{content}</ScrollComponent>;
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
