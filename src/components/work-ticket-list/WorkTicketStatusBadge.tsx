import React from 'react';
import {WorkTicketStatusEntry} from "chums-types";
import Badge from "react-bootstrap/Badge";
import {Color, Variant} from "react-bootstrap/types";

export interface WorkTicketStatusBadgeProps {
    text: string;
    status?: Pick<WorkTicketStatusEntry,'style'>
}
export default function WorkTicketStatusBadge({text, status}:WorkTicketStatusBadgeProps){
    if (!status || !status.style) {
        return null;
    }
    const badgeColors:Record<number, Variant> = {
        1: 'info',
        2: 'success',
        3: 'warning',
        4: 'danger'
    }

    const badgeTextColor:Record<number, Color> = {
        1: 'dark',
        3: 'dark',
    }
    return (
        <Badge bg={badgeColors[status.style] ?? 'secondary'} pill
               text={badgeTextColor[status.style] ?? undefined}>
            {text}
        </Badge>
    )
}
