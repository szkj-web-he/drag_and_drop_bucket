/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useMContext } from './context';
import { isMobile } from './isMobile';
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
    const [mobileStatus, setMobileStatus] = useState(isMobile);

    const valRef = useRef(value);

    const { mouseUpOnStorage } = useMContext();
    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/
    useEffect(() => {
        const fn = () => {
            setMobileStatus(isMobile);
        };
        window.addEventListener('resize', fn);
        return () => {
            window.removeEventListener('resize', fn);
        };
    }, []);

    useLayoutEffect(() => {
        valRef.current = value;
    }, [value]);
    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/
    const onChange = (res: string | undefined) => {
        if (valRef.current && !res) {
            const n = values.findIndex((item) => item === valRef.current);
            const data = mouseUpOnStorage.current;

            if (n >= 0 && data && (data === 'warehouse' || data.storageCabinet !== index)) {
                const arr = [...values];
                arr.splice(n, 1);
                handleValuesChange([...arr]);
            }
        }
        handleChange(res);
    };

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return mobileStatus ? (
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
