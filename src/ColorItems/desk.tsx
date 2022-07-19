import React from "react";
import { Item } from "../item";
import { ListItemProps } from "../storageCabinet";
import { ScrollComponent } from "../Scroll";
import Box from "./container";
export interface DeskProps {
    activeIndex?: number;
    colors: Array<ListItemProps>;
    children?: React.ReactNode;
}

export const Desk: React.FC<DeskProps> = ({ colors, activeIndex, children }) => {
    return (
        <ScrollComponent className="storageCabinet_deskScrollWrap">
            {children}
            <div className="storageCabinet_row">
                {colors.map((item, n) => {
                    return (
                        <Box
                            index={n}
                            key={`${item.code}`}
                            isActive={activeIndex === n}
                            title={item.content}
                        >
                            <Item values={item.values} index={n} />
                        </Box>
                    );
                })}
            </div>
        </ScrollComponent>
    );
};
