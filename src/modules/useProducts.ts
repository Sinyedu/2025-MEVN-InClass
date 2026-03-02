import { ref } from "vue";
import type { newProduct, Product } from "@/interfaces/products";

export const useProducts = () => {
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);
  const products = ref<Product[]>([]);

  const fetchProducts = async (): Promise<void> => {
    loading.value = true;
    try {
      const response = await fetch(
        "https://ments-restapi.onrender.com/api/products",
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch products: ${response.status} ${response.statusText}`,
        );
      }
      const data: Product[] = await response.json();
      products.value = data;
      console.log("Fetched products:", products.value);
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error fetching products:", error.value);
    } finally {
      loading.value = false; // Ensure loading is set to false after the fetch attempt
    }
  };

  const getTokenIdandUserId = (): { token: string; userId: string } => {
    const token = localStorage.getItem("token");
    const userIDToken = localStorage.getItem("userIDToken");
    if (!token || !userIDToken) {
      throw new Error("No authentication token found. Please log in.");
    }
    return { token, userId: userIDToken };
  };

  const validateProduct = (product: newProduct): void => {
    if (!product.name) {
      throw new Error("Product name is required.");
    }
  };
  const setDefaultValues = (product: newProduct, userId: string) => {
    return {
      name: product.name || "New Product",
      description:
        product.description ||
        "This is a new product added from the admin panel.",
      imageURL: product.imageURL || "https://picsum.photos/500/500",
      price: product.price || 19.99,
      stock: product.stock || 100,
      discount: product.discount || false,
      discountPct: product.discountPct || 0,
      isHidden: product.isHidden || false,
      _createdBy: userId,
    };
  };

  const addProduct = async (product: newProduct) => {
    try {
      const { token, userId } = getTokenIdandUserId();
      validateProduct(product);
      const productWithDefaults = setDefaultValues(product, userId);
      const response = await fetch(
        "https://ments-restapi.onrender.com/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify(productWithDefaults),
        },
      );
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error response from server:", errorResponse);
        throw new Error(errorResponse.message || "Failed to add product");
      }

      const newProduct: Product = await response.json();
      products.value.push(newProduct);
      console.log("Product added successfully:", newProduct);
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error adding product:", error.value);
    }
  };

  const deleteProductFromServer = async (
    productId: string,
    token: string,
  ): Promise<void> => {
    const response = await fetch(
      `https://ments-restapi.onrender.com/api/products/${productId}`,
      {
        method: "DELETE",
        headers: {
          "auth-token": token,
        },
      },
    );
    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error response from server:", errorResponse);
      throw new Error(errorResponse.message || "Failed to delete product");
    }
  };

  const removeProductFromList = (productId: string): void => {
    products.value = products.value.filter(
      (product) => product._id !== productId,
    );
    console.log("Product removed from list:", productId);
  };

  const deleteProduct = async (productId: string): Promise<void> => {
    try {
      const { token } = getTokenIdandUserId();
      await deleteProductFromServer(productId, token);
      removeProductFromList(productId);
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error deleting product:", error.value);
    }
  };

  return {
    error,
    loading,
    products,
    fetchProducts,
    addProduct,
    deleteProduct,
    validateProduct,
    getTokenIdandUserId,
    setDefaultValues,
  };
};
