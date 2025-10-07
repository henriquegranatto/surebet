import '../scss/styles.scss'
import * as bootstrap from 'bootstrap'

localStorage.clear()
localStorage.setItem('budget', 0)
localStorage.setItem('teams', [])
localStorage.setItem('plataforms', [])
localStorage.setItem('combinations', [])

function saveBudget() {
    const budgetValue = document.querySelector('#saveBudgetValue')
    
    localStorage.setItem('budget', budgetValue)
}

function savePlataform() {
    const id = localStorage.getItem('plataforms').length
    const plataformName = document.querySelector('#savePlataformName')
    
    localStorage.getItem('plataforms').push({
        id: id,
        name: plataformName
    })
}

function saveTeam() {
    const teamPlataform = document.querySelector('#saveTeamPlataform')
    const teamNameA = document.querySelector('#saveTeamNameA')
    const oddA = document.querySelector('#saveOddA')
    const teamNameB = document.querySelector('#saveTeamNameB')
    const oddB = document.querySelector('#saveOddB')

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
}

function showPlataformsTable() {
    let tableRows = ''

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

    document.querySelector('#plataformsTable').innerHTML = $tableRows
}

function showTeamsTable() {
    let tableRows = ''

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

    document.querySelector('#plataformsTable').innerHTML = $tableRows
}