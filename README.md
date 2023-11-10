# Tattoo Service Node.js

Este é um projeto de um sistema de gerenciamento para estúdios de tatuagem feito com NodeJS. Este documento contém informações sobre como o projeto foi elaborado, as dependências necessárias e uma breve explicação sobre cada arquivo presente na estrutura do sistema.

## Estrutura do Sistema

O sistema é organizado da seguinte forma:

- **models**: Contém os modelos de dados do sistema, cada arquivo representa uma tabela do banco de dados.

  - `db.js`: Arquivo de definição do banco de dados utilizando o Sequelize.
  - `Administrador.js`: Modelo para administradores do sistema.
  - `Cliente.js`: Modelo para clientes do estúdio de tatuagem.
  - `Colaborador.js`: Modelo para colaboradores do estúdio.
  - `Material.js`: Modelo para os materiais usados nas tatuagens.
  - `Procedimento.js`: Modelo para os procedimentos de tatuagem.
  - `Tatuador.js`: Modelo para os tatuadores do estúdio.
  - `Usuario.js`: Modelo para usuários genéricos do sistema.

- **public**: Pasta para arquivos públicos do sistema, como folhas de estilo (css), imagens (img) e scripts JavaScript (js).

- **views**: Contém as views HTML do sistema.

  - **layouts**: Layouts comuns para as páginas do sistema.
    - `main.handlebars`: Layout principal usado como base para as outras páginas.

  - `novo-colaborador.handlebars`: Página para cadastro de colaboradores.
  - `login.handlebars`: Página de login do sistema.

- `app.js`: Arquivo principal da aplicação Node.js, contém a configuração do servidor e as rotas.

- `package.json` e `package-lock.json`: Arquivos de configuração do projeto, contêm informações sobre as dependências e scripts para execução.

## Dependências

As dependências necessárias para este projeto estão listadas no arquivo `package.json`. Para instalá-las, siga os passos abaixo:

1. Certifique-se de que você tem o Node.js instalado em seu sistema. Caso contrário, você pode baixá-lo em [nodejs.org](https://nodejs.org/).

2. Abra o terminal na pasta raiz do projeto (`tattoo-service-nodejs`).

3. Execute o seguinte comando para instalar as dependências:

   ```bash
   npm install
   ```

Isso instalará todas as dependências listadas no arquivo `package.json`, incluindo:

- `bcrypt`: Biblioteca para criptografia de senhas.
- `body-parser`: Middleware para análise de solicitações HTTP.
- `express`: Framework web para Node.js.
- `express-handlebars`: Engine de modelo para renderizar páginas HTML.
- `handlebars`: Sistema de templates para o Express.
- `mysql2`: Driver MySQL para o Sequelize.
- `nodemon`: Ferramenta de desenvolvimento que reinicia automaticamente o servidor após mudanças no código.
- `sequelize`: ORM (Object-Relational Mapping) para interagir com o banco de dados.

## Executando o Projeto

Após a instalação das dependências, você deve ligar o XAMPP ou outro servidor MySQL para que as tabelas possam ser geradas automaticamente.

Você pode executar o projeto com o seguinte comando:

```bash
node app.js
```

Para criar Colaborador e Usuario padrão, utilizar o seguinte comando:

```bash
node models/post.js
```

Após estes passos será possível iniciar novamente a aplicação com "node app.js" e utilizar o sistema com usuário e senha padrão. (admin: 123)

Este comando iniciará o servidor e criará um usuário padrão, você poderá acessar a aplicação no navegador em [http://localhost:8080](http://localhost:8080).

## Passo a Passo da Contrução do Projeto

1. **Inicie um novo projeto Node.js:**

   Abra um terminal e navegue até a pasta onde você deseja criar o projeto. Execute o seguinte comando para iniciar um novo projeto Node.js e criar um arquivo `package.json`:

   ```bash
   npm init -y
   ```

2. **Instale o Express:**

   O Express.js é um framework web para Node.js. Ele é uma das principais dependências para a construção de aplicativos web. Execute o seguinte comando para instalá-lo e adicioná-lo ao `package.json`:

   ```bash
   npm install express --save
   ```

3. **Instale o Express Handlebars:**

   O Express Handlebars é uma engine de modelo que permite renderizar páginas HTML facilmente. Execute o seguinte comando para instalá-lo e adicioná-lo ao `package.json`:

   ```bash
   npm install express-handlebars --save
   ```

4. **Instale o Body Parser:**

   O Body Parser é um middleware que permite analisar o corpo das solicitações HTTP. É útil para processar dados de formulários. Execute o seguinte comando para instalá-lo e adicioná-lo ao `package.json`:

   ```bash
   npm install body-parser --save
   ```

5. **Instale o Sequelize:**

   O Sequelize é um ORM (Object-Relational Mapping) que facilita a interação com bancos de dados relacionais, como o MySQL. Execute o seguinte comando para instalá-lo e adicioná-lo ao `package.json`:

   ```bash
   npm install sequelize --save
   ```

6. **Instale o MySQL2:**

   O MySQL2 é um driver MySQL para o Sequelize. Ele permite que o Sequelize se comunique com o banco de dados MySQL. Execute o seguinte comando para instalá-lo e adicioná-lo ao `package.json`:

   ```bash
   npm install mysql2 --save
   ```

7. **Instale o Bcrypt:**

   O Bcrypt é uma biblioteca que ajuda a criptografar senhas para armazenamento seguro no banco de dados. Execute o seguinte comando para instalá-lo e adicioná-lo ao `package.json`:

   ```bash
   npm install bcrypt --save
   ```

8. **Instale o Nodemon:**

   O Nodemon é uma ferramenta que reinicia automaticamente o servidor sempre que você faz alterações no código, facilitando o desenvolvimento. É opcional, mas altamente recomendado para um fluxo de trabalho de desenvolvimento mais suave. Execute o seguinte comando para instalá-lo globalmente e adicionar ao `package.json`:

   ```bash
   npm install -g nodemon --save
   ```

9. **Crie a estrutura do projeto:**

   Agora você pode criar a estrutura de pastas e arquivos para o seu projeto, conforme descrito anteriormente.


10. **Altere as informações de conexão:**

   Depois de seguir esses passos, todas as dependências necessárias serão instaladas e adicionadas automaticamente ao arquivo `package.json` com suas versões correspondentes. Certifique-se de configurar corretamente o banco de dados usando o Sequelize e iniciar o desenvolvimento do aplicativo.

## Conclusão

Este é um guia básico para começar a trabalhar com o projeto Tattoo Service Node.js. Você pode expandir e personalizar o sistema de acordo com as necessidades do seu estúdio de tatuagem.
