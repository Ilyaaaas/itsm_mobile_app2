import { Button, NativeBase } from 'native-base';
import * as React from 'react';
import { StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  secondaryButton: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    color: 'black',
  },
});
export const SecondaryButton = ({
  children,
  ...props
}: React.PropsWithChildren<NativeBase.Button>) => (
  <Button transparent block {...props}>
    <Text style={styles.secondaryButton}>{children}</Text>
  </Button>
);
