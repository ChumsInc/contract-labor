import {CLVendor, SortProps} from "chums-types";

export const defaultVendorSort: SortProps<CLVendor> = {field: 'VendorNo', ascending: true};

export const sortVendors = ({field, ascending}: SortProps<CLVendor>) => (a: CLVendor, b: CLVendor) => {
    const sortMod = ascending ? 1 : -1;
    switch (field) {
        case 'VendorNo':
            return (a[field].toLowerCase() === b[field].toLowerCase()
                ? (a.id - b.id)
                : (a[field].toLowerCase() > b[field].toLowerCase() ? 1 : -1)) * sortMod
        case 'EmailAddress':
        case 'VendorNameOverride':
        case 'VendorName':
            return ((a[field] ?? '').toLowerCase() === (b[field] ?? '').toLowerCase()
                ? (a.id - b.id)
                : ((a[field] ?? '').toLowerCase() > (b[field] ?? '').toLowerCase() ? 1 : -1)) * sortMod

        case "id":
        default:
            return (a.id - b.id) * sortMod;

    }
}


export const emptyVendor: CLVendor = {
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
