import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import { saveCheckoutDraft } from "@/services/checkout";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function CartScreen() {
  const params = useLocalSearchParams();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------
  // LOAD CART
  // ---------------------------------------

  const loadCart = async () => {
    try {
      setLoading(true);

      const savedCart = await AsyncStorage.getItem("jbs_cart");

      let currentCart: CartItem[] = [];

      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);

          if (Array.isArray(parsedCart)) {
            currentCart = parsedCart;
          } else {
            // Old / wrong cart format
            await AsyncStorage.removeItem("jbs_cart");
            currentCart = [];
          }
        } catch (error) {
          console.log("Cart parse error:", error);

          await AsyncStorage.removeItem("jbs_cart");
          currentCart = [];
        }
      }

      // ---------------------------------------
      // PRODUCT FROM SPRAYERS PAGE
      // ---------------------------------------

      const paramName =
        typeof params.name === "string" ? params.name : "";

      const paramPrice =
        typeof params.price === "string"
          ? Number(params.price)
          : 0;

      const paramQuantity =
        typeof params.quantity === "string"
          ? Number(params.quantity)
          : 1;

      if (paramName && paramPrice > 0) {
        const productId = paramName
          .toLowerCase()
          .replace(/\s+/g, "-");

        const existingIndex = currentCart.findIndex(
          (item) => item.id === productId
        );

        if (existingIndex >= 0) {
          // Product already in cart
          // Do not duplicate when screen refreshes
        } else {
          const newItem: CartItem = {
            id: productId,
            name: paramName,
            price: paramPrice,
            quantity:
              paramQuantity > 0 ? paramQuantity : 1,
          };

          currentCart = [...currentCart, newItem];

          await AsyncStorage.setItem(
            "jbs_cart",
            JSON.stringify(currentCart)
          );
        }
      }

      setCartItems(currentCart);
    } catch (error) {
      console.log("Load cart error:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [params.name, params.price, params.quantity])
  );

  // ---------------------------------------
  // SAVE CART
  // ---------------------------------------

  const saveCart = async (items: CartItem[]) => {
    try {
      setCartItems(items);

      await AsyncStorage.setItem(
        "jbs_cart",
        JSON.stringify(items)
      );
    } catch (error) {
      console.log("Save cart error:", error);
    }
  };

  // ---------------------------------------
  // INCREASE QUANTITY
  // ---------------------------------------

  const increaseQuantity = (id: string) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );

    saveCart(updatedCart);
  };

  // ---------------------------------------
  // DECREASE QUANTITY
  // ---------------------------------------

  const decreaseQuantity = (id: string) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity:
              item.quantity > 1
                ? item.quantity - 1
                : 1,
          }
        : item
    );

    saveCart(updatedCart);
  };

  // ---------------------------------------
  // REMOVE PRODUCT
  // ---------------------------------------

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter(
      (item) => item.id !== id
    );

    saveCart(updatedCart);
  };

  // ---------------------------------------
  // TOTAL
  // ---------------------------------------

  const total = Array.isArray(cartItems)
    ? cartItems.reduce(
        (sum, item) =>
          sum + item.price * item.quantity,
        0
      )
    : 0;

  // ---------------------------------------
  // CHECKOUT
  // ---------------------------------------

  const goToCheckout = async () => {
    if (cartItems.length === 0) {
      return;
    }

    await saveCheckoutDraft({
      items: cartItems,
      total,
    });

    router.push({
      pathname: "/checkout",
      params: {
        total: String(total),
      },
    });
  };

  // ---------------------------------------
  // SCREEN
  // ---------------------------------------

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>
            My Cart
          </Text>

          <View style={styles.headerSpace} />
        </View>

        {/* CONTENT */}

        {loading ? (
          <View style={styles.center}>
            <Text style={styles.loadingText}>
              Loading Cart...
            </Text>
          </View>
        ) : cartItems.length === 0 ? (
          <View style={styles.center}>
            <View style={styles.emptyBox}>
              <Text style={styles.cartIcon}>
                🛒
              </Text>

              <Text style={styles.emptyTitle}>
                Your cart is empty
              </Text>

              <Text style={styles.emptyText}>
                Add agriculture products to your cart.
              </Text>

              <TouchableOpacity
                style={styles.shopButton}
                onPress={() =>
                  router.replace("/products")
                }
                activeOpacity={0.8}
              >
                <Text style={styles.shopButtonText}>
                  Continue Shopping
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.itemCount}>
              Cart Items: {cartItems.length}
            </Text>

            {cartItems.map((item) => (
              <View
                key={item.id}
                style={styles.productCard}
              >
                {/* PRODUCT ICON */}

                <View style={styles.iconBox}>
                  <Text style={styles.productIcon}>
                    🌱
                  </Text>
                </View>

                {/* PRODUCT DETAILS */}

                <View style={styles.productInfo}>
                  <Text style={styles.productName}>
                    {item.name}
                  </Text>

                  <Text style={styles.price}>
                    ₹
                    {item.price.toLocaleString(
                      "en-IN"
                    )}
                  </Text>

                  {/* OFFER */}

                  <View style={styles.offerRow}>
                    <Text style={styles.discount}>
                      5% OFF
                    </Text>

                    <Text style={styles.coin}>
                      + 1% JBS Coin
                    </Text>
                  </View>

                  {/* QUANTITY */}

                  <View style={styles.quantityRow}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() =>
                        decreaseQuantity(item.id)
                      }
                    >
                      <Text
                        style={
                          styles.quantityButtonText
                        }
                      >
                        −
                      </Text>
                    </TouchableOpacity>

                    <Text style={styles.quantity}>
                      {item.quantity}
                    </Text>

                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() =>
                        increaseQuantity(item.id)
                      }
                    >
                      <Text
                        style={
                          styles.quantityButtonText
                        }
                      >
                        +
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* ITEM TOTAL */}

                  <Text style={styles.itemTotal}>
                    Item Total: ₹
                    {(
                      item.price * item.quantity
                    ).toLocaleString("en-IN")}
                  </Text>

                  {/* REMOVE */}

                  <TouchableOpacity
                    onPress={() =>
                      removeItem(item.id)
                    }
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeText}>
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={styles.continueShoppingButton}
              onPress={() =>
                router.push("/products")
              }
            >
              <Text
                style={
                  styles.continueShoppingText
                }
              >
                + Add More Products
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* BOTTOM TOTAL */}

        <View style={styles.bottom}>
          <View>
            <Text style={styles.totalLabel}>
              Total
            </Text>

            <Text style={styles.total}>
              ₹{total.toLocaleString("en-IN")}
            </Text>
          </View>

          <TouchableOpacity
            disabled={cartItems.length === 0}
            style={[
              styles.checkoutButton,
              cartItems.length === 0 &&
                styles.disabledButton,
            ]}
            onPress={goToCheckout}
            activeOpacity={0.8}
          >
            <Text style={styles.checkoutText}>
              Checkout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ---------------------------------------
