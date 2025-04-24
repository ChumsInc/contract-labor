import React, {useId, useState} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import InputGroup from "react-bootstrap/InputGroup";
import DLSteps from "@/components/issue-entry/DLSteps";
import Button from "react-bootstrap/Button";
import {CLIssueEntryDetail, DLStep} from "chums-types";
import {addDLStep, selectCurrentIssueDetail, selectCurrentIssueHeader} from "@/ducks/issue-entry/issueEntrySlice";
import Decimal from "decimal.js";

export default function AdditionalCLSteps() {
    const dispatch = useAppDispatch();
    const header = useAppSelector(selectCurrentIssueHeader);
    const detail = useAppSelector(selectCurrentIssueDetail);
    const [step, setStep] = useState<DLStep | null>(null);
    const id = useId();


    const clickHandler = () => {
        if (!step) {
            return
        }

        const nextStep = detail
            .filter(step => !!step.StepNo)
            .map(line => line.StepNo!)
            .reduce((pv: string, cv: string) => {
                return cv > pv ? cv : pv;
            }, '');

        const line: CLIssueEntryDetail = {
            id: 0,
            TemplateNo: 'N/A',
            ActivityCode: step.stepCode,
            WorkCenter: step.workCenter,
            ActivityRate: step.stepCost,
            StepDescription: step.description,
            QuantityIssued: header.QuantityIssued,
            StepNo: new Decimal(nextStep).add('100').toString().padStart(6, '0'),
            RevisionNo: null,
            ScalingFactor: 1,
            ScalingMethod: 'M',
            selected: true,
        }
        dispatch(addDLStep(line))
        setStep(null);
    }

    return (
        <InputGroup size="sm">
            <InputGroup.Text as="label" htmlFor={id}>Additional Steps</InputGroup.Text>
            <DLSteps value={step?.stepCode ?? ''} onChange={setStep} id={id}/>
            <Button variant="secondary" size="sm" onClick={clickHandler} disabled={!step}>Add Step</Button>
        </InputGroup>
    )
}
