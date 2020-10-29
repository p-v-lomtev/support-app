import './style.css';
import { Question } from './question'
import { isValid, createModal } from './utils';
import { authHost, getAuthForm } from './auth';
import Inputmask from "inputmask";

// const modalBtn = document.getElementById('modal-btn');
const form = document.getElementById('form');
const inputName = form.querySelector('#name');
const inputLastName = form.querySelector('#lastName');
const phone = form.querySelector('#phone');
const email = form.querySelector('#mail');
const text = form.querySelector('#question-area');
const submitBtn = form.querySelector('#submit-btn');
const select = form.querySelector('#select')
var im = new Inputmask("+7-999-999-99-99");
im.mask(phone);

window.addEventListener('load', renderTasks)
form.addEventListener('submit', submitFormHandler)
inputName.addEventListener('input', () => {
    submitBtn.disabled = !isValid(inputName.value)
    inputLastName.disabled = !isValid(inputName.value)
})
inputName.addEventListener('input', () => {
    submitBtn.disabled = !isValid(inputName.value)
})
// modalBtn.addEventListener('click', openModal)
document.getElementById('auth-form').addEventListener('submit', authFormHandler)

function submitFormHandler(event) {   
    event.preventDefault()
    
        const question = {
            name: inputName.value.trim(),
            lastName: inputLastName.value.trim(),
            tel: phone.value,
            email: email.value,
            text: text.value.trim(),
            date: new Date().toJSON(),
            selectValue: select.value,
            status: 'new'
        }

        submitBtn.disabled = true
    
        // Async request to server to save question
        Question.create(question).then(() => {
            form.reset()
            document.querySelectorAll('#form .mui--is-not-empty').forEach(n => n.classList.remove('mui--is-not-empty'))
            submitBtn.disabled = false
            renderTasks()
        })
}
 
// function openModal() {
//     createModal('Авторизация', getAuthForm())
//     document.getElementById('auth-form').addEventListener('submit', authFormHandler, {once: true})
// }

function authFormHandler(event) {
    event.preventDefault()
    
    const btn = event.target.querySelector('button')
    const email = event.target.querySelector('#email').value
    const password = event.target.querySelector('#password').value

    authHost(email, password)
    .then(Question.fetch)
    .then(renderModalAfterAuth)
    .then(() => btn.disabled = false)
    .then(() => {
        document.querySelectorAll('#form-auth .mui--is-not-empty').forEach(n => n.classList.remove('mui--is-not-empty'))
    })
}

function renderTasks() {
    const token = JSON.parse(localStorage.getItem('idToken'))

    if (token) {
        const email = token.email     
        const password = token.password
        authHost(email, password)
        .then(Question.fetch)
        .then(renderModalAfterAuth)
    } else {
        document.getElementById('list').innerHTML = '<p style="font-weight: bold"> Если хотите посмотреть как работает сервис, то используйте следующие тестовые данные: <p>Логин: user@mail.ru </p> <p>Пароль: !qerTy3</p></p> '
    }    
}

function renderModalAfterAuth(content) {
    if (typeof content === 'string') {
       createModal('Ошибка', content)
    } else {
        // createModal('Список заявок', Question.listToHtml(content))
        const token = JSON.parse(localStorage.getItem('idToken'))
        if (token) {
            const tasks = content.filter(task => task.email === token.email)
            Question.listToHtml(tasks)
            document.getElementById('auth-form').style.display = 'none'
            document.getElementById('sidebar').innerHTML += `<div id="lk-auth">
            <h2>
            <span>${tasks.length ? tasks[0].name + ' ' + tasks[0].lastName + ',' : ''} </span><br>
            ДОБРО ПОЖАЛОВАТЬ</h2>
            <button class="mui-btn mui-btn--raised mui-btn--danger" id='exit-btn'>ВЫЙТИ ИЗ КАБИНЕТА</button>
            </div>
            `
            document.getElementById('exit-btn').addEventListener('click', (event) => {
                event.preventDefault()
                localStorage.removeItem('idToken')
                renderTasks()
                document.getElementById('lk-auth').style.display = 'none'
              document.getElementById('auth-form').style.display = 'block'
            })
        }   
    }
}