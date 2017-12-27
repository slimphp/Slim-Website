---
title: Ciclo de vida
---

## Ciclo de vida do aplicativo

### 1. Instanciação

Em primeiro lugar, você instancia a classe `\Slim\App`. Este é o objeto da aplicação Slim. Durante a instanciação, o Slim registra os serviços padrão para cada dependência do aplicativo. O construtor de aplicativos aceita uma array de configurações opcional que configura o comportamento do aplicativo.

### 2. Definições da rota

Em segundo lugar, você define rotas usando os métodos de roteamento da instância da aplicação, `get()`, `post()`, `put()`, `delete()`, `patch()`, `head()` e `options()`. Esses métodos de instância registram uma rota com o objeto do roteador do aplicativo. Cada método de roteamento retorna a instância da Rota para que você possa invocar imediatamente os métodos da instância da Rota para adicionar middleware ou atribuir um nome.

### 3. Runner da aplicação

Em terceiro lugar, invoca o método `run()` da instância do aplicativo. Esse método inicia o processo a seguir:

#### A. Digite Middleware Stack

O método `run()` começa a atravessar para dentro da middleware da aplicação. Esta é uma estrutura concêntrica de camadas de middleware que recebem (e, opcionalmente, manipulam) os objetos Environment, Request e Response antes (e depois) que o aplicativo Slim é executado. O aplicativo Slim é a camada mais interna da estrutura do middleware concêntrico. Cada camada de middleware é invocada internamente a partir da camada mais externa.

#### B. Execute a aplicação

Depois que o método `run()` atingir a camada de middleware mais interno, invoca a instância do aplicativo e envia a solicitação HTTP atual para o objeto de rota de aplicativo apropriado. Se uma rota corresponder ao método HTTP e ao URI, o middleware da rota e o chamante são invocados. Se uma rota correspondente não for encontrada, o manipulador não encontrado ou não permitido é invocado.

#### D. Feche Middleware Stack

Após a conclusão do processo de despacho do aplicativo, cada camada de middleware recupera o controle externo, começando pela camada mais interna.

#### E. Envie resposta HTTP

Depois que a camada de middleware mais externa passa o controle, a instância do aplicativo prepara, serializa e retorna a resposta HTTP. Os cabeçalhos de resposta HTTP são configurados com o método `head()` nativo do PHP e o corpo de resposta HTTP é emitido para o buffer de saída atual.
