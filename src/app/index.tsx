import { router } from 'expo-router';
import React from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>

      {/* JBS LOGO */}
      <View style={styles.logo}>
        <Text style={styles.logoText}>JBS</Text>
      </View>

      {/* TITLE */}
      <Text style={styles.title}>
        JBS Agri Hub
      </Text>

      <Text style={styles.subtitle}>
        Agriculture Equipment & Spares
      </Text>

      {/* MAIN CARD */}
      <View style={styles.card}>

        <Text style={styles.welcome}>
          Welcome to JBS Agri Hub
        </Text>

        <Text style={styles.description}>
          Quality agricultural equipment, sprayers,
          power weeders, chaff cutters and spare parts.
        </Text>

        {/* GET STARTED */}
        <Pressable
          style={styles.button}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.buttonText}>
            GET STARTED
          </Text>
        </Pressable>

      </View>

      {/* FOOTER */}
      <Text style={styles.footer}>
        JBS AGRI HUB
      </Text>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#071A12',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },

  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  logoText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#168B45',
  },

  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: '#A8D5B5',
    marginTop: 8,
    marginBottom: 30,
    textAlign: 'center',
  },

  card: {
    width: '100%',
    backgroundColor: '#102A1D',
    borderRadius: 24,
    padding: 25,
    alignItems: 'center',
  },

  welcome: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  description: {
    fontSize: 15,
    color: '#C9D8CE',
    textAlign: 'center',
    lineHeight: 23,
    marginTop: 12,
  },

  button: {
    width: '100%',
    backgroundColor: '#20A653',
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 25,
  },

  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '900',
  },

  footer: {
    color: '#6D8C78',
    marginTop: 30,
    fontSize: 12,
    fontWeight: '700',
  },
});