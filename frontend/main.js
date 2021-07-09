'use strict';

const date = new Date();
const dateTime = {
    'day': date.getDate(),
    'mounth': date.getMonth() + 1,
    'year': date.getFullYear(),
    'hours': date.getHours(),
    'minutes': date.getMinutes()
}

const openModalPrecos = () => document.querySelector('#modal-Precos').classList.add('active');
const closeModalPrecos = () => document.querySelector('#modal-Precos').classList.remove('active');

const openModalReceipt = () => document.querySelector('#modal-receipt').classList.add('active');
const closeModalReceipt = () => document.querySelector('#modal-receipt').classList.remove('active');

const openModalExit = () => document.querySelector('#modal-exit').classList.add('active');
const closeModalExit = () => document.querySelector('#modal-exit').classList.remove('active');

const openModalEdit = () => document.querySelector('#modal-edit').classList.add('active');
const closeModalEdit = () => document.querySelector('#modal-edit').classList.remove('active');

const readDBFastParking = () => JSON.parse(localStorage.getItem('dbFastParking')) ?? [];
const setDBFastParking = (dbFastParking) => localStorage.setItem('dbFastParking', JSON.stringify(dbFastParking));

const readDBPrecos = () => JSON.parse(localStorage.getItem('precos')) ?? [];
const setDBPrecos = (dbPrecos) => localStorage.setItem('precos', JSON.stringify(dbPrecos));

const insertIntoDBFastParking = (car) => {
    const dbFastParking = readDBFastParking();
    dbFastParking.push(car);
    setDBFastParking(dbFastParking);
}

const insertIntoDBPrecos = (precos) => {
    const dbPrecos = readDBPrecos()
    dbPrecos.push(precos)
    setDBPrecos(dbPrecos)
}

const getDateNow = () => {
    const dateNow = dateTime['mounth'] > 9 ?
        dateTime['day'] + '/' + dateTime['mounth'] + '/' + dateTime['year']
        :
        dateTime['day'] + '/0' + dateTime['mounth'] + '/' + dateTime['year'];

    return dateNow;
}

const getHoursNow = () => {
    const timeNow = dateTime['hours'] + ':' + dateTime['minutes'];

    return timeNow;
}

const clearTable = () => {
    const recordCar = document.querySelector('#tableCars tbody');
    while (recordCar.firstChild) {
        recordCar.removeChild(recordCar.lastChild);
    }
}

const clearInputs = () => {
    const inputs = Array.from(document.querySelectorAll('input'));
    inputs.forEach(input => input.value = "");
}


const createRow = (car, index) => {
    const tableCars = document.querySelector('#tableCars tbody')
    const newTr = document.createElement('tr');
    

    newTr.innerHTML = `
        <td>${car.nome}</td>
        <td>${car.placa}</td>
        <td>${car.data}</td>
        <td>${car.hora}</td>
        <td>
            <button data-index="${index}" id="button-receipt" class="button green" type="button">Comp.</button>
            <button data-index="${index}" id="button-edit" class="button blue" type="button">Editar</button>
            <button data-index="${index}" id="button-exit" class="button red" type="button">Saída</button>
        </td>`;

    tableCars.appendChild(newTr);
}


const updateTable = () => {
    clearTable()
    const dbFastParking = readDBFastParking();
    dbFastParking.forEach(createRow)
}

const isValidFormRegister = () => document.querySelector('#form-register').reportValidity();

const saveCar = () => {
    if (isValidFormRegister()) {
        const newCar = {
            nome: document.querySelector('#nome').value,
            placa: document.querySelector('#placa').value,
            data: getDateNow(),
            hora: getHoursNow()
        }
        insertIntoDBFastParking(newCar);
        clearInputs();
        updateTable();
    }
}

const isValidFormPrecos = () => document.querySelector('#form-precos').reportValidity();


const savePrecos = () => {
    if (isValidFormPrecos()) {
        const newPrecos = {
            primeiraHora: document.querySelector('#primeira-hora').value,
            demaisHoras: document.querySelector('#demais-horas').value
        }
        insertIntoDBPrecos(newPrecos);
        clearInputs();
        closeModalPrecos();
    }
}

const isValidFormEdit = () => document.querySelector('#form-edit').reportValidity();

const saveCarEdited = () => {
    if (isValidFormEdit()) {
        const newCar = {
            nome: document.querySelector('#nome-edited').value,
            placa: document.querySelector('#placa-edited').value,
            data: document.querySelector('#data').value,
            hora: document.querySelector('#hora').value
        }

        insertIntoDBFastParking(newCar);
        clearInputs();
        closeModalEdit();
        updateTable();
    }
}

