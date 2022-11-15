/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useLayoutEffect} from 'react';
import GlobalStyles from './GlobalStyles';

import {
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Image,
  Text,
  View,
  Button,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import Clipboard from '@react-native-clipboard/clipboard';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import TextRecognition from 'react-native-text-recognition';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const Bg = require('./assets/images/bg.jpg');
const App = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState(null);
  const [nowords, setNoWords] = useState(false);
  const [clipboard, setClipboard] = useState(false);
  const [loading, setLoading] = useState(true);

  const copyToClipboard = text => {
    Clipboard.setString(text.toString());
    alert('Copied to Clipboard');
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      if (image) {
        const result = await TextRecognition.recognize(image.assets[0].uri);

        setText(result);

        if (result.length === 0) {
          setText(null);
          setClipboard(false);
          setNoWords(true);
        } else {
          setClipboard(true);
          setNoWords(false);
        }
      } else {
        return;
      }
    })();
  }, [image]);

  const openImage = () => {
    launchImageLibrary({}, response => {
      if (response.didCancel) {
        return;
      }
      setImage(response);
    });
  };

  const openCamera = () => {
    launchCamera({}, response => {
      if (response.didCancel) {
        return;
      }
      setImage(response);
    });
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: text.toString(),
      });
      // if (result.action === Share.sharedAction) {
      //   if (result.activityType) {
      //     // shared with activity type of result.activityType
      //   } else {
      //     // shared
      //   }
      // } else if (result.action === Share.dismissedAction) {
      //   // dismissed
      // }
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <ScrollView style={{flex: 1}}>
        <View>
          <ImageBackground source={Bg} resizeMode="stretch" style={styles.img}>
            {loading ? (
              <ActivityIndicator size="large" color="#841584" />
            ) : (
              // <TouchableWithoutFeedback
              //   onPress={Keyboard.dismiss}
              //   accessible={false}>
              <View style={styles.container}>
                {text ? (
                  <Image
                    resizeMode="center"
                    source={{uri: image.assets[0].uri}}
                    style={styles.img2}
                  />
                ) : null}
                {nowords && <Text>No words found :(</Text>}

                {text && (
                  <View
                    style={{
                      width: '95%',

                      backgroundColor: '#fff',
                    }}>
                    <Text style={styles.input} selectable={true}>
                      {text.toString()}
                    </Text>
                    {/* <TextInput
                      editable={true}
                      multiline={true}
                      style={styles.input}
                      defaultValue={text ? text.toString() : null}
                    /> */}
                  </View>
                )}
                <View style={{width: '60%'}}>
                  <View style={{margin: 5}}>
                    <Button
                      onPress={openImage}
                      title="Open Gallery"
                      color="#841584"
                    />
                  </View>
                  <View style={{margin: 5}}>
                    <Button
                      onPress={openCamera}
                      title="Take Photo"
                      color="#841584"
                    />
                  </View>
                  {clipboard && (
                    <View style={{margin: 5}}>
                      <Button
                        title="Copy to Clipboard"
                        color="#841584"
                        onPress={() => copyToClipboard(text)}
                      />
                    </View>
                  )}
                  {text && (
                    <View style={{margin: 5}}>
                      <Button onPress={onShare} title="Share" color="#841584" />
                    </View>
                  )}
                </View>
              </View>
              // </TouchableWithoutFeedback>
            )}
          </ImageBackground>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  img2: {
    width: 250,
    height: 250,
    marginBottom: 30,
    marginTop: 30,
  },

  img: {
    minHeight: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 15,
    color: '#000',
  },

  // background: {
  //   backgroundColor: '#fff',
  //   flex: 1,
  // },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    fontFamily: 'Quicksand-Regular',
    fontSize: 15,
    color: '#000',
    borderColor: '#bbbbbb',
    padding: 5,
  },
});

export default App;
