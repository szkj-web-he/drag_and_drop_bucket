/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */

import React from "react";
import { Product } from "./product";
import { comms } from ".";
import { ScrollComponent } from "./Scroll";
import Frame from "./frame";
import { useMContext } from "./context";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */

// const fruits = options.map(item => { const key = Object.keys(item)[0]; return item[key] });

/** This section will include all the interface for this tsx file */

/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
export const Warehouse: React.FC = () => {
    const { isMobile } = useMContext();

    const params = comms.config.options?.[1] ?? [];

    return (
        <div className="warehouse_wrap">
            <div className="warehouse_total">
                共
                <span className={`warehouse_totalVal${params.length ? "" : " red"}`}>
                    {params.length}
                </span>
                项
            </div>
            <div className="warehouse_container">
                <Frame type="top" />
                {isMobile ? (
                    <div className="warehouse_items">
                        <div className="warehouse_body">
                            <Product list={params} />
                        </div>
                    </div>
                ) : (
                    <ScrollComponent
                        className="warehouse_scrollWrap"
                        bodyClassName="warehouse_scrollBody"
                        hidden={{
                            x: true,
                        }}
                    >
                        <div className="warehouse_body">
                            <Product list={params} />
                        </div>
                    </ScrollComponent>
                )}
            </div>
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
