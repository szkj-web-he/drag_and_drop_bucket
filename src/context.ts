import { createContext, useContext } from "react";
import { OptionProps } from "./unit";

export interface MoveFnProps {
    x: number;
    y: number;
}

export type ValueChangeFnProps = OptionProps;

export interface BasketUpFnProps {
    index?: number;
    x: number;
    y: number;
    data: OptionProps;
}

interface ContextDataProps {
    isMobile: boolean;
    basketFn: React.MutableRefObject<{
        move: (x: number, y: number) => void;
        up: (res: BasketUpFnProps) => void;
    }>;
}
const contextData = (): ContextDataProps => ({
    isMobile: false,

    basketFn: {
        current: {
            move: () => undefined,
            up: () => undefined,
        },
    },
});

export const Context = createContext(contextData());

export const useMContext = (): ContextDataProps => useContext(Context);
