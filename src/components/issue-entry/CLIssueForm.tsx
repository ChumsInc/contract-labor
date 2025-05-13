import React, {ChangeEvent, FormEvent} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {
    selectCurrentIssueDetail,
    selectCurrentIssueHeader,
    selectCurrentIssueStatus,
    updateCurrentEntry,
} from "@/ducks/issue-entry/issueEntrySlice";
import VendorSelect from "./VendorSelect";
import IssueId from "./IssueId";
import {CLIssueEntry, CLIssueEntryDetail, CLIssueResponse} from "chums-types";
import IssueWorkTicket from "./IssueWorkTicket";
import WorkTicketAssignedAlert from "@/ducks/work-ticket/WorkTicketAssignedAlert";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import IssueDateIssued from "./IssueDateIssued";
import IssueDateDue from "./IssueDateDue";
import IssueQuantityIssued from "./IssueQuantityIssued";
import IssueDetail from "./IssueDetail";
import IssueItem from "./IssueItem";
import NewEntryButton from "./NewEntryButton";
import IssueNotes from "./IssueNotes";
import IssueTemplate from "./IssueTemplate";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {saveCLIssueEntry} from "@/ducks/issue-entry/actions";
import CLIssuePrintButton from "@/components/issue-entry/CLIssuePrintButton";
import {setWorkTicketStatus} from "@/ducks/work-ticket/actions";
import {ProgressBar} from "react-bootstrap";
import AdditionalCLSteps from "@/components/issue-entry/AdditionalCLSteps";
import DeleteEntryButton from "@/components/issue-entry/DeleteEntryButton";
import RecalculateIssueStepsButton from "@/components/issue-entry/RecalculateIssueStepsButton";
import Button from "react-bootstrap/Button";
import {useNavigate, useParams} from "react-router";

dayjs.extend(utc);

const CLIssueForm = () => {
    const dispatch = useAppDispatch();
    const current = useAppSelector(selectCurrentIssueHeader);
    const lines = useAppSelector(selectCurrentIssueDetail);
    const status = useAppSelector(selectCurrentIssueStatus);
    const [print, setPrint] = React.useState(false);


    const submitHandler = async (ev: FormEvent) => {
        ev.preventDefault();
        const detail = (lines as CLIssueEntryDetail[]).filter(line => line.selected);
        const res = await dispatch(saveCLIssueEntry({...current, detail}));
        const payload: CLIssueResponse | null = res.payload as CLIssueResponse ?? null
        if (!payload || !payload.issue?.WorkTicketKey) {
            return;
        }
        await dispatch(setWorkTicketStatus({WorkTicketKey: payload.issue.WorkTicketKey, action: 'cl', nextStatus: 1}));
        setPrint(true);
    }

    const changeHandler = (field: keyof CLIssueEntry) => (ev: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        switch (field) {
            case 'DateDue':
            case 'DateIssued':
                const dateValue = dayjs((ev as ChangeEvent<HTMLInputElement>).target.valueAsDate);
                if (dateValue.isValid()) {
                    dispatch(updateCurrentEntry({[field]: dateValue.utcOffset((new Date()).getTimezoneOffset())}));
                }
                return;

            case 'QuantityIssued':
                dispatch(updateCurrentEntry({[field]: (ev as ChangeEvent<HTMLInputElement>).target.valueAsNumber}));
                return;

            default:
                dispatch(updateCurrentEntry({[field]: ev.target.value}));
                return;
        }
    }


    return (
        <form onSubmit={submitHandler}>
            <Row className="g-3">
                <Col xs={12} md={6}>
                    <Row className="g-3 mb-1">
                        <Col xs={12} md={4}>
                            <IssueId/>
                        </Col>
                        <Col xs={12} md={8}>
                            <VendorSelect required value={current.VendorNo ?? ''} onChange={changeHandler('VendorNo')}/>
                        </Col>
                    </Row>
                    <IssueWorkTicket showDueDate showMakeFor inputProps={{required: true}}/>
                    <WorkTicketAssignedAlert/>
                    <IssueTemplate/>
                    <IssueItem/>
                    <Row className="g-3 mb-1">
                        <Col xs={12} md={6}>
                            <IssueDateIssued required/>
                        </Col>
                        <Col xs={12} md={6}>
                            <IssueQuantityIssued required/>
                        </Col>
                    </Row>
                    <div className="mb-1">
                        <IssueDateDue required/>
                    </div>
                    <div className="mb-1">
                        <AdditionalCLSteps/>
                    </div>
                    <div className="mb-1">
                        <IssueNotes/>
                    </div>
                </Col>
                <Col xs={12} md={6}>
                    <IssueDetail/>
                    <RecalculateIssueStepsButton />
                </Col>
            </Row>

            <Row className="g-3 mt-1 mb-1 justify-content-end align-items-center">
                <Col xs={12} md>
                    {status !== 'idle' && <ProgressBar striped animated now={100}/>}
                </Col>
                <Col xs="auto">
                    <NewEntryButton/>
                </Col>
                <Col xs="auto">
                    <DeleteEntryButton/>
                </Col>
                <Col xs="auto">
                    <CLIssuePrintButton show={print} onPrint={() => setPrint(false)}/>
                </Col>
                <Col xs="auto">
                    <Button type="submit" variant="primary" size="sm" disabled={status !== 'idle'}>
                        Issue Work
                    </Button>
                </Col>
            </Row>
        </form>

    )
}

export default CLIssueForm;
