import React, {ChangeEvent, FormEvent} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {
    selectCurrentIssueDetail,
    selectCurrentIssueHeader,
    updateCurrentEntry,
} from "@/ducks/issue-entry/issueEntrySlice";
import VendorSelect from "./VendorSelect";
import IssueId from "./IssueId";
import {CLIssueEntry} from "../../types";
import IssueWorkTicket from "./IssueWorkTicket";
import WorkTicketAssignedAlert from "@/ducks/work-ticket/WorkTicketAssignedAlert";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {isCLIssue} from "@/utils/issue";
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

dayjs.extend(utc);

const CLIssueForm = () => {
    const dispatch = useAppDispatch();
    const current = useAppSelector(selectCurrentIssueHeader);
    const detail = useAppSelector(selectCurrentIssueDetail);


    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        console.log(current, detail);
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
                        <Col xs={12} md={6}>
                            <IssueId/>
                        </Col>
                        <Col xs={12} md={6}>
                            <VendorSelect required value={current.VendorNo ?? ''} onChange={changeHandler('VendorNo')}/>
                        </Col>
                    </Row>
                    <IssueWorkTicket containerClassName="mb-1"/>
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
                </Col>
                <div className="col-6">
                    <IssueDetail/>

                </div>

            </Row>
            <div className="mb-1">
                <IssueNotes/>
            </div>
            <div className="row g-3 mb-1 justify-content-end">
                {/*{!(isCLIssue(current) && dayjs(current.DateReceived).isValid()) && (*/}
                {/*)}*/}
                <div className="col-auto">
                    <NewEntryButton/>
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-sm btn-outline-danger"
                            disabled={!isCLIssue(current) || (isCLIssue(current) && dayjs(current.DateReceived).isValid())}>
                        Delete
                    </button>
                </div>
                <div className="col-auto">
                    <button type="submit" className="btn btn-sm btn-primary"
                            disabled={!current.VendorNo || !current.QuantityIssued}>
                        Issue Work
                    </button>
                </div>
            </div>
        </form>

    )
}

export default CLIssueForm;
