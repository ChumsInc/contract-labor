import React from 'react';
import {WorkTicketStatusEntry} from "../../types";
import Badge from "react-bootstrap/Badge";
import {Variant} from "react-bootstrap/types";

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
    return (
        <Badge bg={badgeColors[status.style] ?? 'secondary'} pill>{text}</Badge>
    )
}
