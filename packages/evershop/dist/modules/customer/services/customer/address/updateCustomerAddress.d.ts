import { Address } from './addressValidators.js';
/**
 * Update customer address service. This service will update a customer address with all related data
 * @param {String} uuid
 * @param {Object} data
 * @param {Object} context
 * @return {Promise<Address>} The updated address
 * @throws {Error} If the address does not exist or if there is an error during the transaction
 * @throws {Error} If the context is not an object
 */
declare const _default: (uuid: string, data: Partial<Address>, context: Record<string, unknown>) => Promise<Address>;
export default _default;
