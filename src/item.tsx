/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React from 'react';
import { useMContext } from './context';
import { Product } from './product';
import { ScrollComponent } from './Scroll';
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
export interface ItemProps {
    handleChange: (res: string | undefined) => void;
    value?: string;
    values: string[];
    handleValuesChange: (res: string[]) => void;
    index: number;
}
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
export const Item: React.FC<ItemProps> = ({
    handleChange,
    value,
    values,
    handleValuesChange,
    index,
}) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/
    const { mouseUpOnStorage, isMobile } = useMContext();
    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/
    const onChange = (res: string | undefined) => {
        const data = mouseUpOnStorage.current;
        if (data && !res) {
            const val = 'warehouse' in data ? data.warehouse : data.storageCabinet.val;

            const n = values.findIndex((item) => item === val);

            if (n >= 0 && ('warehouse' in data || data.storageCabinet.index !== index)) {
                const arr = [...values];
                arr.splice(n, 1);
                handleValuesChange([...arr]);
            }
        }
        handleChange(res);
    };

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return isMobile ? (
        <div className="mobileScroll">
            <Product list={values} handleChange={onChange} value={value} />
        </div>
    ) : (
        <ScrollComponent>
            <Product list={values} handleChange={onChange} value={value} />
        </ScrollComponent>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
