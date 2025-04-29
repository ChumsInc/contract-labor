import React, {TextareaHTMLAttributes} from 'react';
import styled from "@emotion/styled";

const ScrollArea = styled.div`
    display: flex;
    width: 100%;
    overflow-y: auto;
    box-sizing: border-box;
    margin-bottom: 0.375rem;
    
    &:focus-within {
        color: var(--bs-body-color);
        background-color: var(--bs-body-bg);
        border-color: #86b7fe;
        outline: 0;
        box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
    }
    .input-group & {
        margin-bottom: 0 !important;
    }
`

const ScrollContent = styled.div`
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    //overflow-y: auto;
`

const StyledTextArea = styled.textarea`
    field-sizing: content;
    overflow: hidden;
    border: none;
    resize: none;
    padding: 0;
    outline: none;
    width: 100%;
    background-color: transparent;
    &:focus {
        box-shadow: none;
        border-color: transparent;
    }
`

export interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'rows'|'cols'> {
    maxHeight?: string;
    minHeight?: string;
    minRows?: number;
    maxRows?: number;
}

export default function TextArea({maxHeight, minHeight, minRows, maxRows, ...props}: TextAreaProps) {
    if (!minHeight && !!minRows) {
        minHeight = `${minRows * 21}px`;
    }
    if (!maxHeight && !!maxRows) {
        maxHeight = `${maxRows * 21}px`;
    }
    return (
        <ScrollArea className="form-control form-control-sm mb-1" style={{maxHeight, minHeight}}>
            <ScrollContent>
                <StyledTextArea {...props} />
            </ScrollContent>
        </ScrollArea>
    )
}
