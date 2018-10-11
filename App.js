import React from 'react';
import { FlatList, ActivityIndicator, StyleSheet, Text, View, Image } from 'react-native';
import ImageOverlay from "react-native-image-overlay";

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }

  componentDidMount(){
    return fetch('http://jsonplaceholder.typicode.com/photos')
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
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
      <View style={{flex: 1, flexDirection: 'row', paddingTop:40}}>
        <FlatList
          horizontal={true}
          data={this.state.dataSource}
          renderItem={({item}) => <ImageOverlay rounded={5} containerStyle={{borderWidth:2, borderColor:'#000', width:100 }}  source={{uri: item.url }}
                                    title={item.title} height={100} titleStyle={{  transform: [{ rotate: '330deg'}] }} />}
          keyExtractor={({id}, index) => id}
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
