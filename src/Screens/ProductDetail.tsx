import { View, Text, Dimensions, FlatList, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '../ReuseableComponents/Header';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { getAllProduct, getProductBuSlugApi, getProductById } from '../services/product.service';
import { CartItem, addItemBuyNow, addItemInToLocalCart } from '../services/localcart.service';
import { addToCart } from '../services/usercart.service';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import { getAllBrand } from '../services/brand.service';
import { generateFilePath } from '../services/url.service';
import NotificationPopup from './NotificationPopup';
import { UserContext, wishlistcntxt } from '../../App';
import { addToWishlistApi, getWishlistApi } from '../services/wishlist.service';
import { getToken } from '../services/user.service';
import HTMLView from 'react-native-htmlview';
import { errorMSg } from '../utils/errormsf';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const { height, width } = Dimensions.get('window')
const ProductDetail = () => {
    const navigation = useNavigation()
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const secondFont = 'Lato-Regular'
    const mainFontMedium = 'Montserrat-Medium'
    const red = '#CE3436'
    const [currentindx, setCurrentindx] = useState(0)
    const [inc, setinc] = useState(0)
    const [slctdsctn, setSlctdsctn] = useState('desc')
    const [productData, setProductData] = useState("")
    const [loading, setLoading] = useState(false)
    const [quantity, setQuantity] = useState<number>(1);
    const [relatedproductArr, setRelatedProductArr] = useState([])
    const [brandname, setBrandNAme] = useState("")
    const [imgArr, setImgarr] = useState([])
    const [notificationtxt, setNotificationtxt] = useState("")
    const [user, setUser] = useContext(UserContext)
    const [itminwishlst, setitminwishlst] = useContext(wishlistcntxt)
    const [isWishlisted, setIsWishlisted] = useState(false)
    const route = useRoute();
    const isFocused = useIsFocused();
  const [slugUrl, setSlug] = useState<string>('');


    const { slug } = route.params;

    // const getIDbaseProduct = async () => {
    //     setLoading(true)
    //     const { data: res } = await getProductById(slug)
    //     console.log(JSON.stringify(res.data, null, 2), ">>>>>>>>>>>>>>>>>>>>>>>>>>>")
    //     setImgarr(res.data.imageArr);
    //     // console.log(res.data, "AAAAAAAAAAAAAAAAAAAAAAAA")
    //     setRelatedProductArr(res.data.relatedProductsArr)
    //     setProductData(res.data)
    //     setLoading(false)

    //     const { data: brandres } = await getAllBrand()
    //     // console.log(brandres.data, "Brand Dataaaaaaaaaaaaaaaaaaa")
    //     const filteredBrand = brandres.data.filter(itm => itm._id.includes(res.data.brandId))


    //     const { data: reslt } = await getWishlistApi("")
    //     console.log(JSON.stringify(res, null, 2), ">>>>>>>>>>>>")
    //     if (reslt.data) {
    //         const result = reslt.data;
    //         const datacheck = result.some((item, index) => item.productId == res.data._id)
    //         console.log(datacheck, "Is resulttttttttttttttttt")
    //         if (datacheck) {
    //             setIsWishlisted(true)
    //         }
    //     }
    //     setBrandNAme(filteredBrand[0]?.name)
    //     console.log("first", JSON.stringify(res.data.stock, null, 2))

    // }

  



    let handleAddToCart = async () => {
        try {
            let obj = {
              productId: productData?._id,
              name: productData?.name,
              price: productData?.price,
              sku: productData?.sku,
              stock: productData?.stock,
              // productImage: mainImage,
              productImage: productData?.imageArr[0].image,
              quantity: quantity,
            };

            // if (variantObj && variantObj.name && variantObj.price) {
            //     obj.variantobj = variantObj

            //     setvariantName(obj?.variantobj?.name)
            //     obj.stock = variantObj?.stock
            //     if (variantObj.mrp) {
            //         obj.mrp = variantObj?.mrp
            //     }
            // }
            console.log(
              JSON.stringify(obj, null, 2),
              'objobjobjobjobjobjobj',
            );



            if (obj?.stock &&  obj?.stock < quantity) {
                // toastError("You have added maximum quantity for this product")
                console.warn("You have added maximum quantity for this product");
                   return 0;

            }


            // item.price = sellingPrice;
            // item.mrp = price;
            // let response: {
            //     data: CartItem[], message: string
            // } = {
            //     data: [], message: ""
            // }

            // if (isAuthorised) {

            let token = await getToken();
            if (token) {
              let {data: res} = await addToCart(obj);
              setNotificationtxt('Product added to cart');
            } else {
              let {data: res} = await addItemInToLocalCart(obj);
              setNotificationtxt('Product added to cart');
            }

            // } else {
            //     let { data: res } = await addItemInToLocalCart(obj);
            //     response = res;
            //     toastSuccess(response.message)

            // }
        } catch (error: any) {
              let msg = errorMSg(error);
              setNotificationtxt(msg);
        }
    }


    const handleBuyNowData = async () => {
        try {
            let obj = {
              productId: productData?._id,
              name: productData?.name,
              price: productData?.price,
              sku: productData?.sku,
              stock: productData?.stock,
              // productImage: mainImage,
              productImage: productData?.imageArr[0].image,
              quantity: quantity,
            };

               if (obj?.stock && quantity > obj?.stock) {
                 // toastError("You have added maximum quantity for this product")
                 console.warn(
                   'You have added maximum quantity for this product',
                   );
                   return 0
               }
            console.log(obj, "objobjobjobjobjobjobj")


            let { data: res } = await addItemBuyNow(obj);
            if (user) {
            navigation.navigate('Checkout', {typeofpage: 'Buy'});

            } else {
            navigation.navigate('GuestCheckout', {typeofpage: 'Buy'});

            }
            // response = res;
        } catch (error) {
          let msg = errorMSg(error);
          setNotificationtxt(msg);
        }
  }
  
  
  useEffect(() => {
    setTimeout(() => {
      setNotificationtxt('');
    }, 3000);
  }, [notificationtxt]);

    const getWishlistData = async () => {
        setLoading(true)
        const { data: res } = await getWishlistApi("")
        console.log(JSON.stringify(res, null, 2), ">>>>>>>>>>>>")
        if (res.data) {
            const result = res.data;
            const datacheck = result.some((item, index) => item.productId == productData._id)
            console.log(datacheck, "Is resulttttttttttttttttt")
            if (datacheck) {
                setIsWishlisted(true)
            }
        }
        setLoading(false)
    }

    const addCart = async () => {
        try {
            let obj: CartItem = {
                productId: productData?._id ? productData?._id : '',
                name: productData?.name ? productData?.name : '',
                price: productData.price,
                sku: productData?.sku ? productData?.sku : '',
                stock: productData?.attributesArr[0]?.currentStock,
                productImage: productData?.imageArr[0].image,
                quantity: quantity,
            }





            if (obj?.stock && quantity > obj?.stock) {
                console.log("You have added maximum quantity for this product")

            }

            console.log(obj, "objobjobjobjobjobjobj", productData)

            // item.price = sellingPrice;
            // item.mrp = price;
         
            let token = await getToken();
            if (token) {

            let { data: res } = await addToCart(obj);
            setNotificationtxt("Product added to cart")
            } 
            else {
                let { data: res } = await addItemInToLocalCart(obj);
            setNotificationtxt('Product added to cart');


            }
        } catch (error: any) {
            // toastError(error)
            let msg = errorMSg(error);
            setNotificationtxt(msg);
            console.error(error);
        }
    }


    // const addItemtoCart = async (id: any) => {
    //     const response = await addToCart(id)
    //     console.log(response)
    // }

    const handleproductSubmit = (id: any) => {
        navigation.navigate('ProductDetail', { id })
    }

  useEffect(() => {
    if (route.params && route.params?.slug) {
      setSlug(route.params?.slug);
      getProductFormSlug(route.params?.slug);
    }
  }, [route]);
    
      const getProductFormSlug = async (slug: string) => {
    try {
      let isAuth = "";
        setLoading(true);
   

      let qurty = `${slug}?isAuth=${isAuth}`;
      let { data: res } = await getProductBuSlugApi(qurty);

      let tempImagesArr = [];
        setLoading(false);

      if (res.data) {
        setProductData(res.data);
        setImgarr(res.data.imageArr);
      }

      if (
        res.data.relatedProductsArr &&
        res.data.relatedProductsArr?.length > 0
      ) {
        setRelatedProductArr(res.data.relatedProductsArr);
      }
    } catch (error) {
      console.error(error);
    }
  };

    const handleAddToWishlist = async () => {


        // if(!session  || !session?.user){
        //     toastError("Please Login")
        //     return 0
        // }

        let obj: any = {
            productId: productData._id,
            name: productData.name,
            price: productData.price,
            sku: productData.sku,
            stock: productData.stock,
        }

        // if (variantObj && variantObj?.name && variantObj.price) {
        //   obj.variantobj = variantObj
        // }



        // if (variantObj && variantObj?.name && variantObj?.price) {
        //   let variant = variantObj

        //   let varinatObj: any = {
        //     attributeValueArr: variant,
        //     name: variant?.name,
        //     price: variant?.price,
        //   }

        //   if (variant?.imagesArr && variant?.imagesArr?.length > 0) {
        //     obj.productImage = variant?.imagesArr[0].image
        //   }

        //   obj.variantobj = varinatObj;
        // }

        try {
            let { data: res } = await addToWishlistApi({ product: obj });
            if (res.message) {
                // getProductFormSlug(slugUrl)
                // toastSuccess(res.message)
                console.log(res.message)
                if (res.message == "Product Added successfully") {
                    setNotificationtxt("Product Added To The Wishlist")
                    setitminwishlst(itminwishlst + 1)
                    setTimeout(() => {
                        setNotificationtxt("")
                    }, 5000);
                }
                if (res.message == "Product Remove successfully") {
                    setNotificationtxt("Product Removed from The Wishlist")
                    setitminwishlst(itminwishlst - 1)
                    setTimeout(() => {
                        setNotificationtxt("")
                    }, 5000);
                    setIsWishlisted(false)
                }
                // if (res.totalCount) {
                //     setWistlistCount(res.totalCount as number)
                // }
            }

        } catch (error) {
            // toastError(error)
            console.error(error)
        }

    }
    console.log(currentindx)
    return (
      <View style={{width: width, height: height, backgroundColor: 'white'}}>
        <Header back={true} label="Product Detail" />
        {notificationtxt != '' && <NotificationPopup name={notificationtxt} />}
        <FlatList
          data={[]}
          renderItem={null}
          contentContainerStyle={{paddingBottom: hp(5)}}
          ListHeaderComponent={
            <>
              <View style={{width: width}}>
                <FlatList
                  data={imgArr}
                  horizontal
                  onScroll={e => {
                    const x = e.nativeEvent.contentOffset.x;
                    setCurrentindx((x / width).toFixed(0));
                  }}
                  showsHorizontalScrollIndicator={false}
                  pagingEnabled
                  style={{width: wp(95), alignSelf: 'center'}}
                  renderItem={({item, index}) => {
                    return (
                      <View
                        style={{
                          width: wp(95),
                          height: hp(30),
                          backgroundColor: '#F5F5F5',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        {!loading && (
                          <Image
                            source={
                              item.image != ''
                                ? {
                                    uri: generateFilePath(item.image),
                                  }
                                : require('../../assets/img/img3.png')
                            }
                            style={{
                              height: hp(27),
                              width: wp(100),
                              resizeMode: 'cover',
                            }}
                          />
                        )}
                        {loading && (
                          <ShimmerPlaceholder
                            style={{
                              height: hp(30),
                              width: width,
                            }}></ShimmerPlaceholder>
                        )}
                      </View>
                    );
                  }}
                />

                <FlatList
                  data={imgArr}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{
                    width: wp(20),
                    alignSelf: 'center',
                    marginTop: hp(27),
                    position: 'absolute',
                  }}
                  contentContainerStyle={{alignItems: 'center'}}
                  renderItem={({item, index}) => {
                    return (
                      <View
                        style={{
                          width: currentindx == index ? wp(5) : wp(3),
                          height: wp(3),
                          backgroundColor:
                            currentindx == index ? 'black' : 'gray',
                          marginRight: wp(2),
                          borderRadius: wp(2),
                        }}></View>
                    );
                  }}
                />
                <Text
                  style={{
                    width: wp(95),
                    fontSize: hp(2.1),
                    alignSelf: 'center',
                    color: 'black',
                    marginTop: hp(1.5),
                  }}>
                  {productData.name}
                </Text>
                <Text
                  style={{
                    width: wp(95),
                    fontSize: hp(1.9),
                    alignSelf: 'center',
                    color: 'black',
                  }}>
                  Part No. :{' '}
                  <Text style={{color: '#979797'}}>{productData.sku}</Text>
                </Text>
                {loading && (
                  <View style={{marginLeft: wp(2.5)}}>
                    <ShimmerPlaceholder
                      style={{height: hp(3.1), width: wp(30)}}
                    />
                  </View>
                )}
                {loading ? (
                  <View style={{marginLeft: wp(2.5), marginTop: hp(1)}}>
                    <ShimmerPlaceholder
                      style={{height: hp(3.1), width: wp(40)}}
                    />
                  </View>
                ) : (
                  <Text
                    style={{
                      width: wp(95),
                      alignSelf: 'center',
                      marginTop: hp(1),
                      fontSize: hp(2.1),
                      color: '#979797',
                    }}>
                    <Text style={{color: 'green'}}>
                      ₹ {productData.price}/-
                    </Text>{' '}
                    piece
                  </Text>
                )}

                <View
                  style={{
                    width: wp(95),
                    flexDirection: 'row',
                    alignSelf: 'center',
                  }}>
                  <Text
                    style={{
                      width: wp(20),
                      fontSize: hp(2.1),
                      alignSelf: 'center',
                      color: 'black',
                      marginTop: hp(1.5),
                    }}>
                    Quantity:
                  </Text>
                  <View
                    style={{
                      width: wp(28),
                      borderColor: 'black',
                      borderWidth: 0.8,
                      height: hp(5),
                      borderRadius: 5,
                      paddingLeft: wp(2),
                      paddingRight: wp(2),
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: hp(2),
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        if (quantity <= 1) setQuantity(1);
                        else setQuantity(quantity - 1);
                      }}>
                      <Image
                        source={require('../../assets/img/minus.png')}
                        style={{height: wp(6), width: wp(5)}}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: hp(2.2),
                        fontFamily: secondFont,
                      }}>
                      {quantity}
                    </Text>
                    <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
                      <Image
                        source={require('../../assets/img/plus.png')}
                        style={{height: wp(6), width: wp(5)}}
                      />
                    </TouchableOpacity>
                  </View>
                  {isWishlisted ? (
                    <TouchableOpacity
                      onPress={() => handleAddToWishlist()}
                      style={{
                        width: wp(15),
                        borderColor: 'black',
                        borderWidth: 0.8,
                        height: hp(5),
                        borderRadius: 5,
                        paddingLeft: wp(2),
                        paddingRight: wp(2),
                        justifyContent: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: hp(2),
                        marginLeft: wp(3),
                      }}>
                      <Image
                        source={require('../../assets/img/heartfill.png')}
                        style={{height: wp(6), width: wp(6), tintColor: 'red'}}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleAddToWishlist()}
                      style={{
                        width: wp(15),
                        borderColor: 'black',
                        borderWidth: 0.8,
                        height: hp(5),
                        borderRadius: 5,
                        paddingLeft: wp(2),
                        paddingRight: wp(2),
                        justifyContent: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: hp(2),
                        marginLeft: wp(3),
                      }}>
                      <Image
                        source={require('../../assets/img/like.png')}
                        style={{height: wp(6), width: wp(6)}}
                      />
                    </TouchableOpacity>
                  )}
                </View>

                

                <View
                  style={{
                    width: wp(95),
                    alignSelf: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: hp(2),
                  }}>
                  <TouchableOpacity
                    onPress={() => setSlctdsctn('desc')}
                    style={{
                      width: wp(45),
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderBottomColor: red,
                      borderBottomWidth: slctdsctn == 'desc' ? 2 : 0,
                      height: hp(5.5),
                    }}>
                    <Text
                      style={{
                        color: slctdsctn == 'desc' ? 'black' : 'gray',
                        fontSize: hp(2.2),
                        fontFamily:
                          slctdsctn == 'desc' ? mainFontMedium : mainFont,
                      }}>
                      Description
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSlctdsctn('speci')}
                    style={{
                      width: wp(45),
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderBottomColor: red,
                      borderBottomWidth: slctdsctn == 'speci' ? 2 : 0,
                      height: hp(5.5),
                    }}>
                    <Text
                      style={{
                        color: slctdsctn == 'speci' ? 'black' : 'gray',
                        fontSize: hp(2.2),
                        fontFamily:
                          slctdsctn == 'speci' ? mainFontMedium : mainFont,
                      }}>
                      Specification
                    </Text>
                  </TouchableOpacity>
                </View>
                {slctdsctn == 'desc' && (
                  <Text
                    style={{
                      width: wp(95),
                      fontSize: hp(1.8),
                      alignSelf: 'center',
                      color: '#979797',
                      marginTop: hp(1.5),
                    }}>
                    <HTMLView value={productData.description} />
                  </Text>
                )}
                {slctdsctn == 'speci' && (
                  <Text
                    style={{
                      width: wp(95),
                      fontSize: hp(1.8),
                      alignSelf: 'center',
                      color: '#979797',
                      marginTop: hp(1.5),
                    }}>
                    <HTMLView value={productData.specification} />
                  </Text>
                )}
                <View
                  style={{
                    width: wp(95),
                    alignSelf: 'center',
                    marginTop: hp(2),
                  }}>
                  {/* <View style={{ width: wp(45) }}>
                                <Text style={{ width: wp(45), fontSize: hp(2.1), alignSelf: 'center', color: 'black', marginTop: hp(1.5) }}>Check Avaiabbility:</Text>
                                <View style={{ borderBottomColor: '#CE3436', borderBottomWidth: 1.5, width: wp(45), height: hp(5), marginTop: hp(2), flexDirection: 'row', alignItems: 'center' }}>
                                    <TextInput style={{ width: wp(33) }} />
                                    <TouchableOpacity>
                                        <Text style={{ color: '#CE3436', fontFamily: secondFont, fontSize: hp(2) }}>Check</Text>
                                    </TouchableOpacity>
                                </View>
                            </View> */}
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: secondFont,
                      marginTop: hp(0.5),
                      fontSize: hp(2.2),
                    }}>
                    Similar Product
                  </Text>
                  <FlatList
                    data={relatedproductArr}
                    // numColumns={2}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{marginTop: hp(2)}}
                    renderItem={({item, index}) => {
                      return (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('ProductDetail', {
                              slug: item?.productObj?.slug,
                            })
                          }
                          style={{
                            width: wp(41.5),
                            marginRight: wp(3),
                            marginTop: hp(1),
                            elevation: 2,
                            backgroundColor: 'white',
                            marginBottom: hp(1),
                          }}>
                          <View
                            style={{
                              width: wp(41.5),
                              height: hp(25),
                              backgroundColor: '#EEEEEE',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Image
                              source={{
                                uri: generateFilePath(
                                  item?.productObj?.imageArr[0].image,
                                ),
                              }}
                              style={{
                                width: wp(41),
                                height: hp(18),
                              }}
                            />
                          </View>
                          {/* <TouchableOpacity
                        onPress={() => setlike(!like)}
                        style={{ width: wp(7), height: wp(7), backgroundColor: 'black', position: 'absolute', marginLeft: wp(33), marginTop: hp(1), borderRadius: wp(4), alignItems: 'center', justifyContent: 'center' }}>
                        {like ? <Image source={(require('../../assets/img/heartfill.png'))}
                          style={{ height: wp(5), width: wp(5), tintColor: red }} /> : <Image source={(require('../../assets/img/Heart.png'))}
                            style={{ height: wp(5), width: wp(5) }} />}
                      </TouchableOpacity> */}
                          <View></View>
                          <View
                            style={{
                              width: wp(41.5),
                              paddingTop: hp(1),
                              paddingBottom: hp(2),
                              paddingLeft: wp(1),
                              paddingRight: wp(1),
                            }}>
                            <Text
                              style={{
                                fontSize: hp(1.7),
                                fontFamily: secondFont,
                                color: 'black',
                              }}>
                              {item?.productObj?.name}
                            </Text>
                            <Text
                              style={{
                                fontSize: hp(1.7),
                                fontFamily: mainFontBold,
                                color: 'black',
                                marginTop: hp(1),
                              }}>
                              ₹ {item?.productObj?.price}/-
                            </Text>
                            {/* <Text style={{ fontSize: hp(1.7), fontFamily: secondFont, color: 'black', marginTop: hp(0.5) }}>QTY: 1</Text> */}
                            {/* <TouchableOpacity
                          // onPress={()=>setitmincart([item.])}
                          style={{ width: wp(30), height: hp(4), marginTop: hp(1.5), backgroundColor: red, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: wp(1.2) }}>
                          <Text style={{ color: 'white', fontSize: hp(1.7), fontFamily: secondFont }}>Add To Cart</Text>
                        </TouchableOpacity> */}
                          </View>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              </View>
            </>
          }
        />
        <View
          style={{
            width: wp(95),
            alignSelf: 'center',
            marginTop: hp(3),
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => handleAddToCart()}
            style={{
              width: wp(46),
              height: hp(6.3),
              borderColor: 'black',
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: hp(1.9),
                fontFamily: secondFont,
              }}>
              Add To Cart
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleBuyNowData()}
            style={{
              width: wp(46),
              height: hp(6.3),
              backgroundColor: 'black',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: hp(1.9),
                fontFamily: secondFont,
              }}>
              Buy Now
            </Text>
          </TouchableOpacity>
        </View>
        {/* {productData.attributesArr[0].currentStock &&
                <View style={{ position: 'absolute', height: height, width: width, backgroundColor: 'white' }} >
                    <View style={{ width: wp(15), height: wp(15), backgroundColor: 'white', elevation: 5, alignItems: 'center', justifyContent: 'center', borderRadius: 2, top: hp(43), left: wp(40) }}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                </View>
            } */}
      </View>
    );
}

export default ProductDetail