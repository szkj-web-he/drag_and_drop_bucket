import { createContext, useContext } from 'react';

interface ContextDataProps {
    mouseUpOnStorage: React.MutableRefObject<
        | {
              warehouse: string;
          }
        | {
              storageCabinet: {
                  index: number;
                  val: string;
              };
          }
        | undefined
    >;
    isMobile: boolean;
    position?: {
        x: number;
        y: number;
    };
    setPosition: React.Dispatch<
        React.SetStateAction<
            | {
                  x: number;
                  y: number;
              }
            | undefined
        >
    >;
}

const contextData = (): ContextDataProps => ({
    mouseUpOnStorage: { current: undefined },
    isMobile: false,
    position: undefined,
    setPosition: () => undefined,
});

export const Context = createContext(contextData());

export const useMContext = () => useContext(Context);