const calcExit = (index) => {

    const dbFastParking = readDBFastParking();
    const dbPrecos = readDBPrecos();
    const lastIndex = dbPrecos.length - 1;

    const valueOfFirsteHours = dbPrecos[lastIndex]["primeiraHora"];
    const valueOfMoreHours = dbPrecos[lastIndex]["demaisHoras"];

    const entryTime = dbFastParking[index].hora.substr(0, 2);
    let exitTime = getHoursNow().substr(0, 2);
    let valueOfBePay = 0

    if (exitTime == '0:') {
        exitTime = 24;
        let totalHoursParked = parseInt(entryTime) - parseInt(exitTime);
        if (totalHoursParked < 0) {
            totalHoursParked *= -1;
        }
        if (totalHoursParked > 1) {

            const moreHours = totalHoursParked - 1;
            const valueOfBePayMoreHours = moreHours * valueOfMoreHours;
            const valueOfBePay = parseInt(valueOfBePayMoreHours) + parseInt(valueOfFirsteHours);
            console.log(valueOfBePay);

        } else {
            valueOfBePay = valueOfFirsteHours;
        }

    } else {

        let totalHoursParked = parseInt(entryTime) - parseInt(exitTime);
        if (totalHoursParked < 0) {

            totalHoursParked *= -1;
        }
        if (totalHoursParked > 1) {

            const moreHours = totalHoursParked - 1;
            const valueOfBePayMoreHours = moreHours * valueOfMoreHours;
            valueOfBePay = parseInt(valueOfBePayMoreHours) + parseInt(valueOfFirsteHours);
        } else {

            valueOfBePay = valueOfFirsteHours;
   
        }
    
    }
    return valueOfBePay;
}


const deleteCar = (index) => {
    const dbFastParking = readDBFastParking()
    const resp = confirm(`Ao confirmar os dado de ${dbFastParking[index].nome} serão apagados`);

    if (resp) {
        dbFastParking.splice(index, 1)
        setDBFastParking(dbFastParking);
        updateTable();
    }
}

const setReceipt = (index) => {
    const dbFastParking = readDBFastParking();
    const input = Array.from(document.querySelectorAll('#form-receipt input'));
    input[0].value = dbFastParking[index].nome;
    input[1].value = dbFastParking[index].placa;
    input[2].value = dbFastParking[index].data;
    input[3].value = dbFastParking[index].hora;
}

const editarCarro = (index) => {
    const dbFastParking = readDBFastParking()
    const resp = confirm(`Ao confirmar os dado de ${dbFastParking[index].nome} serão editados`);

    if (resp) {
        dbFastParking.splice(index, 1)
        setDBFastParking(dbFastParking);
        updateTable();
    }
}

const setExit = (index) => {

    const dbFastParking = readDBFastParking();
    const input = Array.from(document.querySelectorAll('#form-exit input'));
    input[0].value = dbFastParking[index].nome;
    input[1].value = dbFastParking[index].placa;
    input[2].value = dbFastParking[index].hora;
    input[3].value = getHoursNow();
    input[4].value = calcExit(index);
    deleteCar(index);

}

const editCar = (index) => {

    const dbFastParking= readDBFastParking();
    document.querySelector('#nome-edited').value = dbFastParking[index].nome;
    document.querySelector('#placa-edited').value = dbFastParking[index].placa;
    document.querySelector('#data').value = dbFastParking[index].data;
    document.querySelector('#hora').value = dbFastParking[index].hora;
    editarCarro(index);
}

const getButtons = (event) => {

    const button = event.target;
    if (button.id == "button-receipt") {

        const index = button.dataset.index;
        openModalReceipt();
        setReceipt(index);
    } else if (button.id == "button-exit") {

        const index = button.dataset.index;
        openModalExit();
        setExit(index);
    } else if (button.id == "button-edit") {

        const index = button.dataset.index;
        openModalEdit();
        editCar(index);
    }

}

const printRecipt = () => {
    window.print();
}

document.querySelector('#precos').addEventListener('click', () => { openModalPrecos(); clearInputs() });
document.querySelector('#close-precos').addEventListener('click', () => { closeModalPrecos(); clearInputs() });
document.querySelector('#cancelar-precos').addEventListener('click', () => { closeModalPrecos(); clearInputs() });

document.querySelector('#tableCars').addEventListener('click', getButtons);

document.querySelector('#close-receipt').addEventListener('click', () => { closeModalReceipt(); clearInputs() });
document.querySelector('#cancelar-receipt').addEventListener('click', () => { closeModalReceipt(); clearInputs() });

document.querySelector('#close-exit').addEventListener('click', () => { closeModalExit(); clearInputs() });
document.querySelector('#cancelar-exit').addEventListener('click', () => { closeModalExit(); clearInputs() });

document.querySelector('#close-edit').addEventListener('click', () => { closeModalEdit(); clearInputs() });
document.querySelector('#cancelar-edit').addEventListener('click', () => { closeModalEdit(); clearInputs() });

document.querySelector('#salvar').addEventListener('click', saveCar);

document.querySelector('#salvarPreco').addEventListener('click', savePrecos);

document.querySelector('#editar').addEventListener('click', saveCarEdited);

document.querySelector('#imprimir-receipt').addEventListener('click', printRecipt)
document.querySelector('#imprimir-exit').addEventListener('click', printRecipt)
updateTable();