import {
  View, Text, Dimensions, FlatList, Image, TextInput, TouchableOpacity,
  RefreshControl
} from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '../ReuseableComponents/Header';
import { useNavigation } from '@react-navigation/native';
import { UserContext, cartcntxt } from '../../App';
import Modal from "react-native-modal";
import { getDecodedToken, getuserData } from '../services/user.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import { getAllProduct, getAllProducts } from '../services/product.service';
import { getAllBrand } from '../services/brand.service';
import Category from './Category';
import { getAllCat, getCategoryForAppHomePage } from '../services/category';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import { generateFilePath } from '../services/url.service';
import NotificationPopup from './NotificationPopup';
import * as Animatable from 'react-native-animatable';
const TOuchButton = Animatable.createAnimatableComponent(TouchableOpacity);

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const { height, width } = Dimensions.get('window')
const Home = () => {
  const navigation = useNavigation()
  const mainFont = 'Montserrat-Regular'
  const mainFontBold = 'Montserrat-Bold'
  const mainFontMedium = 'Montserrat-Medium'
  const secondFont = 'Lato-Regular'
  const red = '#CE3436'
  const [selected, setselected] = useState('1')
  const [like, setlike] = useState(false)
  const [itmincart, setitmincart] = useContext(cartcntxt)
  const [slctdsctn, setSlctdsctn] = useState('new')
  const [showModal, setShowmodal] = useState(false)
  const [selctedfilter, setSelectedfilter] = useState('Categories')
  const [subcat, setSubcat] = useState('')
  const [user, setUser] = useContext(UserContext)
  const [userName, setUserName] = useState("")
  const [productArr, setProductArr] = useState([])
  const [topsellerArr, setTopsellerArr] = useState([])
  const [brandArr, setBrandArr] = useState([])
  const [newProductArr, setNewProductArr] = useState([])
  const [featured, setFeatured] = useState([])
  const [skip, setSkip] = useState<number>(1);
  const [totalPages, setTotalPages] = useState(0);
  const [catArr, setCatArr] = useState([])
  const [PopularProduct, setPopularProduct] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  let scrollViewRef: any;
  const Data = [
    {
      img: require('../../assets/img/voltas.png'),
      titl: 'Voltas'
    },
    {
      img: require('../../assets/img/hitachi.png'),
      titl: 'Hitachi'
    },
    {
      img: require('../../assets/img/bluestr.png'),
      titl: 'Blue Star'
    },
    {
      img: require('../../assets/img/whirpool.png'),
      titl: 'Whirpool'
    },
    {
      img: require('../../assets/img/lloyd.png'),
      titl: 'Lloyd'
    },
    {
      img: require('../../assets/img/carrier.png'),
      titl: 'Carrier'
    },
    {
      img: require('../../assets/img/bluestr.png'),
      titl: 'Blue Star'
    },
    {
      img: require('../../assets/img/more.png'),
      titl: 'More'
    },
  ]

  const Data2 = [
    {
      titl: 'All',
      indx: '1'
    },
    {
      titl: 'Compressor',
      indx: '2'
    },
    {
      titl: 'Condenser',
      indx: '3'
    },
    {
      titl: 'Evaporator',
      indx: '4'
    },
  ]

  const limit = 4;

  const getDataUser = async () => {
    const userToken = await AsyncStorage.getItem('userData');
    let deCodeedToken = await jwtDecode(userToken)
    console.log(JSON.stringify(deCodeedToken, null, 2), "sashsjkdhsakjshadkjsahdkjhkdh")

    const { data: userData } = await getuserData(deCodeedToken.userId);
    if (userData) {
      // const newData = JSON.stringify(userData.data.userObj.name, null, 2);
      // console.log(JSON.stringify(userData, null, 2))
      setUserName(userData.name)
    }
    else {
      console.log("Nothing Get")
    }

  }


  
const getPopuarProducts = async () => {
  try {
    let {data: res} = await getAllProducts('isFeatured=true&limit=20');
    if (res.data) {
     setFeatured(res.data)
    }
  } catch (error) {
    return [];
  }
};
const getAllBestProducts = async () => {
  try {
    let {data: res} = await getAllProducts('isBestSeller=true&limit=20');
    if (res.data) {
          setTopsellerArr(res.data);

    }
  } catch (error) {
    return [];
  }
};

const getAllNewProducts = async () => {
  try {
    let {data: res} = await getAllProducts('isNew=true&limit=20');
    if (res.data) {
       setNewProductArr(res.data);

    }
  } catch (error) {
    return [];
  }
};

  const getAllproduct = async () => {

    console.log("get all called")
    setLoading(true)
    const { data: res } = await getAllProducts("",null);
    // console.log(JSON.stringify(res.data[0].slug, null, 2) + "All Product Dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    // console.log(res.length() + "All Product Dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    const limitedItems = res.data.slice(0, limit);
    setProductArr(limitedItems)
    // console.log(JSON.stringify(productArr, null, 2), "Dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


    setLoading(false)



  }

  // const getTokenW = async () => {
  //   // const token = AsyncStorage.getItem('userData');
  //   // const newtoken = token.toString();
  //   // console.log(typeof token)
  //   // const newtoken = JSON.stringify(token, null, 2)

  //   const decodedtoken = await getDecodedToken();
  //   console.log("decoded token is " + JSON.stringify(decodedtoken, null, 2))

  // }


  const handleEndReached = () => {
    // setLoading(true)
    if ((skip < totalPages) && (productArr.length / limit) >= 1) {
      let tempPage = skip + 1
      getAllProduct()
      setSkip(tempPage);
    }
    else {
      // setLoading(false);
    }
  }



  let allcategoryGet = async () => {
    try {
      let {data: res} = await getCategoryForAppHomePage('status=APPROVED');
        setCatArr(res.data);
    } catch (error) {
      return [];
    }
  };



  const handleproductSubmit = (slug: any) => {
    console.log(slug, "..................................................")
    navigation.navigate('ProductDetail', { slug })
  }

  useEffect(() => {
    getDataUser()
    getAllproduct()
    // getBrandAll()
    getPopuarProducts();
    getAllNewProducts();
    getAllBestProducts();
    allcategoryGet();
  }, [])




  const onRefresh = () => {
    setRefreshing(true);
    getDataUser()
    getAllproduct()
   getPopuarProducts();
   getAllNewProducts();
   getAllBestProducts();
    allcategoryGet();
    setRefreshing(false);
  };

  const handleScrollToTop = () => {
    scrollViewRef.scrollToOffset({ offset: 0, animated: true })

  };

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const index = Math.floor(contentOffset.y / 3);
    // console.log(index, "first")
    setCurrentIndex(index);
  };

  


  return (
    <View style={{backgroundColor: 'white', width: width, height: height}}>
      <Header profile={true} />
      {/* <NotificationPopup name='Hello' /> */}
      <FlatList
        data={[]}
        ref={ref => (scrollViewRef = ref)}
        renderItem={null}
        onScroll={handleScroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{paddingBottom: hp(8)}}
        ListHeaderComponent={
          <>
            <View style={{}}>
              <View
                style={{
                  width: wp(95),
                  backgroundColor: '#F5F5F5',
                  height: hp(6.5),
                  alignSelf: 'center',
                  marginTop: hp(2),
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingLeft: wp(2),
                  borderRadius: 5,
                }}>
                <Image
                  source={require('../../assets/img/Search.png')}
                  style={{
                    height: wp(7),
                    width: wp(7),
                  }}
                />
                <TouchableOpacity
                  onPress={() => navigation.navigate('SearchPage')}
                  style={{marginLeft: wp(3), width: wp(60)}}>
                  <Text>Search</Text>
                </TouchableOpacity>
             
              </View>

              {/* Filter Modal View >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
              <Modal
                style={{marginLeft: 0}}
                isVisible={showModal}
                animationIn={'slideInLeft'}
                animationOut={'slideOutLeft'}
                onBackButtonPress={() => setShowmodal(false)}>
                <View
                  style={{
                    height: height,
                    width: width,
                    backgroundColor: '#fff',
                  }}>
                  <View
                    style={{
                      width: width,
                      height: hp(8),
                      flexDirection: 'row',
                      paddingRight: wp(3),
                      paddingLeft: wp(2),
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity onPress={() => setShowmodal(false)}>
                      <Image
                        source={require('../../assets/img/back.png')}
                        style={{height: wp(7), width: wp(7)}}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        color: 'black',
                        marginLeft: wp(33),
                        fontSize: hp(2),
                        fontFamily: 'AvenirNextLTPro-Regular',
                      }}>
                      Filter by
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: hp(2)}}>
                    <View
                      style={{
                        width: wp(40),
                        height: hp(75),
                        borderColor: 'gray',
                        borderWidth: 0.7,
                        borderTopRightRadius: wp(8),
                        borderBottomRightRadius: wp(8),
                      }}>
                      <TouchableOpacity
                        onPress={() => setSelectedfilter('Categories')}
                        style={{alignSelf: 'center', marginTop: hp(4)}}>
                        <Text
                          style={{
                            fontFamily: 'AvenirNextLTPro-SemiBold',
                            fontSize: hp(2),
                            color:
                              selctedfilter == 'Categories'
                                ? '#D24A61'
                                : 'black',
                            alignSelf: 'center',
                          }}>
                          Categories
                        </Text>
                        {selctedfilter == 'Categories' && (
                          <View
                            style={{
                              width: wp(28),
                              height: 1,
                              borderBottomColor: '#D24A61',
                              borderBottomWidth: 2,
                              marginTop: hp(0.7),
                              alignSelf: 'center',
                            }}></View>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => setSelectedfilter('Gender')}
                        style={{alignSelf: 'center', marginTop: hp(3)}}>
                        <Text
                          style={{
                            fontFamily: 'AvenirNextLTPro-SemiBold',
                            fontSize: hp(2),
                            color:
                              selctedfilter == 'Gender' ? '#D24A61' : 'black',
                            alignSelf: 'center',
                          }}>
                          Brands
                        </Text>
                        {selctedfilter == 'Gender' && (
                          <View
                            style={{
                              width: wp(28),
                              height: 1,
                              borderBottomColor: '#D24A61',
                              borderBottomWidth: 2,
                              marginTop: hp(0.7),
                              alignSelf: 'center',
                            }}></View>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => setSelectedfilter('Essential')}
                        style={{alignSelf: 'center', marginTop: hp(3)}}>
                        <Text
                          style={{
                            fontFamily: 'AvenirNextLTPro-SemiBold',
                            fontSize: hp(2),
                            color:
                              selctedfilter == 'Essential'
                                ? '#D24A61'
                                : 'black',
                            alignSelf: 'center',
                          }}>
                          Spare Parts
                        </Text>
                        {selctedfilter == 'Essential' && (
                          <View
                            style={{
                              width: wp(28),
                              height: 1,
                              borderBottomColor: '#D24A61',
                              borderBottomWidth: 2,
                              marginTop: hp(0.7),
                              alignSelf: 'center',
                            }}></View>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => setSelectedfilter('Colour')}
                        style={{alignSelf: 'center', marginTop: hp(3)}}>
                        <Text
                          style={{
                            fontFamily: 'AvenirNextLTPro-SemiBold',
                            fontSize: hp(2),
                            color:
                              selctedfilter == 'Colour' ? '#D24A61' : 'black',
                            alignSelf: 'center',
                          }}>
                          Capacity
                        </Text>
                        {selctedfilter == 'Colour' && (
                          <View
                            style={{
                              width: wp(28),
                              height: 1,
                              borderBottomColor: '#D24A61',
                              borderBottomWidth: 2,
                              marginTop: hp(0.7),
                              alignSelf: 'center',
                            }}></View>
                        )}
                      </TouchableOpacity>

                      {/* <TouchableOpacity
                      onPress={() => setSelectedfilter('Stone')}
                      style={{ alignSelf: 'center', marginTop: hp(3) }}>
                      <Text style={{ fontFamily: 'AvenirNextLTPro-SemiBold', fontSize: hp(2), color: selctedfilter == 'Stone' ? "#D24A61" : 'black', alignSelf: 'center' }}>Stone</Text>
                      {selctedfilter == 'Stone' && <View style={{ width: wp(28), height: 1, borderBottomColor: '#D24A61', borderBottomWidth: 2, marginTop: hp(0.7), alignSelf: 'center' }}></View>}
                    </TouchableOpacity> */}
                      <TouchableOpacity
                        onPress={() => setSelectedfilter('Price')}
                        style={{alignSelf: 'center', marginTop: hp(3)}}>
                        <Text
                          style={{
                            fontFamily: 'AvenirNextLTPro-SemiBold',
                            fontSize: hp(2),
                            color:
                              selctedfilter == 'Price' ? '#D24A61' : 'black',
                            alignSelf: 'center',
                          }}>
                          Price
                        </Text>
                        {selctedfilter == 'Price' && (
                          <View
                            style={{
                              width: wp(28),
                              height: 1,
                              borderBottomColor: '#D24A61',
                              borderBottomWidth: 2,
                              marginTop: hp(0.7),
                              alignSelf: 'center',
                            }}></View>
                        )}
                      </TouchableOpacity>
                    </View>
                    <View style={{width: 50}}>
                      {selctedfilter == 'Categories' && (
                        <View style={{marginTop: hp(5), marginLeft: wp(3)}}>
                          <TouchableOpacity
                            onPress={() => setSubcat('Ring')}
                            style={{flexDirection: 'row'}}>
                            {subcat == 'Ring' ? (
                              <Image
                                source={require('../../assets/img/tickfill.png')}
                                style={{height: wp(5), width: wp(5)}}
                              />
                            ) : (
                              <Image
                                source={require('../../assets/img/tick.png')}
                                style={{height: wp(5), width: wp(5)}}
                              />
                            )}
                            <Text
                              style={{
                                color: subcat == 'Ring' ? 'black' : 'gray',
                                marginLeft: wp(1),
                                width: wp(30),
                              }}>
                              AC
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => setSubcat('Earring')}
                            style={{flexDirection: 'row', marginTop: hp(1.5)}}>
                            {subcat == 'Earring' ? (
                              <Image
                                source={require('../../assets/img/tickfill.png')}
                                style={{height: wp(5), width: wp(5)}}
                              />
                            ) : (
                              <Image
                                source={require('../../assets/img/tick.png')}
                                style={{height: wp(5), width: wp(5)}}
                              />
                            )}
                            <Text
                              style={{
                                color: subcat == 'Earring' ? 'black' : 'gray',
                                marginLeft: wp(1),
                                width: wp(30),
                              }}>
                              Fan
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => setSubcat('Pendants')}
                            style={{flexDirection: 'row', marginTop: hp(1.5)}}>
                            {subcat == 'Pendants' ? (
                              <Image
                                source={require('../../assets/img/tickfill.png')}
                                style={{height: wp(5), width: wp(5)}}
                              />
                            ) : (
                              <Image
                                source={require('../../assets/img/tick.png')}
                                style={{height: wp(5), width: wp(5)}}
                              />
                            )}
                            <Text
                              style={{
                                color: subcat == 'Pendants' ? 'black' : 'gray',
                                marginLeft: wp(1),
                                width: wp(30),
                              }}>
                              Coil
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => setSubcat('Bracelets')}
                            style={{flexDirection: 'row', marginTop: hp(1.5)}}>
                            {subcat == 'Bracelets' ? (
                              <Image
                                source={require('../../assets/img/tickfill.png')}
                                style={{height: wp(5), width: wp(5)}}
                              />
                            ) : (
                              <Image
                                source={require('../../assets/img/tick.png')}
                                style={{height: wp(5), width: wp(5)}}
                              />
                            )}
                            <Text
                              style={{
                                color: subcat == 'Bracelets' ? 'black' : 'gray',
                                marginLeft: wp(1),
                                width: wp(30),
                              }}>
                              Compressor
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => setSubcat('Necklace')}
                            style={{flexDirection: 'row', marginTop: hp(1.5)}}>
                            {subcat == 'Necklace' ? (
                              <Image
                                source={require('../../assets/img/tickfill.png')}
                                style={{height: wp(5), width: wp(5)}}
                              />
                            ) : (
                              <Image
                                source={require('../../assets/img/tick.png')}
                                style={{height: wp(5), width: wp(5)}}
                              />
                            )}
                            <Text
                              style={{
                                color: subcat == 'Necklace' ? 'black' : 'gray',
                                marginLeft: wp(1),
                                width: wp(30),
                              }}>
                              Fitting
                            </Text>
                          </TouchableOpacity>
                          {/* <TouchableOpacity onPress={() => setSubcat('Bangles')} style={{ flexDirection: 'row', marginTop: hp(1.5) }}>
                        {subcat == 'Bangles' ? <Image source={require('../../assets/img/tickfill.png')} style={{ height: wp(5), width: wp(5) }} /> : <Image source={require('../../assets/img/tick.png')} style={{ height: wp(5), width: wp(5) }} />}
                        <Text style={{ color: subcat == 'Bangles' ? 'black' : 'gray', marginLeft: wp(1), width: wp(30) }}>Bangles</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setSubcat('Nose pins')} style={{ flexDirection: 'row', marginTop: hp(1.5) }}>
                        {subcat == 'Nose pins' ? <Image source={require('../../assets/img/tickfill.png')} style={{ height: wp(5), width: wp(5) }} /> : <Image source={require('../../assets/img/tick.png')} style={{ height: wp(5), width: wp(5) }} />}
                        <Text style={{ color: subcat == 'Nose pins' ? 'black' : 'gray', marginLeft: wp(1), width: wp(30) }}>Nose pins</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setSubcat('Charms')} style={{ flexDirection: 'row', marginTop: hp(1.5) }}>
                        {subcat == 'Charms' ? <Image source={require('../../assets/img/tickfill.png')} style={{ height: wp(5), width: wp(5) }} /> : <Image source={require('../../assets/img/tick.png')} style={{ height: wp(5), width: wp(5) }} />}
                        <Text style={{ color: subcat == 'Charms' ? 'black' : 'gray', marginLeft: wp(1), width: wp(30) }}>Charms</Text>
                      </TouchableOpacity> */}
                        </View>
                      )}
                    </View>
                  </View>
                  <View
                    style={{
                      width: width,
                      height: hp(10),
                      backgroundColor: 'white',
                      position: 'absolute',
                      marginTop: height - hp(10),
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingRight: wp(8),
                      paddingLeft: wp(8),
                      justifyContent: 'space-between',
                    }}>
                    <TouchableOpacity
                      onPress={() => setShowmodal(false)}
                      style={{
                        height: hp(6),
                        width: wp(39),
                        borderColor: '#000',
                        borderWidth: 0.7,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 3,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'AvenirNextLTPro-Regular',
                          color: '#000',
                        }}>
                        Clear All
                      </Text>
                      {/* <Image source={require('../../assets/img/CaretDown.png')}
                                style={{ height: wp(4.5), width: wp(4.5), marginLeft: wp(1) }} /> */}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setShowmodal(false)}
                      style={{
                        height: hp(6),
                        width: wp(39),
                        backgroundColor: '#000',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 3,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'AvenirNextLTPro-Regular',
                          color: '#fff',
                        }}>
                        Apply Filter
                      </Text>
                      {/* <Image source={require('../../assets/img/Faders.png')}
                                style={{ height: wp(4.5), width: wp(4.5), marginLeft: wp(1) }} /> */}
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              {/* Special Offer >>>>>>>>>>>>>>>>> */}
              <View
                style={{width: wp(95), alignSelf: 'center', marginTop: hp(1)}}>
                {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ color: 'black', fontFamily: secondFont, marginTop: hp(0.5), fontSize: hp(2.2) }}>Special offers</Text>
                <TouchableOpacity
                  onPress={() => {
                    // setSlctCatitm('New Collection')
                    navigation.navigate('Category')
                  }}>
                  <Text style={{ fontFamily: secondFont, fontSize: hp(1.7), color: red }}>See All </Text>
                </TouchableOpacity>
              </View>
              */}
                <Image
                  source={require('../../assets/img/img1.png')}
                  style={{
                    height: hp(20),
                    width: wp(95),
                    resizeMode: 'contain',
                    marginTop: hp(2),
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: hp(2),
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: secondFont,
                      marginTop: hp(0.5),
                      fontSize: hp(2.2),
                    }}>
                    Categories
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Category');
                    }}>
                    <Text
                      style={{
                        fontFamily: secondFont,
                        fontSize: hp(1.7),
                        color: red,
                      }}>
                      See All
                    </Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={catArr}
                  horizontal
                  style={{marginTop: hp(2)}}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item, index}) => {
                    return (
                      <>
                        {loading ? (
                          <View style={{marginLeft: wp(2.5)}}>
                            <ShimmerPlaceholder
                              style={{width: wp(28), height: hp(16.5)}}
                            />
                          </View>
                        ) : (
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('SubCategory', {
                                slug: item.slug,
                              })
                            }
                            style={{
                              width: wp(28),
                              height: hp(16.5),
                              marginRight: wp(3),
                              paddingBottom: hp(0.5),
                            }}>
                            <View
                              style={{
                                width: wp(28),
                                height: hp(10),
                                marginRight: wp(3),
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 5,
                              }}>
                              <Image
                                source={{uri: generateFilePath(item.image)}}
                                // uri: generateFilePath(item.image)
                                style={{
                                  width: wp(20),
                                  height: wp(20),
                                  resizeMode: 'contain',
                                }}
                              />
                            </View>

                            <Text
                              style={{
                                color: 'black',
                                width: wp(28),
                                textAlign: 'center',
                                marginTop: hp(0.7),
                                fontSize: hp(1.5),
                                fontFamily: mainFontMedium,
                              }}>
                              {item.name}
                            </Text>
                            {/* <Text style={{ color: 'gray', width: wp(28), textAlign: 'center', marginTop: hp(0.2), fontSize: hp(1.6), fontFamily: mainFontMedium }}>12 Products</Text> */}
                          </TouchableOpacity>
                        )}
                      </>
                    );
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: hp(2),
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: secondFont,
                      marginTop: hp(0.5),
                      fontSize: hp(2.2),
                    }}>
                    Popular Products
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('ProductsSCR');
                    }}>
                    <Text
                      style={{
                        fontFamily: secondFont,
                        fontSize: hp(1.7),
                        color: red,
                      }}>
                      See All
                    </Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={topsellerArr}
                  horizontal
                  style={{marginTop: hp(2)}}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item, index}) => {
                    return (
                      <>
                        {loading ? (
                          <View style={{marginLeft: wp(2.5)}}>
                            <ShimmerPlaceholder
                              style={{width: wp(28), height: hp(15)}}
                            />
                          </View>
                        ) : (
                          <TouchableOpacity
                            onPress={() => handleproductSubmit(item.slug)}
                            style={{
                              width: wp(28),
                              paddingTop: hp(1),
                              marginRight: wp(3),
                              paddingBottom: 0.5,
                            }}>
                            <View
                              style={{
                                width: wp(28),
                                height: hp(13),
                                backgroundColor: '#fff',
                                marginRight: wp(3),
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 5,
                                elevation: 3,
                              }}>
                              <Image
                                source={{
                                  uri: generateFilePath(item.imageArr[0].image),
                                }}
                                style={{
                                  width: wp(20),
                                  height: wp(20),
                                  resizeMode: 'contain',
                                }}
                              />
                            </View>
                            <Text
                              style={{
                                color: 'black',
                                width: wp(28),
                                textAlign: 'center',
                                marginTop: hp(0.7),
                                fontSize: hp(1.6),
                                fontFamily: mainFontMedium,
                              }}>
                              {item.name}
                            </Text>
                            {/* <Text style={{ color: 'gray', width: wp(28), textAlign: 'center', marginTop: hp(0.2), fontSize: hp(1.6), fontFamily: mainFontMedium }}>12 Products</Text> */}
                          </TouchableOpacity>
                        )}
                      </>
                    );
                  }}
                />

                {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: hp(2) }}>
                <Text style={{ color: 'black', fontFamily: secondFont, marginTop: hp(0.5), fontSize: hp(2.2) }}>Top Brands</Text>
                {/* <TouchableOpacity
                  onPress={() => {
                    // setSlctCatitm('New Collection')
                    // navigation.navigate('selectedcat')
                  }}>
                  <Text style={{ fontFamily: secondFont, fontSize: hp(1.7), color: red }}>See All</Text>
                </TouchableOpacity> 
              </View>
              <FlatList
                data={brandArr}
                style={{ marginTop: hp(1.5) }}
                numColumns={4}
                renderItem={({ item, index }) => {
                  return (
                    <>
                      {loading ?
                        <View style={{ marginLeft: wp(2.5), marginBottom: hp(2), }}>
                          <ShimmerPlaceholder style={{ width: wp(21), height: hp(13), }} />
                        </View>
                        : <TouchableOpacity
                          onPress={() => {
                            if (item.name == 'More') navigation.navigate('Brands')
                            else navigation.navigate('ProductDetails', { selectedcat: item.name })
                          }}
                          style={{ width: wp(21), marginRight: wp(1.8), marginLeft: wp(1), alignItems: 'center', marginTop: hp(1.5), }}>
                          <View style={{ borderRadius: wp(15), borderColor: 'gray', borderWidth: 0.8, padding: 5, borderStyle: 'dotted' }}>
                            <Image source={{ uri: item.imageUrl }} style={{ width: wp(18), height: wp(18), resizeMode: 'contain', borderRadius: wp(20) }} />
                          </View>
                          <Text style={{fontSize:hp(1.6)}}>{item.name}</Text>
                        </TouchableOpacity>}
                    </>
                  )
                }}
              /> */}
              </View>

              {/* Most Popular >>>>>>>>>>>>>>>>> */}
              <View
                style={{
                  width: wp(95),
                  alignSelf: 'center',
                  marginTop: hp(2.5),
                }}>
                {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ color: 'black', fontFamily: secondFont, marginTop: hp(0.5), fontSize: hp(2.2) }}>Most Popular</Text>
                <TouchableOpacity
                  onPress={() => {
                    // setSlctCatitm('New Collection')
                    // navigation.navigate('selectedcat')
                  }}>
                  <Text style={{ fontFamily: secondFont, fontSize: hp(1.7), color: red }}>See All</Text>
                </TouchableOpacity>
              </View> */}
                <View
                  style={{
                    width: wp(95),
                    alignSelf: 'center',
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity
                    onPress={() => setSlctdsctn('new')}
                    style={{
                      width: wp(31),
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderBottomColor: red,
                      borderBottomWidth: slctdsctn == 'new' ? 2 : 0,
                      height: hp(5.5),
                    }}>
                    <Text
                      style={{
                        color: slctdsctn == 'new' ? 'black' : 'gray',
                        fontSize: hp(1.9),
                        fontFamily:
                          slctdsctn == 'new' ? mainFontMedium : mainFont,
                      }}>
                      New
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSlctdsctn('featured')}
                    style={{
                      width: wp(31),
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderBottomColor: red,
                      borderBottomWidth: slctdsctn == 'featured' ? 2 : 0,
                      height: hp(5.5),
                    }}>
                    <Text
                      style={{
                        color: slctdsctn == 'featured' ? 'black' : 'gray',
                        fontSize: hp(1.9),
                        fontFamily:
                          slctdsctn == 'fatured' ? mainFontMedium : mainFont,
                      }}>
                      Featured
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSlctdsctn('seller')}
                    style={{
                      width: wp(31),
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderBottomColor: red,
                      borderBottomWidth: slctdsctn == 'seller' ? 2 : 0,
                      height: hp(5.5),
                    }}>
                    <Text
                      style={{
                        color: slctdsctn == 'seller' ? 'black' : 'gray',
                        fontSize: hp(1.9),
                        fontFamily:
                          slctdsctn == 'seller' ? mainFontMedium : mainFont,
                      }}>
                      Top Seller
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* <FlatList
                data={Data2}
                horizontal
                contentContainerStyle={{ paddingLeft: wp(2), marginTop: hp(2) }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => setselected(item.indx)}
                      style={{ paddingLeft: wp(4.5), paddingRight: wp(4.5), height: hp(4), backgroundColor: selected == item.indx ? red : 'white', borderColor: '#979797', borderWidth: selected == item.indx ? 0 : 0.7, marginRight: wp(5), borderRadius: wp(4), justifyContent: 'center' }}>
                      <Text style={{ fontSize: hp(2), color: selected == item.indx ? 'white' : '#979797' }}>{item.titl}</Text>
                    </TouchableOpacity>
                  )
                }}
              /> */}

                {slctdsctn == 'new' && (
                  <FlatList
                    data={newProductArr}
                    // numColumns={2}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{marginTop: hp(2)}}
                    renderItem={({item, index}) => {
                      return (
                        <TouchableOpacity
                          onPress={() => handleproductSubmit(item.slug)}
                          style={{
                            width: wp(41.5),
                            marginRight: wp(3),
                            marginLeft: wp(3),
                            marginTop: hp(1),
                            elevation: 2,
                            backgroundColor: 'white',
                            marginBottom: hp(1),
                          }}>
                          <View
                            style={{
                              width: wp(41.5),
                              height: hp(25),
                              backgroundColor: '#fff',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Image
                              source={{
                                uri: generateFilePath(item.imageArr[0].image),
                              }}
                              style={{width: wp(41), height: hp(18)}}
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
                              {item.name}
                            </Text>
                            <Text
                              style={{
                                fontSize: hp(1.7),
                                fontFamily: mainFontBold,
                                color: 'black',
                                marginTop: hp(1),
                              }}>
                              ₹ {item.price}/-
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
                )}

                {slctdsctn == 'featured' && (
                  <FlatList
                    data={featured}
                    // numColumns={2}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{marginTop: hp(2)}}
                    renderItem={({item, index}) => {
                      return (
                        <TouchableOpacity
                          onPress={() => handleproductSubmit(item.slug)}
                          style={{
                            width: wp(41.5),
                            marginRight: wp(3),
                            marginLeft: wp(3),
                            marginTop: hp(1),
                            elevation: 2,
                            backgroundColor: 'white',
                            marginBottom: hp(1),
                          }}>
                          <View
                            style={{
                              width: wp(41.5),
                              height: hp(25),
                              backgroundColor: '#fff',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Image
                              source={{
                                uri: generateFilePath(item.imageArr[0].image),
                              }}
                              style={{width: wp(41), height: hp(18)}}
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
                              {item.name}
                            </Text>
                            <Text
                              style={{
                                fontSize: hp(1.7),
                                fontFamily: mainFontBold,
                                color: 'black',
                                marginTop: hp(1),
                              }}>
                              ₹ {item.price}/-
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
                )}

                {slctdsctn == 'seller' && (
                  <FlatList
                    data={topsellerArr}
                    // numColumns={2}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{marginTop: hp(2)}}
                    renderItem={({item, index}) => {
                      return (
                        <TouchableOpacity
                          onPress={() => handleproductSubmit(item.slug)}
                          style={{
                            width: wp(41.5),
                            marginRight: wp(3),
                            marginLeft: wp(3),
                            marginTop: hp(1),
                            elevation: 2,
                            backgroundColor: 'white',
                            marginBottom: hp(1),
                          }}>
                          <View
                            style={{
                              width: wp(41.5),
                              height: hp(25),
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Image
                              source={{
                                uri: generateFilePath(item.imageArr[0].image),
                              }}
                              style={{width: wp(41), height: hp(18)}}
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
                              {item.name}
                            </Text>
                            <Text
                              style={{
                                fontSize: hp(1.7),
                                fontFamily: mainFontBold,
                                color: 'black',
                                marginTop: hp(1),
                              }}>
                              ₹ {item.price}/-
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
                )}
              </View>

              {/* Best Seller >>>>>>>>>>>> */}
              <View
                style={{
                  width: wp(95),
                  alignSelf: 'center',
                  marginTop: hp(2.5),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: secondFont,
                      marginTop: hp(0.5),
                      fontSize: hp(2.2),
                    }}>
                    Best Seller
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Category');
                    }}>
                    <Text
                      style={{
                        fontFamily: secondFont,
                        fontSize: hp(1.7),
                        color: red,
                      }}>
                      See All
                    </Text>
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={featured}
                  numColumns={2}
                  contentContainerStyle={{marginTop: hp(2)}}
                  renderItem={({item, index}) => {
                    return (
                      <TouchableOpacity
                        onPress={() => handleproductSubmit(item.slug)}
                        style={{
                          width: wp(41.5),
                          marginRight: wp(3),
                          marginLeft: wp(3),
                          marginTop: hp(3),
                          elevation: 2,
                          backgroundColor: 'white',
                        }}>
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
                              color: 'gray',
                              marginTop: hp(1),
                            }}>
                            {item.name}
                          </Text>
                          {/* <Text
                            style={{
                              fontSize: hp(1.7),
                              fontFamily: secondFont,
                              color: 'black',
                              marginTop: hp(0.5),
                            }}>
                            CE Ac Outdoor Unit Stand, Capacity: 2 Ton
                          </Text> */}
                        </View>
                        <View
                          style={{
                            width: wp(41.5),
                            height: hp(20),
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Image
                            source={{
                              uri: generateFilePath(item.imageArr[0].image),
                            }}
                            style={{width: wp(41), height: hp(18)}}
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
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            height: hp(5),
                          }}>
                          {/* <Text style={{ fontSize: hp(1.7), fontFamily: secondFont, color: red }}>CE Ac Outdoor Unit Stand, Capacity: 2 Ton</Text> */}
                          <Image
                            source={require('../../assets/img/rating.png')}
                            style={{
                              height: hp(1.5),
                              width: wp(18),
                              resizeMode: 'contain',
                            }}
                          />
                          <Text
                            style={{
                              fontSize: hp(1.7),
                              fontFamily: secondFont,
                              color: 'black',
                            }}>
                            <Text style={{color: 'gray'}}></Text>₹ {item.price}
                            /-
                          </Text>
                          {/* <Text style={{ fontSize: hp(1.7), fontFamily: secondFont, color: 'black', marginTop: hp(0.5) }}>QTY: 1</Text> */}
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>

              {/* Popular AC >>>>>>> */}
              <View
                style={{
                  width: wp(95),
                  alignSelf: 'center',
                  marginTop: hp(2.5),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: secondFont,
                      marginTop: hp(0.5),
                      fontSize: hp(2.2),
                    }}>
                    Popular AC Models
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Category');
                    }}>
                    <Text
                      style={{
                        fontFamily: secondFont,
                        fontSize: hp(1.7),
                        color: red,
                      }}>
                      See All
                    </Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={PopularProduct}
                  // numColumns={2}
                  horizontal
                  contentContainerStyle={{marginTop: hp(2)}}
                  renderItem={({item, index}) => {
                    return (
                      <TouchableOpacity
                        onPress={() => handleproductSubmit(item.slug)}
                        style={{
                          width: wp(41.5),
                          marginRight: wp(3),
                          marginTop: hp(3),
                          elevation: 2,
                          backgroundColor: 'white',
                        }}>
                        <View
                          style={{
                            width: wp(41.5),
                            height: hp(20),
                            backgroundColor: '#fff',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Image
                            source={{
                              uri: generateFilePath(item.imageArr[0].image),
                            }}
                            style={{width: wp(41), height: hp(18)}}
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
                            backgroundColor: '#efeeec',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              fontSize: hp(1.9),
                              fontFamily: secondFont,
                              color: red,
                            }}>
                            {item.name}
                          </Text>
                          {/* <Text style={{ fontSize: hp(1.7), fontFamily: secondFont, color: 'black', marginTop: hp(1) }}>Spare Parts</Text> */}
                          {/* <Text style={{ fontSize: hp(1.7), fontFamily: secondFont, color: 'black', marginTop: hp(0.5) }}>QTY: 1</Text> */}
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>

              <View style={{width: wp(95), alignSelf: 'center'}}>
                <TouchableOpacity>
                  <Image
                    source={require('../../assets/img/banner2.png')}
                    style={{
                      width: wp(95),
                      height: hp(15),
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  width: wp(95),
                  alignSelf: 'center',
                  paddingTop: hp(2),
                  alignItems: 'center',
                  paddingBottom: hp(3),
                }}>
                <Text
                  style={{
                    color: red,
                    fontFamily: secondFont,
                    fontSize: hp(2.8),
                  }}>
                  How Can We Help you?
                </Text>
                <Text
                  style={{
                    color: 'black',
                    marginTop: hp(3),
                    fontFamily: secondFont,
                    fontSize: hp(1.6),
                    textAlign: 'center',
                  }}>
                  We are one of India’s largest range of HVAC product suppliers,
                  with over 6,000 items available! Become a member to receive
                  our exclusive
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontFamily: secondFont,
                    fontSize: hp(1.6),
                    textAlign: 'center',
                    marginTop: hp(1),
                  }}>
                  promotions, great deals, and HVAC kit options to bundle
                  everything for your next job together.
                </Text>
                <View
                  style={{
                    width: wp(95),
                    flexDirection: 'row',
                    marginTop: hp(3),
                    justifyContent: 'space-between',
                  }}>
                  <View style={{width: wp(20)}}>
                    <Image
                      source={require('../../assets/img/icn1.png')}
                      style={{
                        height: wp(12),
                        width: wp(12),
                        resizeMode: 'contain',
                      }}
                    />
                    <Text
                      style={{
                        width: wp(20),
                        fontSize: hp(1.6),
                        fontFamily: secondFont,
                        color: 'black',
                        textAlign: 'center',
                      }}>
                      Delivery to site or warehouse pickup
                    </Text>
                  </View>

                  <View style={{width: wp(20)}}>
                    <Image
                      source={require('../../assets/img/icn2.png')}
                      style={{
                        height: wp(12),
                        width: wp(12),
                        resizeMode: 'contain',
                      }}
                    />
                    <Text
                      style={{
                        width: wp(20),
                        fontSize: hp(1.6),
                        fontFamily: secondFont,
                        color: 'black',
                        textAlign: 'center',
                      }}>
                      Extended trading hours
                    </Text>
                  </View>

                  <View style={{width: wp(20)}}>
                    <Image
                      source={require('../../assets/img/icn3.png')}
                      style={{
                        height: wp(12),
                        width: wp(12),
                        resizeMode: 'contain',
                      }}
                    />
                    <Text
                      style={{
                        width: wp(20),
                        fontSize: hp(1.6),
                        fontFamily: secondFont,
                        color: 'black',
                        textAlign: 'center',
                      }}>
                      Largest range of HVAC products
                    </Text>
                  </View>

                  <View style={{width: wp(20)}}>
                    <Image
                      source={require('../../assets/img/icn4.png')}
                      style={{
                        height: wp(12),
                        width: wp(12),
                        resizeMode: 'contain',
                      }}
                    />
                    <Text
                      style={{
                        width: wp(20),
                        fontSize: hp(1.6),
                        fontFamily: secondFont,
                        color: 'black',
                        textAlign: 'center',
                      }}>
                      30 days credit options
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        }
      />

      {currentIndex > 150 && (
        <TOuchButton
          animation={'bounceInDown'}
          duration={1500}
          onPress={handleScrollToTop}
          style={{
            width: wp(17),
            height: wp(17),
            position: 'absolute',
            borderRadius: wp(20),
            justifyContent: 'center',
            alignItems: 'center',
            right: 10,
            bottom: hp(8),
            backgroundColor: 'rgba(255,255,255,0.8)',
          }}>
          <Image
            source={require('../../assets/img/up-arrow.png')}
            style={{height: wp(6), width: wp(6), tintColor: red}}
          />
          <Text
            style={{fontSize: hp(1.1), color: 'black', fontFamily: mainFont}}>
            Scroll to top
          </Text>
        </TOuchButton>
      )}
    </View>
  );
}

export default Home