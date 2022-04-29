import './font';
import './style.scss';

import { listenToParentIPC, render } from './boilerplate';
import { Warehouse } from './warehouse';
import { useEffect, useRef, useState } from 'react';
import { StorageCabinet } from './storageCabinet';
import { Context } from './context';
import { isMobile } from './isMobile';

listenToParentIPC();

const Main = () => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/
    const [selectItem, setSelectItem] = useState<string>();

    const status = useRef<
        { warehouse: string } | { storageCabinet: { index: number; val: string } }
    >();

    const [mobileStatus, setMobileStatus] = useState(isMobile);

    const [position, setPosition] = useState<{
        x: number;
        y: number;
    }>();

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

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/
    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <Context.Provider
            value={{
                mouseUpOnStorage: status,
                isMobile: mobileStatus,
                position,
                setPosition,
            }}
        >
            <div className="wrapper">
                <Warehouse handleChange={(res) => setSelectItem(res)} value={selectItem} />
                <StorageCabinet handleChange={(res) => setSelectItem(res)} value={selectItem} />
            </div>
        </Context.Provider>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */

render(<Main />);
