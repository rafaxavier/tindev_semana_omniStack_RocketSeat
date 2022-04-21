import React, { useEffect, useState} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, SafeAreaView ,Image, Text, StyleSheet, TouchableOpacity, LogBox } from "react-native";
import io from 'socket.io-client';
// ignorar box de warning
LogBox.ignoreAllLogs();

import api from "../services/api";
import logo from '../assets/logo.png';
import itsamatch from '../assets/itsamatch.png';


export default function Main({navigation}) {
  //pega o id do usuario logado passado como parametro no navigate
  const id =  navigation.getParam('user');

  const [users, setUsers] = useState([]);
  const [devMatch, setDevMatch] = useState(null);
    
    /* useEffect, sempre que o val de id for alterado será 
    chamado a func loadUser para carregar os devs*/
    useEffect(()=> {
        async function loadUsers(){
            const response = await api.get('/devs', {
                headers:{
                    user: id
                }
            })
            setUsers(response.data);
        }
        //chamada da func
        loadUsers();
    }, [id]);

    // abrindo conexão com webSocket
    useEffect(()=> {
      // const socket = io('http://localhost:3333',{
        const socket = io('http://192.168.0.103:3333', {
          query: { user: id }
        });

      socket.on('match', dev =>{
        setDevMatch(dev);
        // console.log(dev);
      });  

    }, [id]);

    async function handleDislike(){
      const [user , ...restante] = users;
      
        api.post(`/devs/${user._id}/dislikes`, null, {
            headers: { user: id }
        });
        //altera o estado da var users atraves do setUsers
        setUsers(restante);
        console.log('dislike',user._id);
    }

    async function handleLike(){
      const [user , ...restante] = users;

        api.post(`/devs/${user._id}/likes`, null, {
            headers: { user: id }
        });
        setUsers(restante);
        console.log('like',user._id);
    }

    async function handleLogout(){
      await AsyncStorage.clear();
      navigation.navigate('Login'); 
    }

    return (
      // SafeAreaView para usar só parte usável da tela do ios
      <SafeAreaView style={styles.container} >
        <TouchableOpacity onPress={handleLogout}>
          <Image style={styles.logo} source={logo} />
        </TouchableOpacity>
        
        <View style={styles.cardsContainer} >
          {
            users.length === 0 
            ? <Text style={styles.empty}> Acabou :( </Text>
            : (
                users.map( (user, index) => (
                  <View key={user._id} style={[styles.card, {zIndex: users.length - index }] }>
                    <Image style={styles.avatar} source={{ uri: user.avatar}} />
                    <View style={styles.footer}>
                      <Text style={styles.name} >{user.name}</Text>
                      <Text style={styles.bio}  numberOfLines={3} > {user.bio} </Text>
                    </View>
                  </View>)
                ))
          }
        </View>

        {/* botões like/dislike */}
        {
          users.length > 0 && (
            <View style={styles.btns}  > 
              <TouchableOpacity onPress={handleDislike} style={styles.btn} >
                <Image style={styles.btnImg} source={{uri:'https://img.icons8.com/fluency/48/000000/multiply.png'}} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLike} style={styles.btn}>
                <Image style={styles.btnImg} source={{uri:'https://img.icons8.com/color/48/000000/filled-like.png'}} />
              </TouchableOpacity> 
            </View>
          )
        }

        {
          devMatch && (
          <View style={styles.containerMatch} >
            <Image style={styles.itsamatch} source={itsamatch}/>
            <Image style={styles.devMatchAvatar} source={{uri:devMatch.avatar}}/>
            <Text style={styles.devMatchName} >{devMatch.name}</Text>
            <Text style={styles.devMatchBio} >{devMatch.bio}</Text>
            <TouchableOpacity onPress={()=>setDevMatch(null)}>
              <Text style={styles.devMatchName}>Fechar</Text>
            </TouchableOpacity>
          </View>)
        }
      </SafeAreaView>
        
    );
  }

const styles=  StyleSheet.create({
  logo:{
    marginTop:30,
    width: 150,
    resizeMode:'contain'
  },
  
  empty:{
    alignSelf:'center',
    color:'#999',
    fontSize:24,
    fontWeight:'bold'
  },

  container:{
    flex:1,
    backgroundColor: '#f5f5f5',
    alignItems:'center',
    justifyContent:'space-between'
  },

  cardsContainer:{
    flex:1,
    alignSelf:'stretch',
    justifyContent:'center',
    maxHeight:500,
  },

  card:{
    borderWidth:1,
    borderColor:'#DDD',
    borderRadius:8,
    margin:30,
    overflow:'hidden',
    position:'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0
  },

  avatar:{
    flex:1,
    height:300
  },

  footer:{
    backgroundColor:'#fff',
    paddingHorizontal:20,
    paddingVertical:15
  },

  name:{
    fontSize:16,
    fontWeight:'bold',
    color:'#333'
  },

  bio:{
    fontSize:14,
    color:'#999',
    marginTop:5,
    lineHeight:18  
  },

  btns:{
    flexDirection:'row',
    justifyContent:'space-around',
    marginBottom:30,
  },

  btn:{
    width: 60,
    height:60,
    resizeMode:'contain',
    borderRadius:30,
    backgroundColor:'#fff',
    justifyContent:'center',
    alignItems:'center',
    marginHorizontal:20,
    elevation:2,
    shadowColor:'#000',
    shadowOpacity:0.05,
    shadowRadius:2,
    shadowOffset:{
      width:0,
      height:2
    }
  },
  btnImg:{
    width: 40,
    height:40,
    resizeMode:'contain',
  },

  containerMatch:{
    ...StyleSheet.absoluteFillObject,
    backgroundColor:'rgba(0,0,0,0.8)',
    position:'absolute',
    alignItems:'center',
    justifyContent:'center'
  },
  itsamatch:{
    width: 250,
    resizeMode:'contain',
  },
  devMatchAvatar:{
    width: 200,
    height:200,
    borderWidth: 5,
    borderRadius: 100,
    borderColor:'#fff'

  },

  devMatchName:{
    marginTop:15,
    fontSize:24,
    fontWeight:'bold',
    color:'#fff'
  },

  devMatchBio:{
    textAlign:'center',
    width:250,
    marginTop:5,
    fontSize:14,
    color:'rgba(255,255,255, 0.8)'
  }

});