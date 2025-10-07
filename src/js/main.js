import '../scss/styles.scss'
import * as bootstrap from 'bootstrap'

function saveBudget() {
    const budgetValue = document.querySelector('#saveBudgetValue').value
    
    localStorage.setItem('budget', budgetValue)
}

function savePlataform() {
    const id = JSON.parse(localStorage.getItem('plataforms')).length
    const plataformName = document.querySelector('#savePlataformName').value

    let plataforms = JSON.parse(localStorage.getItem('plataforms'));

    plataforms.push({
        id: id > 0 ? id : 1,
        name: plataformName
    });

    localStorage.setItem('plataforms', JSON.stringify(plataforms));

    showPlataformsTable()
}

function saveTeam() {
    const teamPlataform = document.querySelector('#saveTeamPlataform').value
    const teamNameA = document.querySelector('#saveTeamNameA').value
    const oddA = document.querySelector('#saveOddA').value
    const teamNameB = document.querySelector('#saveTeamNameB').value
    const oddB = document.querySelector('#saveOddB').value

    let teams = JSON.parse(localStorage.getItem('teams')) || [];
    let id = teams.length  > 0 ? teams.length : 1;

    teams.push({
        id: id,
        plataform: teamPlataform,
        name: teamNameA,
        odd: oddA
    });

    id++;

    teams.push({
        id: id,
        plataform: teamPlataform,
        name: teamNameB,
        odd: oddB
    });

    localStorage.setItem('teams', JSON.stringify(teams));

    showTeamsTable()
}

function showPlataformsTable() {
    let tableRows = ''

    document.querySelector('#plataformsTable').innerHTML = ''

    localStorage.setItem('teams', JSON.stringify(
        JSON.parse(
            localStorage.getItem('plataforms')).forEach(plataform => {
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
            }
        )
    ))

    document.querySelector('#plataformsTable').innerHTML = tableRows
}

function showTeamsTable() {
    let tableRows = ''

    document.querySelector('#teamsTable').innerHTML = ''

    JSON.parse(localStorage.getItem('teams')).forEach(team => {
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
localStorage.setItem('teams', JSON.stringify([]))
localStorage.setItem('plataforms', JSON.stringify([]))
localStorage.setItem('combinations', JSON.stringify([]))

document.querySelector('#saveTeamBtn').addEventListener('click', saveTeam)
document.querySelector('#saveBudgetBtn').addEventListener('click', saveBudget)
document.querySelector('#savePlataformBtn').addEventListener('click', savePlataform)