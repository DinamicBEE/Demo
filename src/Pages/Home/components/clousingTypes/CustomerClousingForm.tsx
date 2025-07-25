import React, { useState } from "react";
import {
  DialogActionTrigger,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@components/ui/dialog";
import { Controller, useForm } from "react-hook-form";
import {
  NativeSelectField,
  NativeSelectRoot,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Field } from "@components/ui/field";
import { CustomerClousingFormProps } from "@models/common.clousing.model";
import { CustomerForm, CustomerModel } from "@models/customer.model";
import { useApi } from "@hooks/useApi";
import { getCurrencies, getCustomers } from "@services/catalogService";
import { CurrencyInputNumber } from "@components/NumericInput";
import { Button } from "@components/ui/button";
import { useHandleCustomer } from "@hooks/customerClousing/useHandleCustomerData";
import FilterCustomer from "@components/FilterCustomer";

export const CustomerClousingForm: React.FC<CustomerClousingFormProps> = ({
  isOpen,
  onClose,
  dataCustomer,
  setCustomersData,
  idCurrency,
  idClousing,
}) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerForm>();
  const { data: currencies } = useApi(() =>
    getCurrencies(idCurrency, idClousing)
  );
  const { data: customer } = useApi(() => getCustomers());
  const [selectClient, setSelectClient] = useState<{
    value: number;
    label: string;
  }>();

  const { addCustomerRecord } = useHandleCustomer(
    dataCustomer || ({} as CustomerModel),
    setCustomersData,
    dataCustomer?.id
  );

  const onSubmitForm = (data: CustomerForm) => {
    if (selectClient?.label) {
      const transformedData: CustomerForm = {
        idClient: selectClient.value,
        nameClient: selectClient.label,
        coupons: data.coupons,
        currency: data.currency,
        pax: data.pax,
      };
      
      reset();
      onClose();
      addCustomerRecord(transformedData, currencies);
    }
  };

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={onClose}
      closeOnEscape={false}
      closeOnInteractOutside={false}
      placement="top"
    >
      <DialogBackdrop />
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <DialogCloseTrigger />

          <DialogHeader>
            <Text fontSize="lg" fontWeight="bold">
              Registro de Nuevo Cliente
            </Text>
          </DialogHeader>

          <DialogBody>
            <Stack gap="4">
              {/*   <Field label="Nombre del Cliente:">
                <Input {...register('nameClient', { required: 'Este campo es requerido' })} />
                {errors.nameClient && <Text color="red" textStyle='xs'>{errors.nameClient?.message}</Text>}
              </Field> */}
              <FilterCustomer
                customers={customer}
                label={true}
                onSelect={setSelectClient}
                disabled={false}
              ></FilterCustomer>

              <Field label="Total de Cupones:">
                <Controller
                  control={control}
                  name="coupons"
                  rules={{ required: "Este campo es obligatorio" }}
                  render={({ field }) => (
                    <CurrencyInputNumber
                      name=""
                      value={field.value}
                      onChange={(floatValue) => field.onChange(floatValue)}
                      currency={false}
                      loading={false}
                      allowDecimals={false}
                    />
                  )}
                />
                {errors.coupons && (
                  <Text color="red" textStyle="xs">
                    {errors.coupons?.message}
                  </Text>
                )}
              </Field>

              <Field label="Moneda">
                <Controller
                  control={control}
                  name="currency"
                  rules={{ required: "Este campo es requerido" }}
                  render={({ field }) => (
                    <NativeSelectRoot size="md">
                      <NativeSelectField
                        {...field}
                        placeholder="Seleccione una opción"
                      >
                        {currencies?.map((item: any) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </NativeSelectField>
                    </NativeSelectRoot>
                  )}
                />
                {errors.currency && (
                  <Text color="red" textStyle="xs">
                    {errors.currency?.message}
                  </Text>
                )}
              </Field>

              <Field label="Valor PAX">
                <Controller
                  control={control}
                  name="pax"
                  rules={{ required: "Este campo es obligatorio" }}
                  render={({ field }) => (
                    <CurrencyInputNumber
                      name=""
                      value={field.value}
                      onChange={(floatValue) => field.onChange(floatValue)}
                      currency={false}
                      loading={false}
                    />
                  )}
                />
                {errors.pax && (
                  <Text color="red" textStyle="xs">
                    {errors.pax?.message}
                  </Text>
                )}
              </Field>
            </Stack>
          </DialogBody>

          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button
                colorPalette="meraError"
                onClick={() => {
                  reset();
                  onClose();
                }}
              >
                Cancelar
              </Button>
            </DialogActionTrigger>

            <Button type="submit" colorPalette="meraPrimary">
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
};
