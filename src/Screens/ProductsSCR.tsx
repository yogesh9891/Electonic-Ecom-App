import { View, Text, Dimensions, FlatList, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '../ReuseableComponents/Header';
import { useNavigation, useRoute } from '@react-navigation/native';
import Modal from "react-native-modal";
import { getAllProduct, getAllProducts } from '../services/product.service';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import { addToCart } from '../services/usercart.service';
import { addToWishlistApi } from '../services/wishlist.service';
import { wishlistcntxt } from '../../App';
import { generateFilePath } from '../services/url.service';
import axios from 'axios';
import { getAllBrand } from '../services/brand.service';
import { getCategoryBySlug, getCategoryForAppHomePage } from '../services/category';
import { addItemInToLocalCart } from '../services/localcart.service';
import { toastSuccess } from '../../../../TekoolNextjs/src/app/utils/toastMessage';
import { getToken } from '../services/user.service';
import NotificationPopup from './NotificationPopup';
import { errorMSg } from '../utils/errormsf';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const { height, width } = Dimensions.get('window')
const ProductsSCR = () => {
  const navigation = useNavigation()
  const mainFont = 'Montserrat-Regular'
  const mainFontBold = 'Montserrat-Bold'
  const secondFont = 'Lato-Regular'
  const red = '#CE3436'
  const route = useRoute();
  // const  seleccatparam  :any = route.params;
  const [selected, setselected] = useState('1')
  const [like, setlike] = useState(false)
  const [showModal, setShowmodal] = useState(false)
  const [selctedfilter, setSelectedfilter] = useState('Categories')
  const [subcat, setSubcat] = useState('')
  const [productArr, setProductArr] = useState([])
  const [skip, setSkip] = useState<number>(1);
  const [loading, setLoading] = useState(false)
  const [quantity, setQuantity] = useState<number>(1);
  const limit = 20;
  const [ProductArrrr, setProductArrrrr] = useState([]);
  const [itminwishlst, setitminwishlst] = useContext(wishlistcntxt)
  const [subcategoryArr1, setSubcategoryArr] = useState<any>([]);
  const [brandArr, setbrandArr] = useState<any>([]);
  const [categoryId, setCategoryId] = useState("");
    const [categoryObj, setCategoryObj] = useState('');
  
  const [brandId, setBrandId] = useState();
  let cancelToken: any;

    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 12;
    const [isLoading, setIsLoading] = useState(true);
    const [priceChecked, setIsPriceChecked] = useState(false);
    const [budgetChecked, setBudgetChecked] = useState(false);
    const [filterChange, setfilterChange] = useState(1);
    const [min, setMin] = useState(99);
    const [max, setMax] = useState(100000);
  const [totalPage, setTotalPage] = useState(0);

    const [notificationtxt, setNotificationtxt] = useState('');

  useEffect (()=>{
    if (route.params) {
      const {selectedcat, selectedbrand}: any = route.params; 
      console.log(route.params.slug, '(route.params(route.params');
      
      if (route.params && route.params.slug) {
       getProductFormSlug(route.params.slug);
     }
    }

  }, [route.params])
  

    
  useEffect(() => {
    setTimeout(() => {
      setNotificationtxt('');
    }, 3000);
  }, [notificationtxt]);
  

  const getProductFormSlug = async (slug: string) => {
    try {

      let {data: res} = await getCategoryBySlug(slug, 'parentSubCategory=true');
      if (res.data) {
        setCategoryId(res.data._id);
        setCategoryObj(res.data);
        if (res.data?.subCategoryArr && res.data?.subCategoryArr?.length > 0) {
          console.log(
            res.data?.subCategoryArr?.length,
            'res.data?.subCategoryArr',
          );
          setSubcategoryArr(
            res.data?.subCategoryArr.map((el: any) => {
              if (res.data._id == el._id) {
                el.checked = true;
              } else {
                el.checked = false;
              }
              return el;
            }),
          );
        } else {
          setSubcategoryArr([])
        }
      }
    } catch (error) {
      // toastError(error);
    }
  };

 const handleGeProducts = async (cancelTokenValue: any) => {
   try {
     setIsLoading(true);
     let isAuth = '';

     let attribute = true;
     let query = `page=${page}&perPage=${ITEMS_PER_PAGE}&isAuth=${isAuth}&attribute=${attribute}`;

     if (
       subcategoryArr1 &&
       subcategoryArr1?.length > 0 &&
       subcategoryArr1?.some((el: any) => el.checked == true)
     ) {
       let filterBycategoryArr = subcategoryArr1
         ?.filter((el: any) => el.checked == true)
         .map((elx: any) => `${elx._id}`);
       if (filterBycategoryArr && filterBycategoryArr?.length > 0) {
         query += `&filterBycategoryArr=${encodeURIComponent(
           JSON.stringify(filterBycategoryArr),
         )}`;
       }
     } else {
       if (categoryId) {
             query += `&categoryId=${categoryId}`;
       }
     }


    if (min >= 0) {
      query += `&min=${min}`;
    }

    if (max > 0) {
      query += `&max=${max}`;
    }

  


    //  if (sortby != '') {
    //    query += `&sortBy=${sortby}`;
    //  }
console.log(query, 'queryqueryqueryquery');
     
     let { data: res } = await getAllProducts(query, cancelTokenValue);
    
     
     if (res.data && res?.data?.length > 0) {
       Promise.resolve()
         .then(() => {
           setProductArr(res?.data);
           setTotalPage(res?.totalPages);
         })
         .then(() => {
           setIsLoading(false);
         });
     } else {
       Promise.resolve()
         .then(() => {
           setProductArr([]);
           setTotalPage(0);
         })
         .then(() => {
           setIsLoading(false);
         });
     }
   } catch (error) {
     if (axios.isCancel(error)) {
     } else {
       setIsLoading(false);
       console.log(error);
     }
   }
 };

    useEffect(() => {
      // console.log(
      //   sortby,
      //   page,
      //   min,
      //   max,
      //   'filtersArr, sortby, categoryId, page',
      // );
      // if (filtersArr && filtersArr.length > 0) {
      if (typeof cancelToken != typeof undefined) {
        cancelToken.cancel('Cacencel ....');
      }
      // customsearchParams.set("page",`${page}`);

      cancelToken = axios?.CancelToken.source();
      setIsLoading(true);
      // window.scrollTo(0, 0);
      handleGeProducts(cancelToken);
      // }
      return () => cancelToken.cancel('component unmounted');
    }, [
      // sortby,
      page,
      // min,
      // max,
      // subcategoryArr1,
      // wishlistChange,
      categoryId,
      filterChange,
    ]);

  const handleSelectedSubcategoryTab = (index: number) => {
    let tempArr = subcategoryArr1.map((el: any, indexX: number) => {
      if (indexX == index) {
        el.checked = !el.checked;
      }
      return el;
    });
    setSubcategoryArr([...tempArr]);
    setfilterChange(prev => prev + 1);

    setPage(1);
    // customsearchParams.set("page",`1`)

    // SetSelectedLink(value);
  };


  let allcategoryGet = async () => {
    try {
      let {data: res} = await getCategoryForAppHomePage('status=APPROVED');
      setSubcategoryArr(
        res.data.map((el: any) => {
          el.checked = false;
          return el;
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };




  let handleAddToCart = async (product: any) => {
    try {
      // console.log(productArr, "PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP")
      // let findedproduct = ProductArrrr.filter(item => item._id === id)
      // console.log(findedproduct, "PPPPPPPPPPPPPPPPPPPPPPPPPPP")

      let token = await getToken();
        let obj: any = {
          productId: product._id,
          name: product?.name,
          slug: product?.slug,
          price: product.price,
          sku: product?.sku,
          stock: product?.stock,
          mrp: product?.mrp,
          productImage: product?.imageArr[0].image,
          quantity: 1,
        };

      if (token) {
        let {data: res} = await addToCart(obj);
        setNotificationtxt('Product  added to the cart');
      } else {
        let {data: res} = await addItemInToLocalCart(obj);
        setNotificationtxt('Product added to the cart');

        // toastSuccess(response.message);
      }
    } catch (error: any) {
      // toastError(error)
      let msg = errorMSg(error);
      setNotificationtxt(msg);
      console.log(error);
    }
  };
  

  const handleAddToWishlist = async (id: any, name: any, price: any, sku: any, stock: any) => {


    // if(!session  || !session?.user){
    //     toastError("Please Login")
    //     return 0
    // }

    let obj: any = {
      productId: id,
      name: name,
      price: price,
      sku: sku,
      stock: stock,
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
        console.warn(res.message)
        setitminwishlst(itminwishlst + 1)
        // if (res.totalCount) {
        //     setWistlistCount(res.totalCount as number)
        // }
      }

    } catch (error) {
      // toastError(error)
      console.error(error)
    }

  }

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

  
  const handlePageClick = (event: any) => {
    setPage(event);
    // customsearchParams.set("page",`${event.selected + 1}`)
  };

const renderPaginationButtons = () => {
  const maxButtonsToShow = 6;
  let startPage = Math.max(1, page - Math.floor(maxButtonsToShow / 2));
  let endPage = Math.min(totalPage, startPage + maxButtonsToShow - 1);

  if (endPage - startPage + 1 < maxButtonsToShow) {
    startPage = Math.max(1, endPage - maxButtonsToShow + 1);
  }

  const buttons = [];

  for (let i = startPage; i <= endPage; i++) {
    buttons.push(
      <TouchableOpacity
        key={i}
        onPress={() => handlePageClick(i)}
        style={[
          styles.paginationButton,
          i === page ? styles.activeButton : null,
        ]}>
        <Text style={{color: 'white'}}>{i}</Text>
      </TouchableOpacity>,
    );
  }

  return buttons;
};
  return (
    <View style={{width: width, height: height, backgroundColor: 'white'}}>
      <Header
        back={true}
        label={`${categoryObj?.name ? categoryObj?.name : 'All Products'}`}
      />
      {notificationtxt != '' && <NotificationPopup name={notificationtxt} />}
      <View
        style={{
          width: wp(95),
          height: hp(6.5),
          alignSelf: 'center',
          marginTop: hp(2),
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: wp(2),
          borderRadius: 5,
        }}>
        {/* <Image
          source={require('../../assets/img/Search.png')}
          style={{
            height: wp(7),
            width: wp(7),
          }}
        />
        <TextInput
          placeholder="Search"
          style={{marginLeft: wp(3), fontFamily: mainFont, width: wp(60)}}
        /> */}
        <TouchableOpacity onPress={() => setShowmodal(true)}>
          <Image
            source={require('../../assets/img/Filter.png')}
            style={{
              height: wp(7),
              width: wp(7),
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
      </View>
      <Modal
        style={{marginLeft: 0}}
        isVisible={showModal}
        animationIn={'slideInLeft'}
        animationOut={'slideOutLeft'}
        onBackButtonPress={() => setShowmodal(false)}>
        <View style={{height: height, width: width, backgroundColor: '#fff'}}>
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
            <View>
              <View style={{marginTop: hp(5), marginLeft: wp(3)}}>
                <FlatList
                  keyExtractor={item => item._id}
                  data={subcategoryArr1}
                  contentContainerStyle={{marginBottom: hp(5)}}
                  renderItem={({item, index}) => {
                    return (
                      <TouchableOpacity
                        onPress={() => handleSelectedSubcategoryTab(index)}
                        style={{flexDirection: 'row'}}>
                        {item.checked ? (
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
                            color: item.checked ? 'black' : 'gray',
                            marginLeft: wp(1),
                            width: wp(60),
                            fontSize: wp(5),
                          }}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
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
                style={{fontFamily: 'AvenirNextLTPro-Regular', color: '#000'}}>
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
                style={{fontFamily: 'AvenirNextLTPro-Regular', color: '#fff'}}>
                Apply Filter
              </Text>
              {/* <Image source={require('../../assets/img/Faders.png')}
                                style={{ height: wp(4.5), width: wp(4.5), marginLeft: wp(1) }} /> */}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={{width: wp(95),marginBottom:hp(35), alignSelf: 'center'}}>
        {isLoading == true ? (
          <View
            style={{width: width, paddingTop: hp(10), alignItems: 'center'}}>
            <Text
              style={{fontFamily: mainFont, color: '#000', fontSize: hp(2.9)}}>
              Loading ...
            </Text>
          </View>
        ) : productArr?.length == 0 ? (
          <View
            style={{width: width, paddingTop: hp(10), alignItems: 'center'}}>
            <Text
              style={{fontFamily: mainFont, color: 'gray', fontSize: hp(1.9)}}>
              Data Not Found!
            </Text>
          </View>
        ) : (
          <View>
            <FlatList
              data={productArr}
              numColumns={2}
              renderItem={({item, index}) => {
                return (
                  <>
                    {loading ? (
                      <View style={{marginLeft: wp(2.5), marginTop: hp(3)}}>
                        <ShimmerPlaceholder
                          style={{width: wp(41.5), height: hp(37)}}
                        />
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('ProductDetail', {
                            slug: item.slug,
                          })
                        }
                        style={{
                          width: wp(41.5),
                          marginRight: wp(3),
                          marginLeft: wp(3),
                          marginTop: hp(3),
                          elevation: 2,
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
                            source={
                              item.imageArr?.length > 0
                                ? {
                                    uri: generateFilePath(
                                      item.imageArr[0].image,
                                    ),
                                  }
                                : require('../../assets/img/img3.png')
                            }
                            style={{width: wp(41), height: hp(18)}}
                          />
                        </View>
                        {/* <TouchableOpacity
                        onPress={() => handleAddToWishlist(item._id, item.foundObject.name, item.foundObject.price, item.foundObject.sku, item.foundObject.stock)}
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
                              color: red,
                            }}>
                            {item.name}
                          </Text>
                          <Text
                            style={{
                              fontSize: hp(1.7),
                              fontFamily: secondFont,
                              color: 'black',
                              marginTop: hp(1),
                            }}>
                            ₹ {item.price}/-
                          </Text>
                          {/* <Text style={{ fontSize: hp(1.7), fontFamily: secondFont, color: 'black', marginTop: hp(0.5) }}>QTY: 1</Text> */}
                          <TouchableOpacity
                            onPress={() =>
                              handleAddToCart(
                                item
                              )
                            }
                            style={{
                              width: wp(30),
                              height: hp(4),
                              marginTop: hp(1.5),
                              backgroundColor: red,
                              alignSelf: 'center',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: wp(1.2),
                            }}>
                            <Text
                              style={{
                                color: 'white',
                                fontSize: hp(1.7),
                                fontFamily: secondFont,
                              }}>
                              Add To Cart
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    )}
                  </>
                );
              }}
            />
            <View style={styles.paginationContainer}>
              {renderPaginationButtons()}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  paginationButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: 'gray',
  },
  activeButton: {
    backgroundColor:  '#CE3436',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
  },
});
export default ProductsSCR