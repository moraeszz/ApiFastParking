<?php

use App\Core\Controller;

class Preco extends Controller {

    public function index() {
        $precoModel = $this -> model("Preco");
        $dados = $precoModel -> listarTodos();

        echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    }

    public function store() {
        $json = file_get_contents("php://input");
        $novoPreco = $this -> json_decode($json);
        $precoModel = $this -> model("Preco");
        $precoModel = $this -> valorInicio = $novoPreco -> valorInicio;
        $precoModel = $this -> valorHora = $novoPreco -> valorHora;
        $precoModel = $this -> valor = $novoPreco -> valor;
        $precoModel = $this -> valorAdicionalHora = $novoPreco -> valorAdicionalHora;

        $precoModel = $precoModel -> inserir();

            if ($precoModel) {
                http_response_code(201);
                echo json_encode($precoModel, JSON_UNESCAPED_UNICODE);
            } else {
                http_response_code(500);
                echo json_encode(["ERRO" => "Ocorreu um erro ao inserir o cliente"]);
        }
    }

    public function update($id) {
        $precoEditar = $this -> getRequestBody();
        $precoModel = $this -> model ("Preco");
        $precoModel = $precoModel -> findById($id);

            if (!$precoModel) {
                http_response_code(404);
                echo json_encode(["ERRO" => "Preco não reconhecido"]);
                exit();
            }

            $precoModel -> valorInicio = precoEditar -> valorInicio;
            $precoModel -> valorHora = precoEditar -> valorHora; 
            $precoModel -> valor = precoEditar -> valor; 
            $precoModel -> valorAdicionalHora = precoEditar -> valorAdicionalHora; 

            if ($precoEditar -> update()) {
                http_response_code(204);
            }else {
                http_response_code(500);
                echo json_encode(["ERRO" => "Ocorreu um erro ao editar cliente"]);
            }    
    }
}