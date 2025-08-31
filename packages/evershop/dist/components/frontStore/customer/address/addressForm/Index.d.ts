declare function Index({ address, formId, areaId }: {
    address?: {} | undefined;
    formId?: string | undefined;
    areaId?: string | undefined;
}): React.JSX.Element;
declare namespace Index {
    namespace propTypes {
        let address: any;
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
export default Index;
import React from 'react';
