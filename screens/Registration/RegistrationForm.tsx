import { Formik } from 'formik';
import { Button, Form, Item, Text, Toast } from 'native-base';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { IdInput } from '../../components/IdInput';
import { PhoneInput } from '../../components/PhoneInput';
import { ConfirmPrivacyPolicy } from '../../containers/ConfirmPrivacyPolicy';
import { useAppDispatch } from '../../helpers/hooks/app-dispatch.hook';
import { registrationAction } from '../../redux/auth.actions';
import { inputStyle } from '../../styles/input.style';

const styles = StyleSheet.create({
  submitBtn: {
    marginTop: 16,
  },
});

const initialValues = {
  login: '',
  phone: '',
  confirmed: false,
};
type RegistrationFormValues = typeof initialValues;

export const RegistrationForm = () => {
  const dispatch = useAppDispatch();

  const handleSubmit = (values: RegistrationFormValues) => {
    let msg = '';
    let onStart = true;

    if (!values.confirmed) {
      msg = 'Примите пользовательское соглашение';
      onStart = false;
    }

    if (values.phone.replace(/[- +]/g, '') == '') {
      msg = 'Поле Телефон не может быть пустым';
      onStart = false;
    }

    if (values.login.replace(/-/g, '') == '') {
      msg = 'Поле ИИН не может быть пустым';
      onStart = false;
    }

    if (onStart) {
      const registrationParams = {
        iin: values.login.replace(/-/g, ''),
        phone: values.phone.replace(/[- +]/g, ''),
      };
      dispatch(registrationAction(registrationParams));
    } else {
      Toast.show({
        text: msg,
        type: 'danger',
      });
    }
  };

  return (
    <Formik<RegistrationFormValues>
      initialValues={initialValues}
      onSubmit={handleSubmit}>
      {(props) => (
        <>
          <Form>
            <Item regular style={inputStyle.inputItem}>
              <IdInput
                onChangeText={props.handleChange('login')}
                value={props.values.login}
              />
            </Item>
            <Item regular style={inputStyle.inputItem}>
              <PhoneInput
                onChangeText={props.handleChange('phone')}
                value={props.values.phone}
              />
            </Item>
          </Form>
          <Button block onPress={props.handleSubmit} style={styles.submitBtn}>
            <Text>Продолжить</Text>
          </Button>
          <ConfirmPrivacyPolicy
            onChecked={(checked) => props.setFieldValue('confirmed', checked)}
            checked={props.values.confirmed}
          />
        </>
      )}
    </Formik>
  );
};
