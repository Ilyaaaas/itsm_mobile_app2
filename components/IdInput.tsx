import { Input } from 'native-base';
import * as React from 'react';
import { TextInputMask, TextInputMaskProps } from 'react-native-masked-text';

export const IdInput = (props: Omit<TextInputMaskProps, 'type'>) => (
  <TextInputMask
    type="custom"
    placeholder="Логин"
    customTextInput={Input}
  />
);
