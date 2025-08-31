import Area from '@components/common/Area';
import { useCheckout } from '@components/common/context/checkout';
import { useCheckoutStepsDispatch } from '@components/common/context/checkoutSteps';
import Button from '@components/common/form/Button';
import { Field } from '@components/common/form/Field';
import { Form } from '@components/common/form/Form';
import Spinner from '@components/common/Spinner';
import { BillingAddress } from '@components/frontStore/checkout/checkout/payment/paymentStep/BillingAddress';
import CustomerAddressForm from '@components/frontStore/customer/address/addressForm/Index';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useQuery } from 'urql';
import { _ } from '../../../../../../lib/locale/translate/_.js';
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
export function StepContent({ cart: { billingAddress, addBillingAddressApi, addPaymentMethodApi } }) {
    var _a, _b;
    const { completeStep } = useCheckoutStepsDispatch();
    const [useShippingAddress, setUseShippingAddress] = useState(!billingAddress);
    const { cartId, error, paymentMethods, getPaymentMethods } = useCheckout();
    const [loading, setLoading] = useState(false);
    const onSuccess = async (response) => {
        try {
            if (!response.error) {
                const selectedMethd = paymentMethods.find((e) => e.selected === true);
                const result = await fetch(addPaymentMethodApi, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        method_code: selectedMethd.code,
                        method_name: selectedMethd.name
                    })
                });
                const data = await result.json();
                if (!data.error) {
                    await completeStep('payment');
                }
            }
            else {
                setLoading(false);
                toast.error(response.error.message);
            }
        }
        catch (e) {
            setLoading(false);
            toast.error(e.message);
        }
    };
    useEffect(() => {
        getPaymentMethods();
    }, []);
    useEffect(() => {
        if (error) {
            setLoading(false);
            toast.error(error);
        }
    }, [error]);
    const [result] = useQuery({
        query: QUERY,
        variables: {
            cartId
        }
    });
    const { data, fetching, error: queryError } = result;
    if (fetching) {
        return (React.createElement("div", { className: "flex justify-center items-center p-3" },
            React.createElement(Spinner, { width: 25, height: 25 })));
    }
    if (queryError) {
        return React.createElement("div", { className: "p-8 text-critical" }, error.message);
    }
    return (React.createElement("div", null,
        React.createElement(Form, { method: "POST", action: addBillingAddressApi, onSuccess: onSuccess, onValidationError: () => setLoading(false), id: "checkoutPaymentForm", submitBtn: false, isJSON: true },
            React.createElement("h4", { className: "mb-4 mt-12" }, _('Billing Address')),
            React.createElement(BillingAddress, { useShippingAddress: useShippingAddress, setUseShippingAddress: setUseShippingAddress }),
            useShippingAddress === false && (React.createElement("div", { style: { display: 'block' } },
                React.createElement(CustomerAddressForm, { areaId: "checkoutBillingAddressForm", address: billingAddress || data.cart.shippingAddress }))),
            useShippingAddress === true && (React.createElement("div", { style: { display: 'none' } },
                React.createElement(CustomerAddressForm, { areaId: "checkoutBillingAddressForm", address: data.cart.shippingAddress }))),
            React.createElement("h4", { className: "mb-4 mt-12" }, _('Payment Method')),
            paymentMethods && paymentMethods.length > 0 && (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "divide-y border rounded border-divider px-8 mb-8" }, paymentMethods.map((method) => (React.createElement("div", { key: method.code, className: "border-divider payment-method-list" },
                    React.createElement("div", { className: "py-8" },
                        React.createElement(Area, { id: `checkoutPaymentMethod${method.code}` })))))),
                React.createElement(Field, { type: "hidden", name: "method_code", value: ((_a = paymentMethods.find((e) => e.selected === true)) === null || _a === void 0 ? void 0 : _a.code) || '', validationRules: [
                        {
                            rule: 'notEmpty',
                            message: _('Please select a payment method')
                        }
                    ] }),
                React.createElement("input", { type: "hidden", value: ((_b = paymentMethods.find((e) => e.selected === true)) === null || _b === void 0 ? void 0 : _b.name) || '', name: "method_name" }),
                React.createElement("input", { type: "hidden", value: "billing", name: "type" }))),
            paymentMethods.length === 0 && (React.createElement("div", { className: "alert alert-warning" }, _('No payment method available'))),
            React.createElement(Area, { id: "beforePlaceOrderButton", noOuter: true }),
            React.createElement("div", { className: "form-submit-button" },
                React.createElement(Button, { onAction: () => {
                        setLoading(true);
                        document
                            .getElementById('checkoutPaymentForm')
                            .dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                    }, title: _('Place Order'), isLoading: loading })))));
}
StepContent.propTypes = {
    cart: PropTypes.shape({
        billingAddress: PropTypes.shape({
            id: PropTypes.number,
            fullName: PropTypes.string,
            postcode: PropTypes.string,
            telephone: PropTypes.string,
            country: PropTypes.shape({
                code: PropTypes.string,
                name: PropTypes.string
            }),
            province: PropTypes.shape({
                code: PropTypes.string,
                name: PropTypes.string
            }),
            city: PropTypes.string,
            address1: PropTypes.string,
            address2: PropTypes.string
        }),
        addBillingAddressApi: PropTypes.string.isRequired,
        addPaymentMethodApi: PropTypes.string.isRequired
    }).isRequired
};
//# sourceMappingURL=StepContent.js.map