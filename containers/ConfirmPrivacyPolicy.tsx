import { Button, Container, Content, Text as NBText } from 'native-base';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Modal, Platform, StyleSheet, Text, View } from 'react-native';
import { Checkbox } from 'react-native-paper';
import WebView from 'react-native-webview';

import { SecondaryButton } from '../components/SecondaryButton';

export interface ConfirmPrivacyPolicyProps {
  onChecked: (checked: boolean) => void;
  checked: boolean;
}
const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    color: '#a2a3b7'
  },
  main: {
    marginTop: 16,
  },
  submitBtn: {
    marginTop: 16,
  },
});

const isIos = Platform.OS === 'ios';

export const ConfirmPrivacyPolicy = (props: ConfirmPrivacyPolicyProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleChecked = () => {
    props.onChecked(!props.checked);
  };

  useEffect(() => {
    setModalVisible(false);
  }, []);

  const handleContinue = () => {
    setModalVisible(false);
  };

  return (
    <>
      <View style={styles.main}>
        <Text style={styles.text}>
          Перед регистрацией Вам необходимо принять
        </Text>
        <SecondaryButton
          transparent
          block
          onPress={() => setModalVisible(true)}
          style={{color: '#a2a3b7'}}>
          Пользовательское соглашение
        </SecondaryButton>
      </View>
      <Modal visible={modalVisible}>
        <Container>
          <View style={{ flex: 1 }}>
            <View style={{ flex : 4 }}>
              <WebView
                source={{ uri: 'https://smart24.kz' }}
              />
            </View>
            <View style={{ flex : 2 }}>
              <Checkbox.Item
                status={props.checked ? 'checked' : 'unchecked'}
                color="#a2a3b7"
                onPress={handleChecked}
                label="Принимаю пользовательское соглашение"
                style={{ width:"90%" }}
              />
              <Button
                block
                disabled={!props.checked}
                style={styles.submitBtn}
                onPress={handleContinue}>
                <NBText>Продолжить</NBText>
              </Button>
            </View>
          </View>
        </Container>
      </Modal>
    </>
  );
};
