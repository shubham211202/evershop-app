import { commit, getConnection, rollback, startTransaction, update } from '@evershop/postgres-query-builder';
import { error } from '../../../lib/log/logger.js';
import { pool } from '../../../lib/postgres/connection.js';
import { getConfig } from '../../../lib/util/getConfig.js';
import { hookable } from '../../../lib/util/hookable.js';
function validatePaymentStatusBeforeUpdate(status) {
    const paymentStatusList = getConfig('oms.order.paymentStatus', {});
    if (!paymentStatusList[status]) {
        throw new Error('Invalid status');
    }
    return false;
}
async function changePaymentStatus(orderId, status, connection) {
    const order = await update('order')
        .given({
        payment_status: status
    })
        .where('order_id', '=', orderId)
        .execute(connection);
    return order;
}
export const updatePaymentStatus = async (orderId, status, conn) => {
    const connection = conn || (await getConnection(pool));
    try {
        if (!conn) {
            await startTransaction(connection);
        }
        hookable(validatePaymentStatusBeforeUpdate, { orderId })(status);
        await hookable(changePaymentStatus, { orderId, status })(orderId, status, connection);
        if (!conn) {
            await commit(connection);
        }
    }
    catch (err) {
        error(err);
        if (!conn) {
            await rollback(connection);
        }
        throw err;
    }
};
//# sourceMappingURL=updatePaymentStatus.js.map