import './style.css';
import { Question } from './question'
import { isValid, createModal } from './utils';
import { authHost, getAuthForm } from './auth';

const modalBtn = document.getElementById('modal-btn');
const form = document.getElementById('form');
const inputName = form.querySelector('#name');
const inputLastName = form.querySelector('#lastName');
const phone = form.querySelector('#phone');
const text = form.querySelector('#question-area');
const submitBtn = form.querySelector('#submit-btn');
const select = form.querySelector('#select')

window.addEventListener('load', Question.renderList)
form.addEventListener('submit', submitFormHandler)
inputName.addEventListener('input', () => {
    submitBtn.disabled = !isValid(inputName.value)
    inputLastName.disabled = !isValid(inputName.value)
})
inputName.addEventListener('input', () => {
    submitBtn.disabled = !isValid(inputName.value)
})
modalBtn.addEventListener('click', openModal)

function submitFormHandler(event) {   
    event.preventDefault()
    
        const question = {
            name: inputName.value.trim(),
            lastName: inputLastName.value.trim(),
            tel: phone.value,
            text: text.value.trim(),
            date: new Date().toJSON(),
            selectValue: select.value,
            status: 'new'
        }

        submitBtn.disabled = true
    
        // Async request to server to save question
        Question.create(question).then(() => {
            form.reset()
            submitBtn.disabled = false
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
}

function renderModalAfterAuth(content) {
    if (typeof content === 'string') {
       createModal('Ошибка', content)
    } else {
        createModal('Список заявок', Question.listToHtml(content))
    }
}