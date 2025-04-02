import React, {InputHTMLAttributes, useId} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectCurrentIssueHeader, setEntryTemplate, updateCurrentEntry} from "@/ducks/issue-entry/issueEntrySlice";
import IssueTemplateLookup from "@/components/issue-entry/IssueTemplateLookup";
import {CLIssueEntry} from "@/src/types";
import {WorkTemplate} from "chums-types";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

export interface IssueTemplateProps extends InputHTMLAttributes<HTMLInputElement> {
    templateNo: string;
    inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>;
}

export default function IssueTemplate() {
    const dispatch = useAppDispatch();
    const _id = useId();
    const current = useAppSelector(selectCurrentIssueHeader);

    const valueChangeHandler = (field: keyof CLIssueEntry) => (value: string) => {
        switch (field) {
            case 'TemplateNo':
                dispatch(updateCurrentEntry({[field]: value}));
                return;
        }
    }

    const selectTemplateHandler = (template: WorkTemplate | null) => {
        console.log(template);
        dispatch(setEntryTemplate(template));
    }

    if (!current.WorkTicketNo) {
        return (
            <div className="mb-1">
                <IssueTemplateLookup templateNo={current.TemplateNo}
                                     onChange={valueChangeHandler('TemplateNo')}
                                     onSelectTemplate={selectTemplateHandler}
                />
            </div>
        )
    }

    return (
        <InputGroup className="mb-1" size="sm">
            <InputGroup.Text as="label" htmlFor={_id}>Template</InputGroup.Text>
            <FormControl type="text" readOnly disabled id={_id} value={current.TemplateNo ?? ''}/>
        </InputGroup>
    )
}
