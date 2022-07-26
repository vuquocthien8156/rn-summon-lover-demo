import React from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import {
  ButtonConfirm,
  Container,
  Input,
  LabelInput,
  TextButtonConfirm,
  WhiteSpace,
  ButtonFunction,
  TextButtonFunction,
  ContainerFunction,
  TitleFunction,
  LoadingContainer,
} from "./stylesComponent";
import { pushNotification, getTokenById } from "./service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { functions } from "./const";

export const GirlScreen = () => {
  const [loading, setLoading] = React.useState(true);
  const [id, setId] = React.useState("");
  const [token, setToken] = React.useState("");

  React.useEffect(() => {
    AsyncStorage.getItem("boy_friend", (e, data) => {
      if (e) {
        alert(e);
        return;
      }
      const _data = JSON.parse(data);
      setToken(_data?.token);
      setId(_data?.id);
      setLoading(false);
    });
  }, []);

  const onChangeId = (txt) => setId(txt);

  const confirmId = async () => {
    setLoading(true);
    const result = await getTokenById(id);
    if (result?.token) {
      setToken(result.token);
      await AsyncStorage.setItem("boy_friend", JSON.stringify(result));
    }
    setLoading(false);
  };

  const confirmNewBoy = async () => {
    await AsyncStorage.setItem("boy_friend", "");
    setToken("");
    setId("");
  };

  return (
    <Container>
      {!!token ? (
        <>
          <TitleFunction>Mã của gấu là {id} 👦</TitleFunction>
          <ButtonConfirm onPress={confirmNewBoy}>
            <TextButtonConfirm>Có gấu mới</TextButtonConfirm>
          </ButtonConfirm>
        </>
      ) : (
        <>
          <LabelInput>Mã của gấu 👦</LabelInput>
          <Input
            onChangeText={onChangeId}
            placeholder="Nhập mã của gấu đực vào đây"
          />

          <WhiteSpace />
          <ButtonConfirm onPress={confirmId}>
            <TextButtonConfirm>Xác nhận</TextButtonConfirm>
          </ButtonConfirm>
          <WhiteSpace />
        </>
      )}

      {!!token && (
        <>
          <WhiteSpace />
          <TitleFunction>Triệu hồi gấu đực</TitleFunction>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <ContainerFunction>
              {functions.map((func, index) => (
                <ButtonFunction
                  onPress={async () => {
                    setLoading(true);
                    await pushNotification(token, func.title, func.bodyNotify);
                    setLoading(false);
                  }}
                  key={index}
                  backgroundColor={func.color}
                >
                  <TextButtonFunction>{func.title}</TextButtonFunction>
                </ButtonFunction>
              ))}
            </ContainerFunction>
          </ScrollView>
        </>
      )}
      {loading && (
        <LoadingContainer>
          <ActivityIndicator size={"large"} color={"#fff"} />
        </LoadingContainer>
      )}
    </Container>
  );
};
