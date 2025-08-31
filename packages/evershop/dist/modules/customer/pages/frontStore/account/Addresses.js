import { AddressSummary } from '@components/common/customer/address/AddressSummary';
import { Form } from '@components/common/form/Form';
import { useModal } from '@components/common/modal/useModal';
import CustomerAddressForm from '@components/frontStore/customer/address/addressForm/Index';
import PropTypes from 'prop-types';
import React from 'react';
import { toast } from 'react-toastify';
import { _ } from '../../../../../lib/locale/translate/_.js';
export default function Addresses({ account: { addresses, addAddressApi } }) {
    const modal = useModal();
    const isLoading = React.useRef(false);
    const editingAddress = React.useRef(null);
    return (React.createElement("div", null,
        addresses.length === 0 && (React.createElement("div", { className: "order-history-empty" }, _('You have no addresses saved'))),
        React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8" }, addresses.map((address) => (React.createElement("div", { key: address.uuid, className: address.isDefault
                ? 'border rounded border-green-700 p-5'
                : 'border rounded border-gray-300 p-5' },
            React.createElement(AddressSummary, { key: address.uuid, address: address }),
            React.createElement("div", { className: "flex justify-end gap-5" },
                React.createElement("a", { href: "#", className: "text-interactive underline", onClick: (e) => {
                        e.preventDefault();
                        if (isLoading.current) {
                            return;
                        }
                        editingAddress.current = address;
                        modal.openModal();
                    } }, _('Edit')),
                !address.isDefault && (React.createElement("a", { href: "#", className: "text-interactive underline", onClick: async (e) => {
                        e.preventDefault();
                        if (isLoading.current) {
                            return;
                        }
                        isLoading.current = true;
                        const response = await fetch(address.deleteApi, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                is_default: 1
                            })
                        });
                        const data = await response.json();
                        if (!data.error) {
                            toast.success(_('Address has been set as default!'));
                            isLoading.current = false;
                            setTimeout(() => {
                                window.location.reload();
                            }, 1500);
                        }
                        else {
                            toast.error(data.error.message);
                        }
                    } }, _('Make default'))),
                React.createElement("a", { href: "#", className: "text-critical underline", onClick: async (e) => {
                        e.preventDefault();
                        if (isLoading.current) {
                            return;
                        }
                        isLoading.current = true;
                        const response = await fetch(address.deleteApi, {
                            method: 'DELETE'
                        });
                        const data = await response.json();
                        if (!data.error) {
                            toast.success(_('Address has been deleted successfully!'));
                            isLoading.current = false;
                            setTimeout(() => {
                                window.location.reload();
                            }, 1500);
                        }
                        else {
                            toast.error(data.error.message);
                        }
                    } }, _('Delete'))))))),
        React.createElement("br", null),
        React.createElement("a", { href: "#", className: "text-interactive underline", onClick: (e) => {
                e.preventDefault();
                if (isLoading.current) {
                    return;
                }
                editingAddress.current = null;
                modal.openModal();
            } }, _('Add new address')),
        modal.state.showing && (React.createElement("div", { className: modal.className, onAnimationEnd: modal.onAnimationEnd },
            React.createElement("div", { className: "modal-wrapper flex self-center justify-center items-center", tabIndex: -1, role: "dialog" },
                React.createElement("div", { className: "modal" },
                    React.createElement("div", { className: "bg-white p-8" },
                        React.createElement("div", { className: "flex justify-between items-center mb-5" },
                            React.createElement("h2", { className: "mb-3" }, editingAddress ? _('Edit address') : _('Add new address')),
                            React.createElement("a", { href: "#", className: "text-critical underline", onClick: (e) => {
                                    e.preventDefault();
                                    modal.closeModal();
                                } }, _('Close'))),
                        React.createElement(Form, { id: "customerAddressForm", method: editingAddress.current ? 'PATCH' : 'POST', action: editingAddress.current
                                ? editingAddress.current.updateApi
                                : addAddressApi, onSuccess: (response) => {
                                if (!response.error) {
                                    modal.closeModal();
                                    toast.success(_('Address has been saved successfully!'));
                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 1500);
                                }
                                else {
                                    toast.error(response.error.message);
                                }
                            }, dataFilter: (data) => ({
                                ...data.address
                            }) },
                            React.createElement(CustomerAddressForm, { address: editingAddress.current })))))))));
}
Addresses.propTypes = {
    account: PropTypes.shape({
        addresses: PropTypes.arrayOf(PropTypes.shape({
            uuid: PropTypes.string.isRequired,
            fullName: PropTypes.string.isRequired,
            address1: PropTypes.string.isRequired,
            city: PropTypes.string.isRequired,
            postcode: PropTypes.string.isRequired,
            country: PropTypes.shape({
                name: PropTypes.string.isRequired,
                code: PropTypes.string.isRequired
            }),
            province: PropTypes.shape({
                name: PropTypes.string,
                code: PropTypes.string
            }),
            telephone: PropTypes.string.isRequired,
            isDefault: PropTypes.bool,
            updateApi: PropTypes.string.isRequired,
            deleteApi: PropTypes.string.isRequired
        })).isRequired,
        addAddressApi: PropTypes.string.isRequired
    }).isRequired
};
export const layout = {
    areaId: 'accountPageAddressBook',
    sortOrder: 10
};
export const query = `
  query Query {
    account: currentCustomer {
      uuid
      fullName
      email
      addresses {
        uuid
        fullName
        address1
        city
        postcode
        country {
          name
          code
        }
        province {
          name
          code
        }
        telephone
        isDefault
        updateApi
        deleteApi
      }
      addAddressApi
    }
  }
`;
//# sourceMappingURL=Addresses.js.map