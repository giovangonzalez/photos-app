import React from 'react';
import { ActivityIndicator, AsyncStorage, Alert, Button, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import ImageOverlay from "react-native-image-overlay";

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state ={ isLoading: true, dataSource: []}
  }

  async componentDidMount(){

    //we validate if photos storage exists
    const photoStorage = await AsyncStorage.getItem('Photos');

    //If its not set we need to fetch API and saved results
    if(!photoStorage) {

      console.log('fetching photos...');

      return fetch('http://jsonplaceholder.typicode.com/photos')//Fetch API endpoint
        .then((response) => response.json())
        .then((responseJson) => {

          this.setState({
            isLoading: false,//stop loading
            dataSource: responseJson,
          }, async function(){
                const photoData = await JSON.stringify(responseJson);
                await AsyncStorage.setItem('Photos', photoData);
                console.log(photoData);
          });

        })
        .catch((error) =>{
          console.error(error);
        });

    }else{//Photos storage exists, so we get the data

      console.log('loading photos...');

      const photos = JSON.parse(await AsyncStorage.getItem('Photos'));

      this.setState({
        isLoading: false,//stop loading
        dataSource: photos,
      });

    }

  }

  orderImages() {

    let i = this.state.dataSource.length - 1;
      for (; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = this.state.dataSource[i];
        this.state.dataSource[i] = this.state.dataSource[j];
        this.state.dataSource[j] = temp;
      }

      this.setState({
        isLoading: 'ordered',//refresh render changing state
      });
      //return array;
 }

  render() {
    if(this.state.isLoading == true){ //App is loading resources so we display ActivityIndicator
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    if(this.state.isLoading == 'ordered'){ //We just ordered photos, so we refresh
      this.setState({
        isLoading: false,//refresh render changing state
      });
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    return(//isLoading is false, so we got photos. Let's show them!
      <View style={{flex: 1,  paddingTop:100, height:350}}>
        <View>
        <FlatList
          horizontal={true}
          data={this.state.dataSource}
          renderItem={({item}) => <ImageOverlay rounded={10} containerStyle={{borderWidth:2, borderColor:'#000', width:100, marginHorizontal: 10 }}  source={{uri: item.url }}
                                    title={item.title} height={100} titleStyle={{  transform: [{ rotate: '330deg'}] }} />}
          keyExtractor={({id}, index) => id}
        />
        </View>
        <View>
        <Button
          onPress={this.orderImages.bind(this)}
          title="Reorder"
          color="#841584"
          accessibilityLabel="Reorder images"
        />
        </View>
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
