import { View, Text, Dimensions, FlatList, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '../ReuseableComponents/Header';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { getAllCat, getCategoryBySlug } from '../services/category';
import { generateFilePath } from '../services/url.service';

const { height, width } = Dimensions.get('window')
const SubCategory = () => {
  const navigation = useNavigation()
  const mainFont = 'Montserrat-Regular'
  const mainFontBold = 'Montserrat-Bold'
  const secondFont = 'Lato-Regular'
  const red = '#CE3436'
  const focused = useIsFocused();
    const route = useRoute();
    
    const [catArr, setCatArr] = useState([]);
    const [categoryObj  , setCategoryObj] = useState("");

  let allcategoryGet = async (slug: string) => {
    try {

      let { data: res } = await getCategoryBySlug(slug);

       setCategoryObj(res.data);
       setCatArr(res.data?.subCategoryArr);
    } catch (error) {
       setCatArr([]);

    }
  };

  useEffect(() => {
    if (route && route.params) {
      allcategoryGet(route.params?.slug);
    }
  }, [route, focused]);

  return (
    <View style={{width: width, height: height, backgroundColor: 'white'}}>
      <Header
        back={true}
        label={`${categoryObj?.name ? categoryObj?.name : 'All Category'}`}
      />
      <FlatList
        data={[]}
        renderItem={null}
        contentContainerStyle={{paddingBottom: hp(10)}}
        ListHeaderComponent={
          <>
            <View
              style={{
                width: wp(95),
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <FlatList
                data={catArr}
                contentContainerStyle={{width: wp(45), paddingBottom: hp(20)}}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item._id}
                horizontal={false} // you must include this line when using numColumns [per the documentation][1]
                numColumns={2}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('ProductsSCR', {
                          slug: item.slug,
                        })
                      }
                      style={{
                        width: wp(47),
                        height: hp(26),
                        marginTop: hp(2),
                        marginBottom: hp(1),
                        alignItems: 'center',
                      }}>
                      {item.image ? (
                        <Image
                          source={{uri: generateFilePath(item.image)}}
                          style={{
                            width: wp(40),
                            height: wp(40),
                            resizeMode: 'contain',
                          }}
                        />
                      ) : (
                        <Image
                          source={require('../../assets/img/img3.png')}
                          style={{
                            width: wp(40),
                            height: wp(40),
                            resizeMode: 'contain',
                          }}
                        />
                      )}

                      <Text
                        style={{
                          fontSize: hp(2),
                          color: 'black',
                          width: wp(43),
                          textAlign: 'center',
                          fontFamily: secondFont,
                        }}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
              {/* <FlatList
              data={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
              contentContainerStyle={{ width: wp(45), paddingBottom: hp(20) }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('ProductDetails')}
                    style={{ width: wp(45), height: hp(32), backgroundColor: '#F5F5F5', marginTop: hp(2), marginBottom: hp(1), alignItems: 'center' }}>
                    <Image source={require('../../assets/img/img4.png')}
                      style={{ width: wp(40), height: wp(50), resizeMode: 'contain' }} />
                    <Text style={{ fontSize: hp(2), color: 'black', width: wp(43), textAlign: 'center', fontFamily: secondFont }}>Condenser</Text>
                  </TouchableOpacity>
                )
              }}
            /> */}
            </View>
          </>
        }
      />
    </View>
  );
}

export default SubCategory;