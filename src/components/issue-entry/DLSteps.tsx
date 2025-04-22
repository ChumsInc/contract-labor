import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectSteps} from "@/ducks/dl-steps/stepsSlice";
import {loadCLSteps} from "@/ducks/dl-steps/actions";
import FormSelect, {FormSelectProps} from "react-bootstrap/FormSelect";
import {DLStep} from "chums-types";

export interface DLStepsProps extends Omit<FormSelectProps, 'onChange'> {
    onChange: (step: DLStep | null) => void;
}

export default function DLSteps({value, onChange, ...rest}: DLStepsProps) {
    const dispatch = useAppDispatch();
    const steps = useAppSelector(selectSteps);

    useEffect(() => {
        dispatch(loadCLSteps());
    }, []);

    const changeHandler = (ev: React.ChangeEvent<HTMLSelectElement>) => {
        const step = steps.find(s => s.stepCode === ev.target.value);
        onChange(step ?? null);
    }

    return (
        <FormSelect value={value} onChange={changeHandler} {...rest}>
            <option value=""></option>
            {steps.map(s => (
                <option key={s.id} value={s.stepCode}>{s.workCenter}/{s.stepCode} - {s.description}</option>
            ))}
        </FormSelect>
    )

}
