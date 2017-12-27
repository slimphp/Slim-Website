---
title: Fazendo upload de arquivos usando formulários POST
---

Os arquivos que são enviados usando os formulários nas solicitações POST podem 
ser recuperados com o método [`getUploadedFiles`] (/docs/objects/request.html#uploaded-files) 
do objeto` Request`.

Ao fazer o upload de arquivos usando uma solicitação POST, verifique se o formulário de 
upload do arquivo possui o atributo `enctype ="multipart/form-data"` caso contrário 
`getUploadedFiles()` retornará uma array vazio.

Se vários arquivos forem carregados para o mesmo nome de entrada, adicione colchetes 
após o nome de entrada no HTML, caso contrário, apenas um arquivo enviado será retornado 
para o nome de entrada por `getUploadedFiles()`.

Abaixo está um exemplo de formulário HTML que contém os uploads de arquivos únicos e múltiplos.

<figure markdown="1">
```php
<!-- Certifique-se de que o atributo enctype esteja configurado para multipart / form-data -->
<form method="post" enctype="multipart/form-data">
    <!-- upload de um único arquivo -->
    <p>
        <label>Add file (single): </label><br/>
        <input type="file" name="example1"/>
    </p>

    <!-- vários campos de entrada para o mesmo nome de entrada, use colchetes -->
    <p>
        <label>Add files (up to 2): </label><br/>
        <input type="file" name="example2[]"/><br/>
        <input type="file" name="example2[]"/>
    </p>

    <!-- um campo de entrada de arquivo que permite que vários arquivos sejam carregados, use colchetes -->
    <p>
        <label>Add files (multiple): </label><br/>
        <input type="file" name="example3[]" multiple="multiple"/>
    </p>

    <p>
        <input type="submit"/>
    </p>
</form>
```
<figcaption>Figura 1: Exemplo de formulário HTML para uploads de arquivos</figcaption>
</figure>

Os arquivos carregados podem ser movidos para um diretório usando o método `moveTo`. Abaixo 
está um exemplo de aplicativo que lida com os arquivos carregados do formulário HTML acima.

<figure markdown="1">
```php
<?php

require_once __DIR__ . '/vendor/autoload.php';

use Slim\Http\Request;
use Slim\Http\Response;
use Slim\Http\UploadedFile;

$app = new \Slim\App();

$container = $app->getContainer();
$container['upload_directory'] = __DIR__ . '/uploads';

$app->post('/', function(Request $request, Response $response) {
    $directory = $this->get('upload_directory');

    $uploadedFiles = $request->getUploadedFiles();

    // lida com entrada única com upload de arquivo único
    $uploadedFile = $uploadedFiles['example1'];
    if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
        $filename = moveUploadedFile($directory, $uploadedFile);
        $response->write('uploaded ' . $filename . '<br/>');
    }


    // lida com várias entradas com a mesma tecla
    foreach ($uploadedFiles['example2'] as $uploadedFile) {
        if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
            $filename = moveUploadedFile($directory, $uploadedFile);
            $response->write('uploaded ' . $filename . '<br/>');
        }
    }

    // lidar com entrada única com vários carregamentos de arquivos
    foreach ($uploadedFiles['example3'] as $uploadedFile) {
        if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
            $filename = moveUploadedFile($directory, $uploadedFile);
            $response->write('uploaded ' . $filename . '<br/>');
        }
    }

    // lidar com entrada única com vários carregamentos de arquivos
    foreach ($uploadedFiles['example3'] as $uploadedFile) {
        if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
            $filename = moveUploadedFile($directory, $uploadedFile);
            $response->write('uploaded ' . $filename . '<br/>');
        }
    }
});

/**
  * Move o arquivo carregado para o diretório de upload e atribui-lhe um nome exclusivo
  * para evitar substituir um arquivo carregado existente.
  *
  * @param string $directory diretório para o qual o arquivo é movido
  * @param UploadedFile $uploaded file uploaded file to move
  * @return string filename do arquivo movido
  */
function moveUploadedFile($directory, UploadedFile $uploadedFile)
{
    $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
    $basename = bin2hex(random_bytes(8)); // veja http://php.net/manual/en/function.random-bytes.php
    $filename = sprintf('%s.%0.8s', $basename, $extension);

    $uploadedFile->moveTo($directory . DIRECTORY_SEPARATOR . $filename);

    return $filename;
}

$app->run();
```
<figcaption>Figura 2: Exemplo de aplicação Slim para lidar com os arquivos carregados</figcaption>
</figure>

Veja também
--------
* [https://akrabat.com/psr-7-file-uploads-in-slim-3/](https://akrabat.com/psr-7-file-uploads-in-slim-3/)