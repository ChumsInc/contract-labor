import {SortProps} from "chums-types";
import {Vendor, VendorWeekTotal} from "../../types";
import Decimal from "decimal.js";

export const defaultVendorSort:SortProps<Vendor> = {field: 'VendorNo', ascending: true};

export const sortVendors = ({field, ascending}:SortProps<Vendor>) => (a:Vendor, b:Vendor) => {
    const sortMod = ascending ? 1 : -1;
    switch (field) {
        case 'VendorNo':
            return (a[field].toLowerCase() === b[field].toLowerCase()
                ? (a.id - b.id)
                : (a[field].toLowerCase() > b[field].toLowerCase() ? 1 : -1)) * sortMod
        case 'EmailAddress':
        case 'VendorNameOverride':
        case 'VendorName':
            return ((a[field] ?? '').toLowerCase() === (b[field]??'').toLowerCase()
                ? (a.id - b.id)
                : ((a[field] ?? '').toLowerCase() > (b[field] ?? '').toLowerCase() ? 1 : -1)) * sortMod

        case "id":
        default:
            return (a.id - b.id) * sortMod;

    }
}


export const emptyVendor:Vendor = {
    id: 0,
    Company: 'chums',
    VendorNo: '',
    VendorName: '',
    VendorNameOverride: '',
    active: true,
    EmailAddress: null,
    AddressLine1: null,
    AddressLine2: null,
    AddressLine3: null,
    City: null,
    State: '',
    CountryCode: null,
    ZipCode: null,
    VendorStatus: null,
}
