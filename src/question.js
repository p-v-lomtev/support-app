export class Question {
    static create(question) {
        return fetch('https://support-app-ef94d.firebaseio.com/questions.json', {
            method: 'POST',
            body: JSON.stringify(question),
            headers: {
                'Content-Type': 'application/json'
            }
        })
         .then(response => response.json())
         .then(res => {
                question.id = res.name
                return question
            })
         .then(Question.renderList)
    }

    static fetch(token) {
        if (!token) {
            return Promise.resolve('<p class="error">У вас нет разрешений на просмотр данных</p>')
        }
        return fetch(`https://support-app-ef94d.firebaseio.com/questions.json?auth=${token}`)
            .then(response => response.json())
            .then(response => {
                if (response && response.error) {
                    return `<p class="error">${response.error}</p>`
                }
                
                return response ? Object.keys(response).map(key => ({
                    ...response[key],
                    id: key
                })) : []
        })
    }
    
    static listToHtml(questions) {
        // const questions = getQuestionFromLocalStorage()
        const html = questions.length
            ? questions.map(toCard).join('')
            : `<div class="mui--text-headline">Вы пока не создавали заявок</div>`
        const list = document.getElementById('list')
        list.innerHTML = `<div class="mui--text-white mui--text-display1 mui--align-vertical">Ваши заявки</div>
        <br><br>
        ${html}
        `
    }

    // static listToHtml(questions) {
    //     return questions.length
    //         ? `<ul>${questions.map(q => `<li>${q.text}</li>`).join('')}</ul>`
    //         : '<p>Заявок пока нет</p>'
    // }
}

// function addToLocalStorage(question) {
//     const all = getQuestionFromLocalStorage()
//     all.push(question)
//     localStorage.setItem('questions', JSON.stringify(all))
// }

// function getQuestionFromLocalStorage() {
//     return JSON.parse(localStorage.getItem('questions') || '[]')
// }

function toCard(question) {
    return `
    <div class="task">
    <div class="mui--text-black-54">
    <span class="status">${question.status}</span>
    <span class="task_time">
    ${new Date(question.date).toLocaleDateString()}
    ${new Date(question.date).toLocaleTimeString()}
    </span>
    <span class="select">${question.selectValue}</span>
    </div>
    <div class="text_task">${question.text}</div>
    </div>
    `
}