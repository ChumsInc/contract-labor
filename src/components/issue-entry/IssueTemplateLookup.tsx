import React, {HTMLAttributes, useEffect, useId, useState} from 'react';
import {WorkTemplate} from "chums-types";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectCurrentTemplate, selectTemplatesList, setCurrentTemplate} from "@/ducks/templates/templatesSlice";
import {Autocomplete, createFilterOptions} from "@mui/material";
import {isStepsList} from "@/ducks/templates/utils";
import {loadTemplate} from "@/ducks/templates/actions";

export interface IssueTemplateLookupProps {
    templateNo: string | null;
    onChange: (templateNo: string) => void;
    onSelectTemplate?: (template: WorkTemplate | null) => void;
    inputProps?: Omit<HTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>;
}

export default function IssueTemplateLookup({
                                                templateNo,
                                                onChange,
                                                onSelectTemplate,
                                                inputProps
                                            }: IssueTemplateLookupProps) {
    const dispatch = useAppDispatch();
    const templates = useAppSelector(selectTemplatesList);
    const template = useAppSelector(selectCurrentTemplate);
    const [value, setValue] = useState<WorkTemplate | null>(null);
    const _id = inputProps?.id ?? useId();

    const filterOptions = createFilterOptions<WorkTemplate>({
        matchFrom: 'any',
        stringify: (option) => `${option.TemplateNo} ${option.TemplateDesc}`,
        ignoreCase: true,
        limit: 25
    })

    useEffect(() => {
        const [template] = templates.filter(t => t.TemplateNo === templateNo);
        setValue(template ?? null);
    }, [templateNo, templates]);

    useEffect(() => {
        if (!value) {
            return;
        }
        onChange(value.TemplateNo);
        if (!isStepsList(value?.Steps)) {
            dispatch(loadTemplate(value.TemplateNo));
            return;
        }
        dispatch(setCurrentTemplate(value));
    }, [value]);

    useEffect(() => {
        if (onSelectTemplate) {
            onSelectTemplate(template);
        }
    }, [template]);

    const applyTemplateHandler = () => {
        if (onSelectTemplate && value && value.TemplateNo === template?.TemplateNo) {
            onSelectTemplate(template);
        }
    }

    return (
        <Autocomplete
            options={templates}
            filterOptions={filterOptions}
            renderOption={(props, option) => {
                const {key, ...optionProps} = props;
                return (<li key={key} {...optionProps}>
                    <div className="d-flex justify-content-between" style={{width: '100%'}}>
                        <div>{option.TemplateNo}</div>
                        <div className="text-secondary">{option.TemplateDesc}</div>
                    </div>
                </li>)
            }}
            isOptionEqualToValue={(option, value) => option.TemplateNo === value?.TemplateNo}
            sx={{width: '100%'}}
            value={value}
            onChange={(_ev, nextValue) => setValue(nextValue)}
            getOptionLabel={option => option.TemplateNo}
            renderInput={(params) => (
                <div className="input-group input-group-sm" ref={params.InputProps.ref}>
                    <label htmlFor={params.inputProps.id} className="input-group-text">Template</label>
                    <input {...params.inputProps} type="search" className="form-control"/>
                    <button type="button" className="btn btn-outline-secondary" onClick={applyTemplateHandler}>
                        <span className="bi-check-circle-fill" aria-label="Apply Template"/>
                    </button>
                </div>
            )}
        />

    )
}
