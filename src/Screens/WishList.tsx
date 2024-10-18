import { View, Text, Dimensions, FlatList, Image, TextInput, TouchableOpacity, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '../ReuseableComponents/Header';
import { useNavigation } from '@react-navigation/native';
import { getWishlistApi, removeWishlistApi } from '../services/wishlist.service';
import { UserContext, wishlistcntxt } from '../../App';
import NotificationPopup from './NotificationPopup';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import { generateFilePath } from '../services/url.service';
import { addToCart } from '../services/usercart.service';
import { CartItem } from '../services/localcart.service';
import { errorMSg } from '../utils/errormsf';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const { height, width } = Dimensions.get('window')
const Wishlist = () => {
  const navigation = useNavigation()
  const mainFont = 'Montserrat-Regular'
  const mainFontBold = 'Montserrat-Bold'
  const secondFont = 'Lato-Regular'
  const red = '#CE3436'
  const [inc, setinc] = useState(0)
  const [wishlistArr, setWishlistArr] = useState([])
  const [itminwishlst, setitminwishlst] = useContext(wishlistcntxt)
  const [notificationtxt, setNotificationtxt] = useState("")
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useContext(UserContext)

    useEffect(() => {
      handleGetWislit();
    }, []);

    const handleGetWislit = async () => {
      try {
        let {data: res} = await getWishlistApi('');
        if (res.data) {
          setWishlistArr(res.data);
        }
      } catch (error) {
      }
    };

    const handleAddToCart = async (wishlit: any) => {
      try {
        let obj: any = {
          productId: wishlit.productId,
          name: wishlit?.name,
          slug: wishlit?.slug,
          price: wishlit.price,
          sku: wishlit?.sku,
          mrp: wishlit?.mrp,
          stock: wishlit?.stock,
          productImage: wishlit?.productImage,
          quantity: 1,
        };


        console.log(wishlit, 'objobjobjobjobjobjobj');

        let response: {
          data: CartItem[];
          message: string;
        } = {
          data: [],
          message: '',
        };
        let {data: res} = await addToCart(obj);
        response = res;
        setNotificationtxt('Product added to cart');

        await removeWishlistApi(wishlit?._id);
        handleGetWislit();
      } catch (error: any) {
        let msg = errorMSg(error);
        setNotificationtxt(msg);

      }
    };
  
  useEffect(() => {
    setTimeout(() => {
      setNotificationtxt('');
    }, 3000);
  }, [notificationtxt]);
    const handleRemovewishlist = async (id: string) => {
      try {
        let {data: res} = await removeWishlistApi(id);
        if (res.message) {
          setNotificationtxt('Product deleted from the Wishlist.');
          handleGetWislit();
        }
      } catch (error) {
            let msg = errorMSg(error);
            setNotificationtxt(msg);
        // toastError(error)
      }
    }; 


  return (
    <View style={{ width: width, height: height, backgroundColor: 'white', justifyContent: 'space-between', }}>
      <Header back={true} label='Wishlist' />
      {notificationtxt != "" && <NotificationPopup name={notificationtxt} />}
      {/* <View style={{ width: width, height: hp(8), backgroundColor: '#F5F5F5', flexDirection: 'row', paddingLeft: wp(2), alignItems: 'center', paddingRight: wp(3), justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row' }}>
          <Image source={require('../../assets/img/location.png')}
            style={{ height: wp(6.5), width: wp(6.5) }} />
          <Text style={{ width: wp(55), fontSize: hp(1.8), fontFamily: secondFont, marginLeft: wp(1) }}>Delivering to Rohan, 110091 Action Area II, Newtown, Delhi</Text>
        </View>
        <TouchableOpacity
        onPress={()=>navigation.navigate('AddAddress')}
        style={{ width: wp(20), height: hp(4), borderColor: 'black', borderWidth: 0.9, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'black', fontFamily: secondFont, fontSize: hp(1.8) }}>Change</Text>
        </TouchableOpacity>
      </View> */}


      {
        wishlistArr && wishlistArr?.length > 0 ?


          <>

            {user ? <FlatList


              data={wishlistArr}
              contentContainerStyle={{ paddingBottom: hp(1) }}
              renderItem={({ item, index }) => {
                return (
                  <View
                    style={{
                      width: wp(95),
                      alignSelf: 'center',
                      marginTop: hp(2),
                    }}>
                    {loading ? (
                      <ShimmerPlaceholder
                        style={{width: wp(95), height: hp(15)}}
                      />
                    ) : (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('ProductDetail', {
                            slug: item.slug,
                          })
                        }
                        style={{
                          width: wp(95),
                          alignSelf: 'center',
                          backgroundColor: 'white',
                          elevation: 2,
                          borderRadius: 10,
                          flexDirection: 'row',
                          paddingLeft: wp(2),
                          paddingTop: hp(2),
                          paddingBottom: hp(2),
                          paddingRight: wp(2),
                        }}>
                        <View
                          style={{
                            width: wp(25),
                            height: hp(12),
                            backgroundColor: '#F5F5F5',
                            borderRadius: 8,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Image
                            source={
                              item.productImage != ''
                                ? {uri: generateFilePath(item.productImage)}
                                : require('../../assets/img/img2.png')
                            }
                            style={{
                              height: hp(11),
                              width: wp(24),
                              resizeMode: 'contain',
                            }}
                          />
                        </View>
                        <View
                          style={{
                            width: wp(65),
                            marginLeft: wp(2),
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={{
                              width: wp(65),
                              color: 'black',
                              fontFamily: secondFont,
                              fontSize: hp(1.7),
                            }}>
                            {item.name}
                          </Text>
                          <Text
                            style={{
                              width: wp(65),
                              color: 'black',
                              fontFamily: secondFont,
                              fontSize: hp(1.9),
                              marginTop: hp(0.5),
                            }}>
                            ₹{item.price}
                          </Text>
                          <View
                            style={{
                              width: wp(65),
                              flexDirection: 'row',
                              marginTop: hp(1.5),
                              justifyContent: 'space-between',
                              paddingRight: wp(2),
                            }}>
                            {/* <View style={{ width: wp(25), borderColor: 'black', borderWidth: 0.8, height: hp(4), borderRadius: 5, paddingLeft: wp(2), paddingRight: wp(2), justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                    onPress={()=>{
                      if(inc<=0)setinc(0)
                      else setinc(inc-1)
                      }}
                      >
                      <Image source={require('../../assets/img/minus.png')}
                      style={{ height: wp(6), width: wp(5) }} />
                      </TouchableOpacity>
                      <Text style={{ color: 'black', fontSize: hp(2.2), fontFamily: secondFont }}>{inc}</Text>
                      <TouchableOpacity
                      onPress={()=>setinc(inc+1)}>
                      <Image source={require('../../assets/img/plus.png')}
                      style={{ height: wp(6), width: wp(5) }} />
                    </TouchableOpacity>
                  </View> */}
                            <TouchableOpacity
                              style={{
                                width: wp(25),
                                height: hp(4),
                                backgroundColor: 'black',
                                borderRadius: 8,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                              onPress={() => handleAddToCart(item)}>
                              <Text
                                style={{
                                  color: 'white',
                                  fontFamily: secondFont,
                                  fontSize: hp(1.6),
                                }}>
                                Add To Cart
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => handleRemovewishlist(item._id)}>
                              <Image
                                source={require('../../assets/img/dlt.png')}
                                style={{height: wp(8), width: wp(8)}}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              }}
            />
              :
              <View style={{ width: wp(95), alignSelf: 'center', paddingTop: hp(2), paddingBottom: hp(2), backgroundColor: 'white', elevation: 5, paddingLeft: wp(3), paddingRight: wp(2), borderRadius: wp(4), marginTop: hp(2), top: hp(-71.8) }}>
                <Text style={{ color: 'black', fontFamily: mainFontBold, fontSize: hp(2.5) }}>Your wishlist</Text>
                <Text style={{ color: 'black', fontFamily: mainFont, fontSize: hp(1.8), marginTop: hp(1) }}>Login or signup to view your wishlist.</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Welcome')}
                  style={{ width: wp(90), alignSelf: 'center', height: hp(5.5), alignItems: 'center', justifyContent: 'center', marginTop: hp(2), borderWidth: 1, borderColor: red, borderRadius: 5 }}>
                  <Text style={{ color: red, fontFamily: mainFont, fontSize: hp(2) }}>Login/Signup</Text>
                </TouchableOpacity>
              </View>
            }

          </>
          :

          <View style={{ height: hp(100), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require('../../assets/img/empty-wishlist.png')}
              style={{ height: wp(30), width: wp(30),}} />

            <Text style={{color:'#e53c49', fontSize:wp(6), marginVertical:wp(5), fontFamily: mainFontBold,}}>Your Wishlist is empty!</Text>
            <Text style={{color:'#000', fontSize:wp(4), fontFamily: mainFont,}}>seems like you don't have wishes here.</Text>
            <Text style={{color:'#000', fontSize:wp(4), fontFamily: mainFont,}}>Make a wish!</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{backgroundColor:'#e25c5f', padding:10, marginTop:wp(5), borderRadius:5, paddingHorizontal:wp(8), paddingVertical:wp(3)}} >
              <Text style={{color:'#fff', fontSize:wp(4), fontFamily: mainFont,}}>Start Shop</Text>
            </TouchableOpacity>
          </View>
      }

















      {/* <View style={{ height: hp(8), width: width, backgroundColor: 'white', elevation: 30, flexDirection: 'row', borderTopRightRadius: wp(10), borderTopLeftRadius: wp(10), paddingTop: hp(1), justifyContent: 'center', }}>

        <TouchableOpacity style={{ width: wp(70), height: hp(6), backgroundColor: 'black', borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontFamily: secondFont, fontSize: hp(1.9) }}>Add To Cart All</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  )
}

export default Wishlist