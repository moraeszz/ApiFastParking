<?php

use App\Core\Model;

class Cliente{

    public $id;
    public $nome;
    public $valor;
    public $dataChegada;
    public $placa;
    public $horaChegada;
    public $horaSaída;

    public function listarTodas(){

        $sql = " SELECT * FROM tbl_cliente ";

        $stmt = Model::getConexao()->prepare($sql);
        $stmt->execute();

        if($stmt->rowCount() > 0){
            $resultado = $stmt->fetchAll(PDO::FETCH_OBJ);

            return $resultado;
        }else{
            return [];
        }
    }

    public function inserir(){
        $sql = " INSERT INTO tbl_cliente 
                (nome, valor, dataChegada, placa, horaChegada, horaSaida)
                VALUES
                (?, ?, ?, ?, ?, ?)";

        $stmt = Model::getConexao()->prepare($sql);
        $stmt->bindValue(1, $this->nome);
        $stmt->bindValue(2, $this->placa);   
        $stmt->bindValue(2, $this->horaChegada); 
        $stmt->bindValue(2, $this->dataChegada); 

        if ($stmt->execute()) {
            $this->id = Model::getConexao()->lastInsertId();
            return $this;
        } else {

            return false;
        }
    }       

    public function atualizar() {

        if (!empty($this->nome)) {
            $sql = " UPDATE tbl_cliente SET
            nome = ?, placa = ? WHERE id = ? ";
            $stmt = Model::getConn()->prepare($sql);
            $stmt->bindValue(1, $this->nome);
            $stmt->bindValue(2, $this->placa);
            $stmt->bindValue(3, $this->id);
        }else {
            $sql = " UPDATE tbl_cliente SET dataChegada = current_date(), horaSaida = curtime() where id = ? ";
            $stmt = Model::getConn()->prepare($sql);
            $stmt->bindValue(2, $this->id);
        }

        return $stmt->execute();
    }
}
 