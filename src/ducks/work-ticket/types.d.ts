import {SortProps} from "@chumsinc/sortable-tables";
import {WorkTicketStatusGroup, WorkTicketWorkStatusItem} from "chums-types";

export type WorkTicketSortProps = SortProps<WorkTicketWorkStatusItem> | SortProps<WorkTicketStatusGroup>;
export type WorkTicketTableRow = WorkTicketWorkStatusItem & WorkTicketStatusGroup;
