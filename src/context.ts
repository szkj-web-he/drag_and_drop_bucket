import { createContext, useContext } from 'react';

interface ContextDataProps {
    mouseUpOnStorage: React.MutableRefObject<false | 'warehouse' | { storageCabinet: number }>;
}

const contextData = (): ContextDataProps => ({
    mouseUpOnStorage: { current: false },
});

export const Context = createContext(contextData());

export const useMContext = () => useContext(Context);
