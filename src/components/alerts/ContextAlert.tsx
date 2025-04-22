import React from 'react';
import {AlertProps, Badge} from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import {useAppDispatch} from "@/app/configureStore";

export interface ContextAlertProps extends AlertProps {
    context?: string;
    count?: number;
    message?: string;
}

export default function ContextAlert({context, count, message, variant, children, ...props}: ContextAlertProps) {
    const dispatch = useAppDispatch();

    const onDismiss = () => {

    }
    return (
        <Alert variant={variant} {...props}>
            {context && <Alert.Heading>
                {context}
                {(count ?? 0) > 1 && (<Badge bg={variant}>{count}</Badge>)}
            </Alert.Heading>}
            {message ?? children}
        </Alert>
    )
}
