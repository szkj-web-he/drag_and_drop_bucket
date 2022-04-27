import './font';
import './style.scss';

import { listenToParentIPC, render } from './boilerplate';
import { Warehouse } from './warehouse';
import { useRef, useState } from 'react';
import { StorageCabinet } from './storageCabinet';
import { Context } from './context';

listenToParentIPC();

const Main = () => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/
    const [selectItem, setSelectItem] = useState<string>();
    const status = useRef<false | 'warehouse' | { storageCabinet: number }>(false);
    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/
    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <Context.Provider
            value={{
                mouseUpOnStorage: status,
            }}
        >
            <div className="wrapper">
                <div className="h1">
                    Copy Q1. 请对以下水果进行分类。
                    <span className="des">（一个框可放一个或多个，至少放一个）</span>
                </div>
                <Warehouse handleChange={(res) => setSelectItem(res)} value={selectItem} />
                <StorageCabinet handleChange={(res) => setSelectItem(res)} value={selectItem} />
            </div>
        </Context.Provider>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */

render(<Main />);
