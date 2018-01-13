# Teste Frontend - CVC
## Por Paulo Geremias

Este repositório foi criado com o intuito de armazenar o teste para a vaga de frontend da CVC.

## Dependências

 - AngularJS (Animate, Aria, Material, Messages e Resource) - https://angularjs.org/
 - Express* - http://expressjs.com/pt-br/
 - Gulp (Concat, if, minify, sass, sourcemaps, spritesmith, ng-annotate) - https://gulpjs.com/
 - Node.JS - http://nodejs.org
 - NPM - https://www.npmjs.com/

\* O Express foi utilizado apenas para auxilio em servir os arquivos estáticos da pasta 'public' através do Node.JS

## Preview

O projeto pode ser pré-visualizado através da seguinte URL: https://paulowd.github.io/teste-cvc/

## Provisionamento

Após baixar o repositório, instale as dependência via npm:

    npm install

Em seguida, rode é necessário buildar os arquivos fontes através do Gulp. Para isso rode o seguinte comando.

    gulp build

Com o projeto devidamente buildado, o próximo passo é subir uma instância de um servidor Node.js para que o mesmo sirva os arquivos estáticos buildados. As configurações já estão feitas no projeto, portanto basta digitar:

    npm start

Pronto! O projeto está pronto foi provisionado, para acessar a página basta acessar http://localhost:3000 no navegador.

## Observações

 - Devido a uma incompatibilidade entre plataformas de plugins de otimização de imagem, as imagens usadas foram otimizadas através do TinyPNG
