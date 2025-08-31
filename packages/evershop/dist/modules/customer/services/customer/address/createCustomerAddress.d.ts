import { Address } from './addressValidators.js';
/**
 * Create customer address service. This service will create a customer address with all related data
 * @param {String} customerUUID
 * @param {Address} addressData
 * @param {Object} context
 * @returns {Promise<Address>}
 * @throws {Error} If context is not an object or if address validation fails
 */
declare const _default: (customerUUID: string, addressData: Address, context: Record<string, unknown>) => Promise<Address>;
export default _default;
