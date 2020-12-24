import React, {Component, useEffect, useState} from "react";
import {AsyncStorage, StyleSheet, Text} from "react-native";
import {Body, Container, Content, Header, Left, List, ListItem, Title} from "native-base";
import {Ionicons} from "@expo/vector-icons";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTop: {
        backgroundColor: '#01A19F',
    },
});

export const Head = ({title, onBack = false, props, children}: React.PropsWithChildren<object>) => {
    const [user, setUser] = useState({});

    const getUser = async () => {
        AsyncStorage.getItem('user_data').then((value) => {
            if (value) {
                const obj = JSON.parse(value);
                setUser(obj);
            }
        });
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <>
            <Container>
                <Header style={styles.headerTop}>
                    <Left style={{ flex: 1}}>
                        {onBack ? (
                            <Ionicons name="md-arrow-back"
                                      style={{ color: '#046475', marginLeft: 10 }}
                                      onPress={() => props.navigation.goBack()}
                                      size={24}
                            />
                        ): (
                            <Ionicons name="ios-menu"
                                      style={{ color: '#046475', marginLeft: 10 }}
                                      onPress={() => props.navigation.openDrawer()}
                                      size={24}
                            />
                        )}

                    </Left>
                    <Body style={{ flex: 3 }}>
                        <Title style={{ color: '#046475' }}>{title}</Title>
                    </Body>
                </Header>
                <Content>
                    <ListItem>
                        <Ionicons
                            name="ios-person"
                            style={{ fontSize: 40, paddingVertical: 5 }}
                        />
                        <Body style={{ paddingLeft: 10 }}>
                            <Text style={{ fontSize: 20, paddingVertical: 5 }}>
                                { user.fname } { user.sname }
                            </Text>
                            <Text style={{ fontSize: 12 }}>
                                { user.bday }
                            </Text>
                            <Text style={{ fontSize: 12 }}>
                                { user.iin }
                            </Text>
                        </Body>
                    </ListItem>
                    {children}
                </Content>
            </Container>
        </>
        );
    }