import React, {useState, useContext} from "react";
import { View, Text, Button, TextInput, StyleSheet, Alert } from "react-native";

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  return (
    <View style={styles.container}>
      <Text>Sign In Screen</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign In" />
      
      <Text>Don't have an account?</Text>
      <Button
        title="Sign Up"
        onPress={() => navigation.navigate("SignUp")}
      />

      <Text>Forgot Password?</Text>
      <Button
        title="Reset Password"
        onPress={() => navigation.navigate("ForgotPassword")}
      />
      
    </View>
  );
}

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  input: {
    width: "80%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#333"
  },
  error: {
    color: "red"
  }
});