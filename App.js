import React from 'react';
import { ActivityIndicator, AsyncStorage, Alert, Button, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import ImageOverlay from "react-native-image-overlay";

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }

  async componentDidMount(){

    //we validate if photos storage exists
    const photoStorage = await AsyncStorage.getItem('Photos');


    //If its not set we need to fetch API and saved results
    if(!photoStorage) {

      return fetch('http://jsonplaceholder.typicode.com/photos')//Fetch API endpoint
        .then((response) => response.json())
        .then((responseJson) => {

          this.setState({
            isLoading: false,//stop loading
            dataSource: responseJson,
          }, async function(){
                const photoData = await JSON.stringify(responseJson);
                await AsyncStorage.setItem('Photos', photoData);
                console.log('saved');
          });

        })
        .catch((error) =>{
          console.error(error);
        });

    }else{//Photos storage exists, so we get the data

      const photos = JSON.parse(await AsyncStorage.getItem('Photos'));

      this.setState({
        isLoading: false,//stop loading
        dataSource: photos,
      });

    }

  }

  _orderImages() {
  Alert.alert('on Press!');
 }

  render() {
    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    return(
      <View style={{flex: 1,  paddingTop:40}}>

        <FlatList
          horizontal={true}
          data={this.state.dataSource}
          renderItem={({item}) => <ImageOverlay rounded={10} containerStyle={{borderWidth:2, borderColor:'#000', width:100, marginHorizontal: 10 }}  source={{uri: item.url }}
                                    title={item.title} height={100} titleStyle={{  transform: [{ rotate: '330deg'}] }} />}
          keyExtractor={({id}, index) => id}
        />

        <Button
          onPress={this._orderImages}
          title="Reorder"
          color="#841584"
          accessibilityLabel="Reorder images"
        />

      </View>

    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  images: {
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#000',
    overflow: 'hidden',
  }
});
