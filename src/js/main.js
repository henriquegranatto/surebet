import '../scss/styles.scss'
import * as bootstrap from 'bootstrap'

function saveBudget() {
    const budgetValue = document.querySelector('#saveBudgetValue').value
    
    localStorage.setItem('budget', budgetValue)
}

function savePlataform() {
    const id = localStorage.getItem('plataforms').length
    const plataformName = document.querySelector('#savePlataformName').value
    
    localStorage.getItem('plataforms').push({
        id: id,
        name: plataformName
    })

    showPlataformsTable()
}

function saveTeam() {
    const teamPlataform = document.querySelector('#saveTeamPlataform').value
    const teamNameA = document.querySelector('#saveTeamNameA').value
    const oddA = document.querySelector('#saveOddA').value
    const teamNameB = document.querySelector('#saveTeamNameB').value
    const oddB = document.querySelector('#saveOddB').value

    let id = localStorage.getItem('plataforms').length

    localStorage.getItem('teams').push({
        id: id,
        plataform: teamPlataform,
        name: teamNameA,
        odd: oddA
    })

    id = localStorage.getItem('plataforms').length

    localStorage.getItem('teams').push({
        id: id,
        plataform: teamPlataform,
        name: teamNameB,
        odd: oddB
    })

    showTeamsTable()
}

function showPlataformsTable() {
    let tableRows = ''

    document.querySelector('#plataformsTable').innerHTML = ''

    localStorage.getItem('plataforms').forEach(plataform => {
        tableRows += `
            <tr>
                <td>${plataform.id}</td>
                <td>${plataform.name}</td>
                <td>
                    <button type="button" class="btn btn-primary" onclick="editPlataform(${plataform.id})">Editar</button>
                    <button type="button" class="btn btn-primary" onclick="deletePlataform(${plataform.id})">Deletar</button>
                </td>
            </tr>
        `    
    });

    document.querySelector('#plataformsTable').innerHTML = tableRows
}

function showTeamsTable() {
    let tableRows = ''

    document.querySelector('#plataformsTable').innerHTML = ''

    localStorage.getItem('teams').forEach(team => {
        tableRows += `
            <tr>
                <td>${team.id}</td>
                <td>${localStorage.getItem('plataforms')[team.plataform].name}</td>
                <td>${team.name}</td>
                <td>${team.odd}</td>
                <td>
                    <button type="button" class="btn btn-primary" onclick="editPlataform(${team.id})">Editar</button>
                    <button type="button" class="btn btn-primary" onclick="deletePlataform(${team.id})">Deletar</button>
                </td>
            </tr>
        `    
    });

    document.querySelector('#plataformsTable').innerHTML = tableRows
}

localStorage.clear()
localStorage.setItem('budget', 0)
localStorage.setItem('teams', [])
localStorage.setItem('plataforms', [])
localStorage.setItem('combinations', [])

document.querySelector('#saveBudgetBtn').addEventListener('click', saveBudget)
document.querySelector('#savePlataformBtn').addEventListener('click', savePlataform)
document.querySelector('#saveTeamBtn').addEventListener('click', saveTeam)