// STYLES
// ---------------------------------------

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F8F3",
  },

  container: {
    flex: 1,
    backgroundColor: "#F4F8F3",
  },

  header: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: "#FFFFFF",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },

  backText: {
    fontSize: 32,
    color: "#15803D",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#15803D",
  },

  headerSpace: {
    width: 40,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  itemCount: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 15,
  },

  productCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,

    flexDirection: "row",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },

  iconBox: {
    width: 75,
    height: 75,
    backgroundColor: "#DCFCE7",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },

  productIcon: {
    fontSize: 38,
  },

  productInfo: {
    flex: 1,
  },

  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#166534",
  },

  price: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 7,
  },

  offerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },

  discount: {
    color: "#16A34A",
    fontWeight: "bold",
    marginRight: 12,
  },

  coin: {
    color: "#CA8A04",
    fontWeight: "bold",
  },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },

  quantityButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#15803D",
    alignItems: "center",
    justifyContent: "center",
  },

  quantityButtonText: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "bold",
  },

  quantity: {
    fontSize: 19,
    fontWeight: "bold",
    marginHorizontal: 18,
    color: "#111827",
  },

  itemTotal: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: "bold",
    color: "#15803D",
  },

  removeButton: {
    marginTop: 12,
    alignSelf: "flex-start",
  },

  removeText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "bold",
  },

  continueShoppingButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#15803D",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },

  continueShoppingText: {
    color: "#15803D",
    fontSize: 16,
    fontWeight: "bold",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  loadingText: {
    fontSize: 17,
    color: "#15803D",
    fontWeight: "bold",
  },

  emptyBox: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 35,
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },

  cartIcon: {
    fontSize: 80,
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#222222",
    textAlign: "center",
  },

  emptyText: {
    marginTop: 12,
    fontSize: 15,
    color: "#777777",
    textAlign: "center",
    lineHeight: 22,
  },

  shopButton: {
    marginTop: 25,
    backgroundColor: "#15803D",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 14,
  },

  shopButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  bottom: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 18,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  totalLabel: {
    color: "#777777",
    fontSize: 13,
  },

  total: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#15803D",
    marginTop: 3,
  },

  checkoutButton: {
    backgroundColor: "#15803D",
    paddingVertical: 16,
    paddingHorizontal: 38,
    borderRadius: 14,
  },

  disabledButton: {
    opacity: 0.35,
  },

  checkoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});