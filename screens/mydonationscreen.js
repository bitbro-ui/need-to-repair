import React,{Component} from 'react';
import { StyleSheet, Text, View,TextInput, Alert,KeyboardAvoidingView ,TouchableOpacity} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import myheader from '../components/myheader';
import {Card,Icon,ListItem} from 'react-native-elements'
import { FlatList } from 'react-native-gesture-handler';

export default class Mydonationscreen extends Component{
    static navigationOptions = {header:null}
    constructor(){
        super();
        this.state={
            userid:firebase.auth().currentUser.email,
            allDonations:[]
        }
        this.requestref = null
    }

getalldonations = ()=>{
    this.requestref = db.collection("alldonations").where("donorid","==",this.state.userid).onSnapshot((snapshot)=>{
        var alldonations = snapshot.docs.map(document=>document.data())
        this.setState({allDonations:alldonations}) 
    })
}

keyExtractor=(item,index)=>index.toString()
renderItem = ({item,i})=>(
    <ListItem key = {i}
    title={item.bookname}
    subtitle={"requestedby:"+item.requestedby+"\n status:"+item.requeststatus}
    leftElement={<Icon name = "book"type = "font-awesome"color="saffron"/>}
    titleStyle = {{color:"saffron",fontWeight:'bold',fontSize:20}}
    rightElement={<TouchableOpacity style = {styles.button,{backgroundColor:item.requeststatus == "booksent"?"green":"red"}} onPress={()=>{
        this.sentbook(item)
    }}><Text>send book</Text></TouchableOpacity>}/>
)
componentDidMount(){
    this.getalldonations()
}
componentWillUnmount(){
    this.requestref()
}

sentbook = (bookdetails)=>{
    if(bookdetails.requeststatus == "booksent"){
        var requeststatus = "donorintrested"
        db.collection("alldonations").doc(bookdetails.docid).update({
            "requeststatus":"donorinterested"
        })
        this.sendnotification(bookdetails,requeststatus)
    }
    else{
        var requeststatus = "booksent"
        db.collection("allDonations").doc(bookdetails.docid).update({
            "requeststatus":"booksent"
        })
        this.sendnotification(bookdetails,requeststatus)
    }
}

sendnotification = (bookdetails,requeststatus)=>{
    var requestid = bookdetails.requestid
    var donorid = bookdetails.donorid
    db.collection("allnotifications").where("requestid","==",requestid).where("donorid","==",donorid).get().then((snapshot)=>{
        var message=""
        if (requeststatus == "booksent"){
            message = this.state.donorname + "sent you book"
        }
        else {
            message = this.state.donorname + "has shown interest in donating the book"
        }
        db.collection("allnotifications").doc(doc.id).update({
            "mesage":message,
            "notificationstatus":"unread",
            "date":firebase.firestore.FieldValue.serverTimestamp()
        })
    })
}

    render(){
        return(
            <View>
                <myheader navigation = {this.props.navigation}title="mydonations"/>
                <View style={{flex:1}}>
                    {this.state.allDonations.length === 0}?(
                        <View style = {styles.subtitle}>
                            <Text>list of all donations</Text>
                        </View>
                    ):(<FlatList keyExtractor = {this.keyExtractor}data = {this.state.allDonations}renderItem = {this.renderItem}/>)
                </View>
                <Text>my donations</Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({ button:{ width:100, height:30, justifyContent:'center', alignItems:'center', backgroundColor:"#ff5722", shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, elevation : 16 }, subtitle :{ flex:1, fontSize: 20, justifyContent:'center', alignItems:'center' } }) 