import { useCheckout } from '@components/common/context/checkout';
import { AddressSummary } from '@components/common/customer/address/AddressSummary';
import { Form } from '@components/common/form/Form';
import CustomerAddressForm from '@components/frontStore/customer/address/addressForm/Index';
import produce from 'immer';
import PropTypes from 'prop-types';
import React from 'react';
import { toast } from 'react-toastify';
import { useClient } from 'urql';
import { _ } from '../../../../../lib/locale/translate/_.js';
const QUERY = `
  query Query($cartId: String) {
    cart(id: $cartId) {
      shippingAddress {
        id: cartAddressId
        fullName
        postcode
        telephone
        country {
          code
          name
        }
        province {
          code
          name
        }
        city
        address1
        address2
      }
    }
  }
`;
export function StepContent({ addShippingAddressApi, shipmentInfo, setShipmentInfo, addresses }) {
    const { cartId } = useCheckout();
    const client = useClient();
    React.useEffect(() => {
        var _a;
        // If shipping address is null, apply the default address if available
        if (!((_a = shipmentInfo === null || shipmentInfo === void 0 ? void 0 : shipmentInfo.address) === null || _a === void 0 ? void 0 : _a.id) && addresses.length) {
            setShipmentInfo(produce(shipmentInfo, (draff) => {
                const defaultAddress = addresses.find((e) => e.isDefault);
                if (defaultAddress) {
                    draff.address = {
                        ...defaultAddress,
                        country: {
                            ...defaultAddress.country
                        },
                        province: {
                            ...defaultAddress.province
                        }
                    };
                }
            }));
        }
    }, []);
    return (React.createElement("div", null,
        React.createElement("h4", { className: "mb-4 mt-12" }, _('Shipping Address')),
        React.createElement("div", { className: "grid grid-cols-2 gap-5 mb-5" }, addresses.map((address) => (React.createElement("div", { className: "border rounded border-gray-300 p-5", key: address.uuid },
            React.createElement(AddressSummary, { key: address.uuid, address: address }),
            React.createElement("div", { className: "flex justify-end gap-5" },
                React.createElement("a", { href: "#", className: "text-interactive underline", onClick: (e) => {
                        e.preventDefault();
                        setShipmentInfo(produce(shipmentInfo, (draff) => {
                            draff.address = {
                                ...address,
                                country: {
                                    ...address.country
                                },
                                province: {
                                    ...address.province
                                }
                            };
                        }));
                    } }, _('Ship here'))))))),
        React.createElement(Form, { method: "POST", action: addShippingAddressApi, id: "checkoutShippingAddressForm", isJSON: true, btnText: _('Continue to payment'), onSuccess: (response) => {
                if (!response.error) {
                    client
                        .query(QUERY, { cartId })
                        .toPromise()
                        .then((result) => {
                        const address = result.data.cart.shippingAddress;
                        setShipmentInfo(produce(shipmentInfo, (draff) => {
                            draff.address = address;
                        }));
                    });
                }
                else {
                    toast.error(response.error.message);
                }
            } },
            React.createElement(CustomerAddressForm, { areaId: "checkoutShippingAddressForm", address: shipmentInfo.address }),
            React.createElement("input", { type: "hidden", name: "type", value: "shipping" }))));
}
StepContent.propTypes = {
    addShippingAddressApi: PropTypes.string.isRequired,
    setShipmentInfo: PropTypes.func.isRequired,
    shipmentInfo: PropTypes.shape({
        address: PropTypes.shape({
            address1: PropTypes.string,
            address2: PropTypes.string,
            city: PropTypes.string,
            country: PropTypes.shape({
                code: PropTypes.string,
                name: PropTypes.string
            }),
            fullName: PropTypes.string,
            id: PropTypes.number,
            postcode: PropTypes.string,
            province: PropTypes.shape({
                code: PropTypes.string,
                name: PropTypes.string
            }),
            telephone: PropTypes.string
        })
    }),
    step: PropTypes.shape({
        id: PropTypes.string,
        isCompleted: PropTypes.bool,
        isEditing: PropTypes.bool
    }).isRequired,
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
        isDefault: PropTypes.bool.isRequired
    })).isRequired
};
StepContent.defaultProps = {
    shipmentInfo: {
        address: {}
    }
};
//# sourceMappingURL=StepContent.js.map