'use strict'
const loginContainer = document.getElementById('login-container')

const moveOverlay = () => loginContainer.classList.toggle('move')

document.getElementById('open-register').addEventListener('click', moveOverlay)

document.getElementById('open-login').addEventListener('click', moveOverlay)

const formulario = document.querySelector("form")
const Inome = document.querySelector(".nome")
const Iemail = document.querySelector(".email")
const Isenha = document.querySelector(".senha")


function cadastrar(){
    fetch("https://localhost:8080/cadastrar",
        {
            headers:{
                'Accept': 'application.json',
                'Content-Type': 'application/json'
            },
            method: "post",
            body: JSON.stringify({
                nome: Inome.value,
                email: Iemail.value,
                senha: Isenha.value
            })
        })
        .then(function(res){console.log(res)})
        .catch(function(res){console.log(res)})



};

function limpar (){
    Inome.value = "";
    Iemail.value = "";
    Isenha.value = "";
};


formulario.addEventListener('submit', function(event){
    event.preventDefault();
    
    cadastrar();
    limpar();
});