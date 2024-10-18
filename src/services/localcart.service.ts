import AsyncStorage from "@react-native-async-storage/async-storage";
export interface CartItem {
    productId: string,
    name: string,
    price: number,
    mrp?: number,
    sku: string,
    stock?: number,
    productImage: string,
    quantity: number,
}


// export const addItemBuyNow = async (item: any) => {

//     if (!AsyncStorage)
//         return { data: { data: [], message: 'error' } };

//     let localCart: any = await AsyncStorage.getItem("@tekool-local-buy-now");

//     if (!localCart) {
//         localCart = JSON.stringify([])
//         await AsyncStorage.setItem("@tekool-local-buy-now", localCart)
//     }

//     await AsyncStorage.removeItem("@tekool-local-coupon");

//     let cartCopy = []
//     cartCopy.push(item);

//     let stringCart = JSON.stringify(cartCopy);
//     console.log(stringCart, "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
//     await AsyncStorage.setItem("@tekool-local-buy-now", stringCart);


//     return { data: { data: cartCopy, message: "Product Added" } };

// }

export const getLocalCart = async () => {

    let localCart: any = await AsyncStorage.getItem("@tekool-local-cart");
    let cart: any = [];
    if (localCart) {
        cart = JSON.parse(localCart);
    }

    console.log(cart, "localCartlocalCartlocalCart")

    return { data: { data: cart, message: "list of cart" } };
}


export const clearCart = async () => {
 let localCart = JSON.stringify([]);
  AsyncStorage.setItem('@tekool-local-cart', localCart);
  return {data: {data: [], message: 'list of cart'}};
};

export const addItemBuyNow = async (item: any) => {
    if (!AsyncStorage) return { data: { data: [], message: 'error' } };
    let localCart: any = await AsyncStorage.getItem("@tekool-local-buy-now") || '[]';
    // await AsyncStorage.removeItem("@tekool-local-coupon");
    let cartCopy = [item];
    await AsyncStorage.setItem("@tekool-local-buy-now", JSON.stringify(cartCopy));

    return { data: { data: cartCopy, message: "Product Added" } };
}


export const removeItemFromlocalCart = async (itemID: string, obj: any) => {

    console.log(itemID, 'itemIDitemIDitemIDitemIDitemID');
  if (!AsyncStorage) return {data: {data: undefined, message: 'error'}};
  //create cartCopy
  // console.log(itemID,varientId,"remove")
    let localCart: any = await AsyncStorage.getItem('@tekool-local-cart');
  let cart = JSON.parse(localCart);
  let cartCopy = [...cart];

  if (itemID) {
    cartCopy = cartCopy.filter(item => item.productId != itemID);
  }
  let totalCart = cartCopy.length;

  let cartString = JSON.stringify(cartCopy);
  // console.log(cartCopy,"cartCopycartCopy")
  AsyncStorage?.setItem('@tekool-local-cart', cartString);
  return {
    data: cartCopy,
    message: 'Item removed from card successfully',
    totalCart,
  };
};
export const addItemInToLocalCart = async (item: any) => {
    let localCart: any = await AsyncStorage.getItem("@tekool-local-cart");
    if (!localCart) {
        localCart = JSON.stringify([])
        AsyncStorage.setItem("@tekool-local-cart", localCart)
    }

    let cart = JSON.parse(localCart);

    let cartCopy = [...cart];
    let message = '';
    //assuming we have an ID field in our item
    let { productId: ID } = item;

    let existingItem: any = "";
    let cartIndex: number = -1;

    console.log(cartCopy, "objobjobj  ", item);
    //    let exists = checkCartItemExists(cartCopy,item)
    // console.log(exists, "exists in cart")

    if (item.variantobj && item.variantobj?.name != "") {
        //  Add Variant Product
        // existingItem = cartCopy.find(el => el.variantobj.name == item.variantobj?.name && el.productId == ID);
        cartIndex = cartCopy.findIndex(el => el.variantobj.name == item.variantobj?.name && el.productId == ID);
    } else {
        // existingItem = cartCopy.find(cartItem => cartItem.productId == ID);
        cartIndex = cartCopy.findIndex(cartItem => cartItem.productId == ID);
    }

    // //if item already exists
    let stockQuantity = 1;

    if (item && item.quantity) {
        stockQuantity = item.quantity;
    }

    // // console.log(existingItem,"existingItem",obj.stock)
    if (cartIndex > -1) {

        console.log(cartCopy[cartIndex].quantity, stockQuantity, item?.stock, "dsfsdfafsdsdfsdf")

        let cartqty = cartCopy[cartIndex].quantity + stockQuantity
        if (item?.stock && cartqty > item.stock) {
            throw new Error("You have added maximum quantity for this product")
        }
        cartCopy[cartIndex].quantity += stockQuantity//update item
        // existingItem.variantobj = obj.variantobj;
        // console.log(existingItem,"updatedItem")
        message = "Product's quantity Updated";

    } else {

        console.log(stockQuantity, item?.stock, "dsfsdfafsdsdfsdf")
        if (item?.stock && stockQuantity > item.stock) {
            throw new Error("You have added maximum quantity for this product")
        }
        item.quantity = stockQuantity//update item
        cartCopy.push(item);


        message = "Product Added into cart Successfully";
        console.log(item, "adsdasd adsdasd adsdasd adsdasd   ");
    }

    let totalCart = cartCopy.length;
    await AsyncStorage.removeItem("@tekool-local-coupon");
    let stringCart = JSON.stringify(cartCopy);
    console.log(stringCart, "stringCartstringCart")
    await AsyncStorage.setItem("@tekool-local-cart", stringCart);
    return { data: { data: cartCopy, message: message, totalCart } };
}


