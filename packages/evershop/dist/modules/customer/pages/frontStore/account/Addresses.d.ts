declare function Addresses({ account: { addresses, addAddressApi } }: {
    account: {
        addresses: any;
        addAddressApi: any;
    };
}): React.JSX.Element;
declare namespace Addresses {
    namespace propTypes {
        let account: any;
    }
}
export default Addresses;
export namespace layout {
    let areaId: string;
    let sortOrder: number;
}
export const query: "\n  query Query {\n    account: currentCustomer {\n      uuid\n      fullName\n      email\n      addresses {\n        uuid\n        fullName\n        address1\n        city\n        postcode\n        country {\n          name\n          code\n        }\n        province {\n          name\n          code\n        }\n        telephone\n        isDefault\n        updateApi\n        deleteApi\n      }\n      addAddressApi\n    }\n  }\n";
import React from 'react';
