# SkinHub

Plataforma para troca e venda de skins e itens em games, conectando jogadores de forma fácil e segura.

## Visão Geral

SkinHub é uma aplicação projetada para facilitar a troca e venda de skins e itens entre jogadores de diversos jogos online. A plataforma oferece:

- Interface intuitiva para navegação e busca de itens.
- Sistema seguro para autenticação de usuários.
- Documentação detalhada de API para integração com outros sistemas.

## Recursos Principais

- Cadastro e autenticação de usuários.
- Listagem e pesquisa de itens.
- Filtro por nome de jogo.
- Ordenação dinâmica de listas.
- Documentação da API utilizando Swagger.

## Tecnologias Utilizadas

- **Backend:** Node.js, Express.
- **Documentação:** Swagger.
- **Controle de Versão:** Git.
- **Persistência de Dados:** Arquivos JSON.

## Configuração do Projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/SkinHub.git
   cd SkinHub
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente no arquivo `.env` (consulte o exemplo abaixo):
   ```env
    PORT=3000
    JWT_SECRET=ioherywfgio3wuyerugy
    GAME_FILE_PATH=../../data/game.json
    ITEM_FILE_PATH=../../data/item.json
    USER_FILE_PATH=../../data/user.json
   ```

4. Inicie o servidor:
   ```bash
   npm start
   ```

O servidor será iniciado em [http://localhost:3000](http://localhost:3000).

## Instruções de Uso

1. Acesse a aplicação através do navegador em [http://localhost:3000](http://localhost:3000).
2. Navegue pelos itens, utilize os filtros e ordenações conforme necessário.
3. Utilize a documentação da API para integrações (veja abaixo).

## Documentação da API

A documentação completa da API pode ser acessada em [http://localhost:3000/docs](http://localhost:3000/docs).

### Endpoints Principais

- **GET /items/get-all-items**: Retorna a lista de itens.
- **GET /items/items/by-game-name/:gameName**: Busca de items utilizando filtros (regra de negócio implementada).
- **GET /games/get-all-games**: Retorna a lista de games.
- **POST /users/register**: Cadastra um novo usuário.
- **POST /users/login**: Faz login do usuário.

### Endpoints Principais dependentes de login

#### Routes Itens

- **GET /items/post-new-item**: Adiciona um novo item.
- **GET /items/update-item/:id**: Atualiza um item existente pelo id (somente o usuário que criou o item).
- **GET /items/delete-item/:id**: Deleta um item existente pelo id (somente o usuário que criou o item).

#### Routes Games

- **GET /games/post-new-game**: Adiciona um novo game (somente adiministrador).
- **POST /games/update-game/:id**: Atualiza um game existente pelo id (somente adiministrador).
- **POST /games/delete-game/:id**: Deleta um game existente pelo id, deletendo seus itens relacionados (somente adiministrador).

#### Routes Users

- **POST /users/create-admin**: Cadastra um novo adiministrador (somente adiministrador).
- **POST /users/delete-user/:id**: Faz login do usuário (somente adiministrador poderá excluir qualquer usuário).
- **POST /users/updateUser/:id**: Cadastra um novo usuário (somente adiministrador poderá atualizar qualquer usuário).
- **POST /users/profile**: Faz login do usuário.
- **POST /users/all-profiles**: Faz login do usuário (somente adiministrador).

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).