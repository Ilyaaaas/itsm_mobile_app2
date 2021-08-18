import { Button, Container, Content, Text as NBText } from 'native-base';
import * as React from 'react';
import { useEffect, useState } from 'react';
import {Modal, Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
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
          <Text style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 16,
            textDecorationLine: 'underline',
            color: 'white'
          }}
                onPress={() => setModalVisible(true)}>
            Пользовательское соглашение
          </Text>
        </View>
        <Modal visible={modalVisible}>
          <Container>

            <View style={{ flex: 1 }}>
              <View style={{ flex : 4 }}>
                <WebView
                    source={{ uri: 'https://smart24.kz' }}
                />
              </View>
              <View style={{ marginHorizontal: 10, justifyContent: 'center',
                alignItems: 'center',
                flex: 3 }}>
                <ScrollView>
                  <Text>
                    1.	Используя настоящее приложение ТОО “Qazqloud”  (далее - Владелец), Вы получаете возможность: {"\n"}
                    -	редактирования личных данных в кабинете приложения;{"\n"}
                    -	создание, просмотр, редактирование, комментирование, закрытие заявок.{"\n"}
                    2.	Деятельность настоящего приложения направлена исключительно на обеспечение процесса взаимодействия заинтересованных лиц (далее - Пользователи) с Владельцем и/или с другими Пользователями.{"\n"}
                    3.	Приложение предоставляет Пользователям ряд сервисов, связанных с деятельностью Владелеца. Сервисы предоставляются на определенных в настоящем Пользовательском соглашении условиях.{"\n"}
                    4.	Использование Пользователями приложения означает, что Пользователь согласен с приведенными условиями настоящего Пользовательского соглашения, а также со всеми изменениями и/или дополнениями к нему.{"\n"}
                    5.	Владелец оставляет за собой право по своему усмотрению осуществлять любое изменение и/или дополнение настоящего Пользовательского соглашения в любое время без предварительного и/или последующего уведомления Пользователя. Новая редакция Пользовательского соглашения вступает в силу с момента ее размещения на приложение Владельца, если иное не предусмотрено новой редакцией Пользовательского соглашения.{"\n"}
                    6.	В случае несогласия Пользователя с каким-либо из положений Пользовательского соглашения, Пользователь не вправе использовать приложение. В случае, если Владельцем были внесены какие-либо изменения в Пользовательское соглашение, с которыми Пользователь не согласен, последний обязан прекратить использование приложения.{"\n"}
                    7.	Настоящее Пользовательское соглашение обязательно для всех Пользователей приложения.{"\n"}
                    8.	Поскольку использование ряда сервисов требует от Пользователя обращения от его лица к Владельцу, Владелец рассматривает осуществление любых действий от лица Пользователя как официальное обращение к Владельцу.{"\n"}
                    9.	Любые споры и разногласия, которые могут возникнуть в связи с использованием Пользователями Приложения, подлежат урегулированию в соответствии с законодательством Республики Казахстан и международными соглашениями, а также настоящим Пользовательским соглашением.{"\n"}
                    10.	Владелец не гарантирует, что работа Приложения будет:{"\n"}
                    - соответствовать ожиданиям Пользователя;{"\n"}
                    - бесперебойной;{"\n"}
                    - безошибочной;{"\n"}
                    - сервисы Приложения будут всегда доступны для Пользователей или будут бесперебойно функционировать;{"\n"}
                    - гарантированно обеспечивать быстроту передачи данных или скорость отправки форм/загрузки файлов;{"\n"}
                    o	обеспечивать отсутствие орфографических ошибок и опечаток.{"\n"}
                    11.	Со своей стороны Владелец приложит все возможные усилия с целью обеспечения вышеперечисленных свойств работы Приложения.{"\n"}
                    12.	Владелец не несет ответственности, в том числе, но не ограничиваясь, за любые убытки, причиненные из-за использования либо невозможности использования Пользователями сервисов Приложения, а также за любые последствия несанкционированного Пользователем / незаконного доступа третьих лиц к авторизационным данным Пользователя (логин, пароль), компьютеру либо личной информации последнего.{"\n"}
                    13.	Приложение содержит ссылки на другие интернет-ресурсы, при этом Владелец не несет какой-либо ответственности за доступность этих интернет-ресурсов и за размещенные на них материалы, а также за любые убытки, причиненные Пользователям в результате использования последними таких материалов. Переходя по внешним ссылкам, Пользователь берет на себя риск того, что результатом его ознакомления или использования сторонних приложений может явиться причинение ему убытков.{"\n"}
                    14.	Признание в соответствии с действующим законодательством РК какого-либо положения настоящего Пользовательского соглашения недействительным или не подлежащим исполнению не влечет недействительности или неисполнимости иных положений Пользовательского соглашения.{"\n"}
                    15.	Для получения объективной и непротиворечивой информации в Приложении Владельца, Пользователь соглашается предоставить правдивую, точную и полную информацию о себе по вопросам, предлагаемым в Формах обратной связи, и поддерживать эту информацию в актуальном состоянии. Если Пользователь предоставляет неверную информацию, или есть серьезные основания полагать, что предоставленная Пользователем информация неверна или неполна или неточна, Владелец имеет право приостановить либо отменить регистрацию Пользователя и отказать Пользователю в использовании сервисов Приложения (либо их части).{"\n"}
                    16.	Соглашаясь с условиями данного Пользовательского соглашения на страницах приложения с возможностью заполнения форм обратной связи, пользователь дает свое согласие на обработку, хранение и передачу средствами сети Internet своих персональных данных Владельцем в целях обеспечения достоверности информации, предоставляемой Владельцем Пользователю.{"\n"}
                    17.	Владелец предупреждает, что в случае исключительно автоматизированной обработки персональных данных (посредством ввода на приложение Владельца без предоставления сведений в документальной форме) Владелец не несет ответственности за правильность и достоверность вводимых Пользователем персональных данных, а также принятые Пользователем решения и за возникшие в связи с этим юридические последствия. В случае несогласия с решением, принятым на основе исключительно автоматизированной обработки персональных данных Пользователь имеет право заявить свои возражения в адрес Владельца в письменной форме не позднее 5 рабочих дней с даты принятия такого решения. Владелец обязуется рассмотреть возражение  в течение тридцати дней со дня его получения и уведомить Пользователя о результатах рассмотрения такого возражения.{"\n"}
                    18.	В случае, если Пользователь считает, что Владелец осуществляет обработку его персональных данных с нарушением требований законодательства РК или иным образом нарушает его права и свободы в сфере обработки персональных данных, в том числе исключительно автоматизированным способом, Пользователь вправе обжаловать действия или бездействие Владельца в службу по надзору в сфере связи, информационных технологий и массовых коммуникаций или в судебном порядке.{"\n"}
                  </Text>
                </ScrollView>
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
