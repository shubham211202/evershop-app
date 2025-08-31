import { Card } from '@components/admin/Card.js';
import Spinner from '@components/admin/Spinner.js';
import Button from '@components/common/Button.js';
import { Form, useFormContext } from '@components/common/form/Form.js';
import { InputField } from '@components/common/form/InputField.js';
import { NumberField } from '@components/common/form/NumberField.js';
import { RadioGroupField } from '@components/common/form/RadioGroupField.js';
import { ToggleField } from '@components/common/form/ToggleField.js';
import { UrlField } from '@components/common/form/UrlField.js';
import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { toast } from 'react-toastify';
import { useQuery } from 'urql';
import { ShippingMethod } from './Method.js';
import { PriceBasedPrice } from './PriceBasedPrice.js';
import { WeightBasedPrice } from './WeightBasedPrice.js';

const MethodsQuery = `
  query Methods {
    shippingMethods {
      value: shippingMethodId
      label: name
      updateApi
    }
    createShippingMethodApi: url(routeId: "createShippingMethod")
  }
`;

export interface ConditionProps {
  method?: ShippingMethod;
}

function Condition({ method }: ConditionProps) {
  const { watch } = useFormContext();
  const type = watch('condition_type');
  return (
    <div>
      <div className="mb-2">
        <RadioGroupField
          name="condition_type"
          options={[
            { value: 'price', label: 'Based on order price' },
            { value: 'weight', label: 'Based on order weight' }
          ]}
          defaultValue={method?.conditionType || 'price'}
        />
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <NumberField
            name="min"
            label={
              type === 'price' ? 'Minimum order price' : 'Minimum order weight'
            }
            placeholder={
              type === 'price' ? 'Minimum order price' : 'Minimum order weight'
            }
            defaultValue={method?.min || 0}
            required
            validation={{ required: 'Min is required' }}
            helperText="This is the minimum order price or weight to apply this condition."
          />
        </div>
        <div>
          <NumberField
            name="max"
            label={
              type === 'price' ? 'Maximum order price' : 'Maximum order weight'
            }
            placeholder={
              type === 'price' ? 'Maximum order price' : 'Maximum order weight'
            }
            defaultValue={method?.max || 0}
            validation={{ required: 'Max is required' }}
            helperText="This is the maximum order price or weight to apply this condition."
          />
        </div>
      </div>
    </div>
  );
}

const getType = (method: ShippingMethod | null) => {
  if (method?.calculateApi) {
    return 'api';
  }
  if (method?.priceBasedCost) {
    return 'price_based_rate';
  }
  if (method?.weightBasedCost) {
    return 'weight_based_rate';
  }
  return 'flat_rate';
};

export interface MethodFormProps {
  saveMethodApi: string;
  onSuccess: () => void;
  reload: () => void;
  method?: ShippingMethod;
}

