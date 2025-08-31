import { request } from 'express';
import { defaultPaginationFilters } from '../../lib/util/defaultPaginationFilters.js';
import { hookable } from '../../lib/util/hookable.js';
import { addProcessor } from '../../lib/util/registry.js';
import loginCustomerWithEmail from '../../modules/customer/services/customer/loginCustomerWithEmail.js';
import logoutCustomer from '../../modules/customer/services/customer/logoutCustomer.js';
import { registerDefaultCustomerCollectionFilters } from '../../modules/customer/services/registerDefaultCustomerCollectionFilters.js';
import { registerDefaultCustomerGroupCollectionFilters } from '../../modules/customer/services/registerDefaultCustomerGroupCollectionFilters.js';
export default () => {
    addProcessor('cartFields', (fields) => {
        fields.push({
            key: 'customer_id',
            resolvers: [
                async function resolver() {
                    const triggeredField = this.getTriggeredField();
                    const requestedValue = this.getRequestedValue();
                    return triggeredField === 'customer_id'
                        ? requestedValue
                        : this.getData('customer_id');
                }
            ]
        });
        fields.push({
            key: 'customer_group_id',
            resolvers: [
                async function resolver() {
                    const triggeredField = this.getTriggeredField();
                    const requestedValue = this.getRequestedValue();
                    return triggeredField === 'customer_group_id'
                        ? requestedValue
                        : this.getData('customer_group_id');
                }
            ]
        });
        fields.push({
            key: 'customer_email',
            resolvers: [
                async function resolver() {
                    const triggeredField = this.getTriggeredField();
                    const requestedValue = this.getRequestedValue();
                    return triggeredField === 'customer_email'
                        ? requestedValue
                        : this.getData('customer_email');
                }
            ]
        });
        fields.push({
            key: 'customer_full_name',
            resolvers: [
                async function resolver() {
                    const triggeredField = this.getTriggeredField();
                    const requestedValue = this.getRequestedValue();
                    return triggeredField === 'customer_full_name'
                        ? requestedValue
                        : this.getData('customer_full_name');
                }
            ]
        });
        return fields;
    });
    /**
     * This function will login the customer with email and password
     * @param {*} email
     * @param {*} password
     * @param {*} callback
     */
    request.loginCustomerWithEmail = async function login(email, password, callback) {
        await hookable(loginCustomerWithEmail.bind(this))(email, password);
        this.session.save(callback);
    };
    request.logoutCustomer = function logout(callback) {
        hookable(logoutCustomer.bind(this))();
        this.session.save(callback);
    };
    request.isCustomerLoggedIn =
        function isCustomerLoggedIn() {
            var _a;
            return !!((_a = this.session) === null || _a === void 0 ? void 0 : _a.customerID);
        };
    request.getCurrentCustomer =
        function getCurrentCustomer() {
            var _a;
            return (_a = this.locals) === null || _a === void 0 ? void 0 : _a.customer;
        };
    // Reigtering the default filters for customer collection
    addProcessor('customerCollectionFilters', registerDefaultCustomerCollectionFilters, 1);
    addProcessor('customerCollectionFilters', (filters) => [...filters, ...defaultPaginationFilters], 2);
    // Reigtering the default filters for customer group collection
    addProcessor('customerGroupCollectionFilters', registerDefaultCustomerGroupCollectionFilters, 1);
    addProcessor('customerGroupCollectionFilters', (filters) => [...filters, ...defaultPaginationFilters], 2);
};
//# sourceMappingURL=bootstrap.js.map