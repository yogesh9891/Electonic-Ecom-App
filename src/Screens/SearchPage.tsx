import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, Pressable, StyleSheet, ImageBackground, Platform, PermissionsAndroid, useWindowDimensions, FlatList } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { generateFilePath } from '../services/url.service';
import { getAllProduct, getAllProducts } from '../services/product.service';

const SearchPage = () => {
    const { height, width } = useWindowDimensions();
    const RegularFont = 'AvenirNextLTPro-Regular';
    const BoldFont = 'AvenirNextLTPro-Bold';

    const navigation = useNavigation()


    const [section1, setsection1] = useState([]);
    const [search, setSearch] = useState<any>("")
    const [productArr, setProductArr] = useState([]);
    const [loading, setLoading] = useState(false);
    const limit = 20;
  

    const handleGeProducts = async (srch: string) => {
        try {

            setLoading(true)
         let query = `isPaginate=true&status=Publish&q=${srch}`;
            // console.log(query, "asa")
            let { data: res } = await getAllProducts(query);
        console.log(
          JSON.stringify(res, null, 2) +
            'All Product Dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        );
            
            if (res.data && res?.data?.length > 0) {
                setProductArr(res?.data);
            } else {
                setProductArr([]);
            }
            setLoading(false);


        } catch (error) {
            setLoading(false);
        }
    }




    useEffect(() => {
        console.log(search, "search")
        if (search != "" && search?.length > 2) {
            handleGeProducts(search);
        }
    }, [search]);

    return (
      <View style={{width: width, height: height, backgroundColor: 'white'}}>
        <View
          style={{
            width: wp(95),
            alignSelf: 'center',
            paddingTop: hp(2),
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              width: wp(70),
              height: hp(5.5),
              borderColor: 'black',
              borderWidth: 1.3,
              borderRadius: 5,
              flexDirection: 'row',
              paddingLeft: wp(2),
              alignItems: 'center',
            }}>
            <Image
              source={require('../../assets/img/Search.png')}
              style={{height: wp(5.5), width: wp(5.5), tintColor: 'black'}}
            />
            <TextInput
              placeholder="Search Products"
              style={{marginLeft: wp(1), width: wp(55)}}
              value={search}
              onChangeText={val => setSearch(val)}
            />
          </View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: wp(20),
              height: hp(5.5),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{color: 'black', fontSize: hp(1.9), fontFamily: BoldFont}}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: width,
            height: hp(4.5),
            backgroundColor: '#F4F4F4',
            marginTop: hp(1.5),
            paddingLeft: wp(2),
            justifyContent: 'center',
          }}>
          <Text style={{fontSize: hp(1.8), color: 'black', fontWeight: '500'}}>
            Search Result
          </Text>
        </View>

        <View style={{width: wp(95), alignSelf: 'center', height: hp(50)}}>
          {!loading ? (
            productArr.length == 0 ? (
              <Text
                style={{
                  alignSelf: 'center',
                  marginTop: hp(10),
                  fontFamily: BoldFont,
                }}>
                No Product Found
              </Text>
            ) : (
              <FlatList
                data={productArr}
                contentContainerStyle={{paddingBottom: hp(5)}}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('ProductDetail', {slug: item.slug});
                      }}
                      style={{
                        width: wp(95),
                        height: hp(6),
                        borderBottomColor: '#E0E0E0',
                        borderBottomWidth: 1,
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          color: 'gray',
                          fontFamily: RegularFont,
                          fontSize: hp(1.7),
                        }}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            )
          ) : (
            <Text
              style={{
                alignSelf: 'center',
                marginTop: hp(10),
                fontFamily: BoldFont,
              }}>
            Loading...
            </Text>
          )}
        </View>

        {/* <View style={{ width: width, height: hp(4.5), backgroundColor: '#F4F4F4', marginTop: hp(1.5), paddingLeft: wp(2), justifyContent: 'center' }}>
                <Text style={{ fontSize: hp(1.8), color: 'black', fontWeight: '500' }}>Select By Category</Text>
            </View>

            <View>
                <FlatList
                    data={section1}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{
                        paddingLeft: wp(3),
                        paddingRight: wp(3),
                        marginVertical: hp(2),
                    }}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                // onPress={() => {
                                //     navigation.navigate('CategoryProduct', { slug: item.slug })
                                // }}
                                style={{
                                    marginRight: wp(4),
                                    marginTop: hp(2),
                                    width: wp(21),
                                    alignItems: 'center',
                                }}>
                                <Image
                                    source={{ uri: generateFilePath(item.image) }}
                                    style={{
                                        height: wp(20),
                                        width: wp(20),
                                        resizeMode: 'contain',
                                    }}
                                />
                                <Text
                                    style={{
                                        alignSelf: 'center',
                                        color: 'black',
                                        fontFamily: 'AvenirNextLTPro-Regular',
                                        marginTop: hp(0.5),
                                        fontSize: wp(3),
                                    }}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View> */}
      </View>
    );
}

export default SearchPage