function MethodForm({
  saveMethodApi,
  onSuccess,
  reload,
  method
}: MethodFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [shippingMethod, setMethod] = React.useState(
    method
      ? {
          value: method.methodId,
          label: method.name
        }
      : null
  );
  const [hasCondition, setHasCondition] = React.useState(
    !!method?.conditionType
  );
  const [name, setName] = React.useState(method?.name || '');
  const [updatingName, setUpdatingName] = React.useState(false);

  const [result, reexecuteQuery] = useQuery({
    query: MethodsQuery
  });
  const { watch } = useFormContext();
  const typeWatch = watch('type');

  const handleCreate = async (inputValue) => {
    setIsLoading(true);
    await fetch(result.data.createShippingMethodApi, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        name: inputValue
      })
    });
    reexecuteQuery({ requestPolicy: 'network-only' });
    setIsLoading(false);
  };

  if (result.fetching) {
    return (
      <div className="flex justify-center p-2">
        <Spinner width={25} height={25} />
      </div>
    );
  }

  const currentMethod = result.data.shippingMethods.find(
    (m) => m.value === shippingMethod?.value
  );

  return (
    <Form
      id="shippingMethodForm"
      method={method ? 'PATCH' : 'POST'}
      action={saveMethodApi}
      submitBtn={false}
      onSuccess={async (response) => {
        if (!response.error) {
          reload();
          onSuccess && onSuccess();
          toast.success('Shipping method saved successfully');
        } else {
          toast.error(response.error.message);
        }
      }}
    >
      <Card.Session title="Method name">
        {!method ? (
          <CreatableSelect
            isClearable
            isDisabled={isLoading}
            isLoading={isLoading}
            onChange={(newValue) => setMethod(newValue)}
            onCreateOption={handleCreate}
            options={result.data.shippingMethods}
            value={shippingMethod}
          />
        ) : (
          <div className="flex gap-2 justify-start items-center">
            <InputField
              name="name"
              placeholder="Method name"
              required
              defaultValue={name}
              disabled={!updatingName}
              validation={{ required: 'Method name is required' }}
            />
            {updatingName && (
              <Button
                title="Save"
                variant="primary"
                onAction={async () => {
                  // Use fetch to call the API (method.updateApi) to update the method name
                  // The API should accept a PATCH request with the new name as the payload
                  // The API should return the updated method object
                  const response = await fetch(currentMethod.updateApi, {
                    method: 'PATCH',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify({
                      name
                    })
                  });
                  const data = await response.json();
                  if (response.ok) {
                    setName(data.name);
                    setUpdatingName(false);
                  } else {
                    toast.error(data.error.message);
                  }
                }}
              />
            )}
          </div>
        )}
        <InputField
          type="hidden"
          name="method_id"
          defaultValue={shippingMethod?.value || ''}
        />
        <ToggleField
          name="is_enabled"
          label="Status"
          defaultValue={method?.isEnabled || 0}
        />
      </Card.Session>
      <Card.Session title="Setup shipping cost">
        <RadioGroupField
          name="calculation_type"
          options={[
            { label: 'Flat rate', value: 'flat_rate' },
            { label: 'Price based rate', value: 'price_based_rate' },
            { label: 'Weight based rate', value: 'weight_based_rate' },
            { label: 'API calculate', value: 'api' }
          ]}
          defaultValue={getType(method || null)}
        />
        {typeWatch === 'flat_rate' && (
          <NumberField
            label="Flat rate cost"
            name="cost"
            placeholder="Shipping cost"
            required
            validation={{ required: 'Shipping cost is required' }}
            helperText="This is the flat rate cost for shipping."
            defaultValue={method?.cost?.value}
          />
        )}
        {typeWatch === 'price_based_rate' && (
          <PriceBasedPrice lines={method?.priceBasedCost || []} />
        )}
        {typeWatch === 'weight_based_rate' && (
          <WeightBasedPrice lines={method?.weightBasedCost || []} />
        )}
        {typeWatch === 'api' && (
          <UrlField
            name="calculate_api"
            placeholder="Calculate API endpoint"
            required
            validation={{ required: 'Calculate API is required' }}
            defaultValue={method?.calculateApi || ''}
            helperText="This API will be called to calculate shipping cost. It supposed to return a number."
          />
        )}
        <a
          href="#"
          className="text-interactive"
          onClick={(e) => {
            e.preventDefault();
            setHasCondition(!hasCondition);
          }}
        >
          {hasCondition ? 'Remove condition' : 'Add condition'}
        </a>
        {!hasCondition && (
          <input name="condition_type" type="hidden" value="none" />
        )}
        {hasCondition && <Condition method={method} />}
      </Card.Session>
      <Card.Session>
        <div className="flex justify-end gap-2">
          <Button
            title="Save"
            variant="primary"
            onAction={() => {
              (
                document.getElementById('shippingMethodForm') as HTMLFormElement
              ).dispatchEvent(
                new Event('submit', {
                  cancelable: true,
                  bubbles: true
                })
              );
            }}
          />
        </div>
      </Card.Session>
    </Form>
  );
}

export { MethodForm };
