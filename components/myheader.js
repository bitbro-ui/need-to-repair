import React ,{Component} from 'react';
import { StyleSheet, Text, View,Alert } from 'react-native';
import {Header,Icon} from 'react-native-elements';

const Myheader=props=>{return(
    <Header 
   
    
    leftComponent={<Icon name='bars'
     type='font-awesome' 
     color='#696969'  
     onPress={() => props.navigation.toggleDrawer()}/>}
     centerComponent=
    {{text:props.title,style:{color:'orange',fontWeight:'bold',fontSize:16}}}
     backgroundColor="skyblue"/>
)}

export default Myheader;