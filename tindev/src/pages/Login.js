import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, StyleSheet, Image, Text, TextInput, TouchableOpacity } from 'react-native';

/* OBS:
  View = div e Text = qualquer tag de texto html,
  todas as tags precisam de estilo próprio
*/
import logo from '../assets/logo.png';
import api from '../services/api';

export default function Login({navigation}) {
  const [user, setUser ] = useState('');

  useEffect(()=>{
    AsyncStorage.getItem('user').then(user => {
      // se user ñ estiver vazio(ter logado), navegar direto para pag main
      if(user){
        navigation.navigate('Main',{user})
      }
    })
  }, []);

  async function handleLogin(){

    const response = await api.post('/devs', {username: user});

    const {_id} = response.data;

    await AsyncStorage.setItem('user', _id);

    navigation.navigate('Main', {user:_id});
  }

  return (
    <View style={styles.container} >
        <Image style={styles.logotipo} source={logo}/>
        <TextInput style={styles.input} 
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Digite seu usuário do GitHub"
          placeholderTextColor="#999"
          value={user}
          onChangeText={setUser}
        />

        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}> Entrar </Text>  
        </TouchableOpacity>

    </View>
      
  );
}

const styles  = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection:'column',  (default no react-native)
    backgroundColor: '#f5f5f5',
    // alinha verticalmente
    justifyContent:'center',
    // alinha horizontalmente
    alignItems: 'center',
    padding:30
  },
  
  logotipo:{
    // ajustado tamanho da caixa da imagem
    width:200,
    // ajustando imagem dentro da caixa
    resizeMode:'contain'
  },

  input:{
    height: 46 ,
    alignSelf:'stretch',
    backgroundColor:'#fff',
    borderWidth:1,
    borderColor:'#ddd',
    borderRadius:4,
    marginTop:20,
    paddingHorizontal: 15
  },

  button:{
    height: 46,
    alignSelf:'stretch',
    backgroundColor:'#df4723',
    borderRadius:4,
    marginTop:10,
    justifyContent:'center',
    alignItems:'center'

  },

  buttonText:{
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }

});
