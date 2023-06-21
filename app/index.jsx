import { Alert, Image, Linking, Modal, Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as LocalAuthentication from 'expo-local-authentication';
import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { backend_api } from "../services/Api";
import { useNavigation, useRouter } from "expo-router";
import md5 from "md5";
import { storage } from "../services/utils";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [login_modal, setLoginModal] = useState(false)
  const [help_modal, setHelpModal] = useState(false)
  const [login_form, setLoginForm] = useState({})


  const [user, setUser] = useState({})

  const handleSubmitLogin = async () => {

    try {
      if (!login_form.username || !login_form.password) throw new Error("Preencha todos os campos")

      const payload = {
        login: login_form.username,
        password: md5(login_form.password),
      }

      const user_login_response = await backend_api.post("/users/login", payload)
      const user_login_data = user_login_response.data

      if (!user_login_data.id) throw new Error(user_login_data.error ?? "Erro ao fazer login")

      await storage.set("user", user_login_data)

      router.push("/home")

      setLoginForm({})
      setLoginModal(false)
    } catch (error) {
      Alert.alert(error.message ?? "Erro ao fazer login")
    }
  }

  const handleLogin = async () => {
    if (!user.name) return setLoginModal(true);

    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) return setLoginModal(true);

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) return Alert.alert("Você não tem nenhuma biometria cadastrada");

    const { success, error } = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login com biometria",
      cancelLabel: "Cancelar",
      fallbackLabel: "Senha",
      disableDeviceFallback: true,

    });

    if (error) return setLoginModal(true);

    if (success) {
      router.push("/home")
    }
  }

  useEffect(() => {
    (async () => {
      const user_data = await storage.get("user")
      if (user_data) setUser(user_data)
    })()
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, padding: 10 }}>
      <View style={styles.header}>
        <Image source={require("./../assets/logo_full.png")} maxWidth={150} resizeMode="contain" />
        <View>
          {user.name ? <>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontWeight: "bold" }}>Logado como: </Text>
              <Text>{user.username}</Text>
            </View>
            <TouchableOpacity onPress={() => {
              setLoginModal(true)
            }}>
              <Text>Alterar conta</Text>
            </TouchableOpacity>
          </> : <Pressable onPress={() => setLoginModal(true)}>
            <Text style={{ fontWeight: "bold" }}>Faça login</Text>
          </Pressable>}
        </View>
      </View>
      <View style={{ flex: 1 }} />
      <Text style={styles.title}>Que bom ter você por aqui :)</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={{ color: "#fff", fontSize: 24, textTransform: "uppercase", fontWeight: 900, letterSpacing: 3 }}>Login</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: "row", paddingVertical: 15 }}>
        <View style={[styles.footer_item_container, { borderRightWidth: 1 }]}>
          <TouchableOpacity onPress={() => setHelpModal(true)}>
            <Text style={styles.footer_text}>Precisa de ajuda?</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer_item_container}>
          <Text style={styles.footer_text}>Esqueceu sua senha?</Text>
        </View>
      </View>

      <Modal visible={login_modal} animationType="slide" transparent={true} onRequestClose={() => setLoginModal(false)}>
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,.4)" }}>
          <View style={{ backgroundColor: "#fff", padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
              <Text style={{ fontSize: 24, fontWeight: "bold" }}>Faça o login</Text>
              <TouchableOpacity onPress={() => setLoginModal(false)}>
                <FontAwesome name="times" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <View style={{ marginVertical: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>email ou usuário</Text>
              <TextInput style={{ borderBottomWidth: 1, borderBottomColor: "#38434D" }} name="username" placeholder="Digite seu nome" value={login_form.username ?? ""} onChangeText={e => setLoginForm({ ...login_form, username: e })} />

              <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 20 }}>senha</Text>
              <TextInput style={{ borderBottomWidth: 1, borderBottomColor: "#38434D" }} name="password" placeholder="Digite sua senha" value={login_form.password ?? ""} onChangeText={e => setLoginForm({ ...login_form, password: e })} />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmitLogin}>
              <Text style={{ color: "#fff", fontSize: 24, textTransform: "uppercase", fontWeight: 900, letterSpacing: 3 }}>Login</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      <Modal visible={help_modal} animationType="fade" transparent={true} onRequestClose={() => setHelpModal(false)}>
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,.4)", padding: 20 }}>
          <View style={{ backgroundColor: "#fff", padding: 20, borderRadius: 20 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
              <Text style={{ fontSize: 24, fontWeight: "bold" }}>Precisa de ajuda?</Text>
              <TouchableOpacity onPress={() => setHelpModal(false)}>
                <FontAwesome name="times" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <View style={{ marginVertical: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>Contacte o suporte</Text>

              <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 20 }}>
                <FontAwesome name="envelope" size={24} color="black" /><Text style={{ marginLeft: 10 }}>contato@fenol64.com.br</Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome name="whatsapp" size={24} color="black" /><Text style={{ marginLeft: 10 }} onPress={() => {
                  Linking.openURL("https://api.whatsapp.com/send?phone=5521997895329&text=Ol%C3%A1%2C%20preciso%20de%20ajuda%20com%20o%20app%20clothes")
                }}>+55 (21) 9 9789-5329</Text>
              </View>


            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    marginTop: 30,
    height: 70,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
  button: {
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    textTransform: "uppercase",
    borderRadius: 10,
  },
  footer_item_container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderColor: "#38434D",
  },
  footer_text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#38434D",
    textAlign: "center",
  }
});
