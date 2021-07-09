<?php

use App\Core\Controller;

class Cliente extends Controller{

    public function index() {
        $clienteModel = $this -> model("Cliente");
        $dados = $clienteModel -> listarTodos();

        echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    }

    public function store() {
        $json = file_get_contents("php://input");
        $novoCliente = $this -> json_decode($json);
        $clienteModel = $this -> model("Cliente");
        $clienteModel = $this -> placa = $novoCliente -> placa;
        $clienteModel = $this -> nome = $novoCliente -> nome;
        $clienteModel = $this -> horaChegada = $novoCliente -> horaChegada;
        $clienteModel = $this -> horaSaida = $novoCliente -> horaSaida;
        $clienteModel = $this -> dataChegada = $novoCliente -> dataChegada;
        $clienteModel = $this -> valor = $novoCliente -> valor;

        $clienteModel = $clienteModel -> inserir();

            if ($clienteModel) {
                http_response_code(201);
                echo json_encode($clienteModel, JSON_UNESCAPED_UNICODE);
            } else {
                http_response_code(500);
                echo json_encode(["ERRO" => "Ocorreu um erro ao inserir o cliente"]);
        }
    }

    public function update($id) {
        $clienteEditar = $this -> getRequestBody();
        $clienteModel = $this -> model ("Cliente");
        $clienteModel = $clienteModel -> findById($id);

            if (!$clienteModel) {
                http_response_code(404);
                echo json_encode(["ERRO" => "Cliente não reconhecido"]);
                exit();
            }

            $clienteModel -> placa = clienteEditar -> placa;
            $clienteModel -> nome = clienteEditar -> nome; 

            if ($clienteEditar -> update()) {
                http_response_code(204);
            }else {
                http_response_code(500);
                echo json_encode(["ERRO" => "Ocorreu um erro ao editar cliente"]);
            }    
    }
}