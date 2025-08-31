export function CustomerAddressForm({ allowCountries, address, formId, areaId }: {
    allowCountries: any;
    address?: {} | undefined;
    formId?: string | undefined;
    areaId?: string | undefined;
}): React.JSX.Element;
export namespace CustomerAddressForm {
    namespace propTypes {
        let address: any;
        let allowCountries: any;
        let areaId: any;
        let formId: any;
    }
    namespace defaultProps {
        let address_1: {};
        export { address_1 as address };
        let areaId_1: string;
        export { areaId_1 as areaId };
        let formId_1: string;
        export { formId_1 as formId };
    }
}
import React from 'react';
