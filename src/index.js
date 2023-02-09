import { View, Text, Alert, SafeAreaView, StyleSheet, ActivityIndicator,
        ScrollView, RefreshControl } from 'react-native'
import React,{useEffect,useState} from 'react'

import * as Location from 'expo-location'


const openWeatherKey = "95cdae4bf7afd909462c36548cad6d23"
let url = `https://api.openweathermap.org/data/2.5/onecall?&units=metric&exclude=minutely&appid=${openWeatherKey}`

const Weather = () => {

    const [forcast, setForcast] = useState(null);
    const [refershing, setRefreshing] = useState(false);

    const loadForcast = async() => {
        setRefreshing(true);
        // ask for permission to get location
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted'){
            Alert.alert("Permission to access Location was denied");

        }

        //get current location
        let location  = await Location.getCurrentPositionAsync({enableHighAccuracy: true});

        //fetch location form weather api
        const response = await fetch(`${url}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`);
        const data = await response.json();
        if(!response.ok){
            Alert.alert('Error','Someting went Wrong');
        }
        else{
            setForcast(data);
        }
        setRefreshing(false);
    }

    //useEffect is a hook that runs after the component in rendered

    useEffect(() =>{
        loadForcast();
    },[]

    );

    if(!forcast){
        return(
            <SafeAreaView style={StyleSheet.loading}>
                <ActivityIndicator size='large'/>
            </SafeAreaView>
        )
    }

    const current= forcast.current.weather[0];



  return (
    <SafeAreaView style={styles.container}>
        <ScrollView 
            refreshControl={
                <RefreshControl
                    refreshing = {refershing} onRefresh={() => loadForcast()}
                />
            }
            style={{
                marginTop: 50,

            }}
        >
            <Text style = {styles.title}>
                Current Weather
            </Text>
            <Text style = {{alignItems:'center', textAlign:'center'}}>
                Your Location
            </Text>

            <View>

            </View>

        </ScrollView>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#ECDBBA'
    },
    title: {
        textAlign:"center",
        fontSize:36,
        fontWeight:'bold',
        color:'#C84B31'
    }
})

export default Weather