import { router } from 'expo-router';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function ProductsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>JBS Agri Hub</Text>
        <Text style={styles.subtitle}>Our Products</Text>

        <Pressable onPress={() => router.push('/sprayers')}>
          <Text style={styles.product}>🌱 Power Sprayers</Text>
        </Pressable>

        <Text style={styles.product}>🚜 Power Weeders</Text>
        <Text style={styles.product}>⚙️ Chaff Cutters</Text>
        <Text style={styles.product}>🔧 Spare Parts</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#002b1d',
    padding: 25,
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 40,
  },
  subtitle: {
    color: '#22c55e',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 30,
  },
  product: {
    color: '#ffffff',
    fontSize: 20,
    backgroundColor: '#0b3d2c',
    padding: 20,
    marginBottom: 15,
    borderRadius: 15,
  },
});