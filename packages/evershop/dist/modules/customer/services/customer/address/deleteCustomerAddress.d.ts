import { Address } from './addressValidators.js';
/**
 * Delete customer address service. This service will delete a customer address with all related data
 * @param {String} uuid
 * @param {Object} context
 * @return {Promise<Address>} The deleted address
 * @throws {Error} If the address does not exist or if there is an error during the transaction
 */
declare const _default: (uuid: string, context: Record<string, unknown>) => Promise<Address>;
export default _default;
