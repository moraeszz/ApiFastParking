<?php


use App\Core\Model;

class Preco {
  public $id;
  public $valorInicio;
  public $valorHora;
  public $valor;
  public $valorAdicionadoHora;

  
  public function listarTodos(){
    $sql = " SELECT * FROM tbl_preco ";

     $stmt = Model::getConexao()->prepare($sql);
     $stmt->execute();

     if($stmt->rowCount() > 0){
         $resultado = $stmt->fetchAll(\PDO::FETCH_OBJ);

         return $resultado;
     }else{
         return [];
     }
 
  }

  public function insert() {
    $sql = " INSERT INTO tbl_preco 
    (valorInicio, valorHora, valor, valorAdicionalHora)
    VALUES
    (?, ?, ?, ?)";

    $stmt = Model::getConexao()->prepare($sql);
    $stmt->bindValue(1, $this->valorInicio);
    $stmt->bindValue(2, $this->$valorAdicionadoHora);

    if ($stmt->execute()) {
      $this-> id = Model::getConexao()->lastInsertId();
      return $this;
    } else {
      return false;
    }
  }
}
