import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { JBS_THEME } from "@/theme/jbs-theme";
import React from "react";
import {
    Alert,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function SprayersScreen() {
  const product: CartItem = {
    id: "petrol-power-sprayer",
    name: "Petrol Power Sprayer",
    price: 12500,
    quantity: 1,
  };

  // ADD TO CART
  const addToCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem("jbs_cart");

      let cart: CartItem[] = [];

      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);

          if (Array.isArray(parsedCart)) {
            cart = parsedCart;
          }
        } catch (error) {
          console.log("Old cart parse error:", error);
          cart = [];
        }
      }

      const existingProductIndex = cart.findIndex(
        (item) => item.id === product.id
      );

      if (existingProductIndex >= 0) {
        // Already in cart - increase quantity
        cart[existingProductIndex] = {
          ...cart[existingProductIndex],
          quantity:
            cart[existingProductIndex].quantity + 1,
        };
      } else {
        // New product
        cart.push(product);
      }

      await AsyncStorage.setItem(
        "jbs_cart",
        JSON.stringify(cart)
      );

      // Open Cart
      router.push("/cart");
    } catch (error) {
      console.log("Add to cart error:", error);

      Alert.alert(
        "Error",
        "Unable to add product to cart."
      );
    }
  };

  // BUY NOW
  const buyNow = () => {
    router.push({
      pathname: "/checkout",
      params: {
        name: product.name,
        price: String(product.price),
        quantity: "1",
        total: String(product.price),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* BACK */}

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.back}>
            ← Back
          </Text>
        </Pressable>

        {/* TITLE */}

        <Text style={styles.title}>
          🌱 Power Sprayers
        </Text>

        <Text style={styles.subtitle}>
          JBS Agri Hub Sprayer Products
        </Text>

        {/* PRODUCT CARD */}

        <View style={styles.card}>
          <View style={styles.productIconBox}>
            <Text style={styles.productIcon}>
              🌱
            </Text>
          </View>

          <Text style={styles.productName}>
            Petrol Power Sprayer
          </Text>

          <Text style={styles.description}>
            High Performance Agriculture Sprayer
          </Text>

          <Text style={styles.price}>
            ₹12,500
          </Text>

          {/* OFFER */}

          <View style={styles.offerRow}>
            <View style={styles.discountBox}>
              <Text style={styles.discount}>
                5% OFF
              </Text>
            </View>

            <View style={styles.coinBox}>
              <Text style={styles.coin}>
                + 1% JBS Coin
              </Text>
            </View>
          </View>

          {/* DELIVERY */}

          <Text style={styles.delivery}>
            🚚 Fast Delivery
          </Text>

          <Text style={styles.stock}>
            ✓ In Stock
          </Text>

          {/* ADD TO CART */}

          <Pressable
            style={({ pressed }) => [
              styles.cartButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={addToCart}
          >
            <Text style={styles.buttonText}>
              ADD TO CART
            </Text>
          </Pressable>

          {/* BUY NOW */}

          <Pressable
            style={({ pressed }) => [
              styles.buyButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={buyNow}
          >
            <Text style={styles.buttonText}>
              BUY NOW
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: JBS_THEME.colors.background,
  },

  content: {
    padding: 25,
    paddingTop: 70,
    paddingBottom: 50,
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },

  back: {
    color: JBS_THEME.colors.text,
    fontSize: 18,
    fontWeight: "600",
  },

  title: {
    color: JBS_THEME.colors.text,
    fontSize: 34,
    fontWeight: "bold",
  },

  subtitle: {
    color: JBS_THEME.colors.primary,
    fontSize: 21,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 30,
  },

  card: {
    backgroundColor: JBS_THEME.colors.surface,
    padding: 22,
    borderRadius: 20,
  },

  productIconBox: {
    width: 85,
    height: 85,
    backgroundColor: JBS_THEME.colors.surfaceElevated,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  productIcon: {
    fontSize: 45,
  },

  productName: {
    color: JBS_THEME.colors.text,
    fontSize: 25,
    fontWeight: "bold",
  },

  description: {
    color: JBS_THEME.colors.textSecondary,
    fontSize: 16,
    lineHeight: 23,
    marginTop: 10,
  },

  price: {
    color: JBS_THEME.colors.text,
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 20,
  },

  offerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 15,
  },

  discountBox: {
    backgroundColor: JBS_THEME.colors.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 8,
  },

  discount: {
    color: JBS_THEME.colors.primarySoft,
    fontSize: 15,
    fontWeight: "bold",
  },

  coinBox: {
    backgroundColor: JBS_THEME.colors.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 8,
  },

  coin: {
    color: JBS_THEME.colors.warning,
    fontSize: 15,
    fontWeight: "bold",
  },

  delivery: {
    color: JBS_THEME.colors.text,
    fontSize: 17,
    marginTop: 18,
  },

  stock: {
    color: JBS_THEME.colors.primarySoft,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 22,
  },

  cartButton: {
    backgroundColor: "#22C55E",
    paddingVertical: 17,
    borderRadius: 13,
    alignItems: "center",
    marginBottom: 13,
  },

  buyButton: {
    backgroundColor: JBS_THEME.colors.primary,
    paddingVertical: 17,
    borderRadius: 13,
    alignItems: "center",
  },

  buttonPressed: {
    opacity: 0.7,
  },

  buttonText: {
    color: JBS_THEME.colors.text,
    fontSize: 17,
    fontWeight: "bold",
  },
});