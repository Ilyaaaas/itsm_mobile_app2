import { Input } from 'native-base';
import * as React from 'react';
import { TextInputMask, TextInputMaskProps } from 'react-native-masked-text';

export const PhoneInput = (props: Omit<TextInputMaskProps, 'type'>) => (
  <TextInputMask
    type="custom"
    keyboardType="numeric"
    placeholder="Телефон"
    customTextInput={Input}
    options={{ mask: '+7 799-999-99-99' }}
    {...props}
  />
);
