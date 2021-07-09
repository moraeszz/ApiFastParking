create database dbApiEstacionamento;

use dbApiEstacionamento;

create table tbl_preco(
	id int primary key auto_increment not null,
    valorInicio double not null,
    valorHora double not null,
    valor double not null,
    valorAdicionalHora double,
    unique key(id)
);

create table tbl_cliente(
	id int primary key auto_increment not null,
    nome varchar(255) not null,
    valor decimal,
    dataChegada date not null,
    placa varchar(15) not null,
    horaChegada datetime not null,
    horaSaida datetime not null,
    unique key(id)
);    