import * as React from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
import {
  Provider as PaperProvider,
  TextInput,
  Button,
  Text,
  Title,
} from "react-native-paper";
import { useContext } from "react";
import { AuthContext } from "../../context/authcontext";

const userData = {
  id: '1',
  name: "John Gabriel Toledo",
  email: "toledojgabby@gmail.com",
  role: "store"
};


export default function LoginScreen() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { login } = useContext(AuthContext);

  const handleLogin = () => {
    console.log("Logging in with:", email, password);
    login(userData);
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <Title style={styles.title}>Agos</Title>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
          autoCapitalize="none"
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          Login
        </Button>

        <Text style={styles.forgot}>Forgot password?</Text>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
    fontSize: 28,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    padding: 5,
  },
  forgot: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});
