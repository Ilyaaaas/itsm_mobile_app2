import {
  Container,
  Content,
  Left,
  List,
  ListItem,
  Right,
  Text,
} from 'native-base';
import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  GestureResponderEvent,
  Linking,
  StyleSheet,
} from 'react-native';
import {
  ActivityIndicator,
  Portal,
  Modal,
  Provider as PaperProvider,
  IconButton,
} from 'react-native-paper';
import { WebView } from 'react-native-webview';

import { ScreenHeader } from '../../components/ScreenHeader';
import { useAppDispatch } from '../../helpers/hooks/app-dispatch.hook';
import { useTypedSelector } from '../../helpers/hooks/typed-selector.hook';
import { getHealthyLifestyleListAction } from '../../redux/healthy-lifestyle.actions';
import { healthyLifestyleAdapter } from '../../redux/healthy-lifestyle.slice';
import { HealthyLifestyleInterface } from '../../types/healthy-lifestyle.interface';

const screen = Dimensions.get('screen');
const styles = StyleSheet.create({
  modal: {
    width: screen.width,
    height: screen.height * 0.8,
    marginTop: screen.height * 0.1,
    marginBottom: screen.height * 0.1,
  },
});

export const HealthyLifestyleScreen = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getHealthyLifestyleListAction());
  }, []);

  const data: HealthyLifestyleInterface[] = useTypedSelector((state) =>
    healthyLifestyleAdapter.getSelectors().selectAll(state.healthyLifestyle)
  );

  const [visibleUrl, setVisibleUrl] = useState('');
  const hideModal = () => setVisibleUrl('');

  const isLoading = useTypedSelector(
    (state) => state.healthyLifestyle.isLoading
  );
  if (isLoading) {
    return <ActivityIndicator />;
  }

  const handleDownload = (fileUrl: string) => (
    event: GestureResponderEvent
  ) => {
    event.preventDefault();
    Linking.openURL(fileUrl);
  };

  return (
    <PaperProvider>
      <Portal>
        <Container>
          <ScreenHeader title="Здоровый образ жизни" />
          <Content>
            <List>
              {data.map((value) => (
                <ListItem
                  key={value.title}
                  onPress={() => setVisibleUrl(value.url)}>
                  <Left>
                    <Text>{value.title}</Text>
                  </Left>
                  <Right>
                    <IconButton
                      icon="download"
                      color={'#3b3b3b'}
                      onPress={handleDownload(value.file)}
                    />
                  </Right>
                </ListItem>
              ))}
            </List>
          </Content>
          <Modal
            visible={!!visibleUrl}
            onDismiss={hideModal}
            contentContainerStyle={styles.modal}>
            <WebView source={{ uri: visibleUrl }} />
          </Modal>
        </Container>
      </Portal>
    </PaperProvider>
  );
};
