*** Projeto desenvolvido no curso da semana omnistack da RockSeat.

Esta aplicação consome a API pública do github para puxar os dados dos perfis do usuários cadastrados.
Projeto é dívidido em 3 partes: 
* back-end   -> Feito em nodeJS, consumindo API do github e armazenando no mongoDB.
* front-end  -> É a versão WEB do sistema feito com React.
* tindev     -> É a versão mobile, feito com React-native. 

Foi utilizado também para comunicação via protocolo webSocket entre as 3 partes a lib socket.io e socket.io-client.


OBS: Para rodar a aplicação, deve executar o comando npm install na raiz de cada uma das 3 parte do projeto, depois de instalar as dependências deve se confirgurar o banco mongoDB no  backend/src/server.js inserindo string na função mongoose.connect('*');

(: Agora para correr as aplicações execute nas raízes > npm start  
