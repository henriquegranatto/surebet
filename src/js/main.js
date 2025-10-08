import '../scss/styles.scss'
import * as bootstrap from 'bootstrap'

function saveBudget() {
    const budgetValue = document.querySelector('#saveBudgetValue').value
    
    localStorage.setItem('budget', budgetValue)
}

function savePlataform(plataformName) {
    let id = JSON.parse(localStorage.getItem('plataforms')).length
    let plataforms = JSON.parse(localStorage.getItem('plataforms'));

    id = id > 0 ? id : 1

    plataforms.push({
        id: id,
        name: plataformName
    });

    localStorage.setItem('plataforms', JSON.stringify(plataforms));

    return id
}

function saveTeam() {
    const teamPlataformName = document.querySelector('#savePlataformName').value
    const teamNameA = document.querySelector('#saveTeamNameA').value
    const oddA = document.querySelector('#saveOddA').value
    const teamNameB = document.querySelector('#saveTeamNameB').value
    const oddB = document.querySelector('#saveOddB').value

    let teams = JSON.parse(localStorage.getItem('teams')) || [];
    let id = teams.length  > 0 ? teams.length : 1;

    const plataform = savePlataform(teamPlataformName)

    teams.push({
        id: id,
        type: 1,
        odd: oddA,
        name: teamNameA,
        plataform: plataform,
    });

    id++;

    teams.push({
        id: id,
        type: 2,
        odd: oddB,
        name: teamNameB,
        plataform: plataform,
    });

    localStorage.setItem('teams', JSON.stringify(teams));

    generateCombinations(

    )
    showPlataformsTable()
}

function showPlataformsTable() {
    let tableRows = ''

    document.querySelector('#plataformsTable').innerHTML = ''

    const plataforms = JSON.parse(localStorage.getItem('plataforms')) || []
    const teams = JSON.parse(localStorage.getItem('teams')) || []

    plataforms.forEach(plataform => {
        const teamsForPlataform = teams.filter(t => Number(t.plataform) === Number(plataform.id))
        const teamA = teamsForPlataform.find(t => Number(t.type) === 1) || {}
        const teamB = teamsForPlataform.find(t => Number(t.type) === 2) || {}

        tableRows += `
            <tr>
                <td>${plataform.id}</td>
                <td>${plataform.name}</td>
                <td>${teamA.name || ''}</td>
                <td>${teamA.odd || ''}</td>
                <td>${teamB.name || ''}</td>
                <td>${teamB.odd || ''}</td>
            </tr>
        `
    })

    document.querySelector('#plataformsTable').innerHTML = tableRows
}

function showCombinations(combinations) {
    const tbody = document.querySelector('#combinationsTable')
    if (!tbody) return

    const teams = JSON.parse(localStorage.getItem('teams')) || []
    const plataforms = JSON.parse(localStorage.getItem('plataforms')) || []

    let rows = ''

    combinations.forEach((c, idx) => {
        const teamA = teams.find(t => Number(t.id) === Number(c.teamA)) || {}
        const teamB = teams.find(t => Number(t.id) === Number(c.teamB)) || {}

        const plataformA = (plataforms.find(p => Number(p.id) === Number(c.plataformA)) || {}).name || ''
        const plataformB = (plataforms.find(p => Number(p.id) === Number(c.plataformB)) || {}).name || ''

        const oddA = Number(c.oddA) || 0
        const oddB = Number(c.oddB) || 0

        const surebetValue = calcSurebetValue(oddA, oddB)
        const isArbitrage = isSurebet(surebetValue)
        const margin = calcMarginPercent(surebetValue)
        const stakes = calcStakes(oddA, oddB)

        rows += `
            <tr>
                <td>${idx + 1}</td>
                <td>${plataformA}</td>
                <td>${plataformB}</td>
                <td>${teamA.name || ''}</td>
                <td>${oddA}</td>
                <td>${teamB.name || ''}</td>
                <td>${oddB}</td>
                <td>${surebetValue}</td>
            </tr>
        `
    })

    tbody.innerHTML = rows
}

function generateCombinations() {
    const teams = JSON.parse(localStorage.getItem('teams')) || []

    const type1 = teams.filter(t => Number(t.type) === 1)
    const type2 = teams.filter(t => Number(t.type) === 2)

    const combinations = []

    type1.forEach(t1 => {
        type2.forEach(t2 => {
            combinations.push({
                teamA: t1.id,
                teamB: t2.id,
                oddA: t1.odd,
                oddB: t2.odd,
                plataformA: t1.plataform,
                plataformB: t2.plataform
            })
        })
    })

    localStorage.setItem('combinations', JSON.stringify([]))
    localStorage.setItem('combinations', JSON.stringify(combinations))
    showCombinations(combinations)

    return combinations
}

function calcSurebetValue(oddA, oddB) {
    if (!(oddA > 0) || !(oddB > 0)) return Infinity
    return (1 / oddA) + (1 / oddB)
}

function isSurebet(surebetValue) {
    return surebetValue < 1
}

function calcMarginPercent(surebetValue) {
    if (!isSurebet(surebetValue)) return '0.00'
    return ((1 - surebetValue) * 100).toFixed(2)
}

function calcStakes(oddA, oddB, totalStake = 100) {
    const invA = oddA > 0 ? 1 / oddA : 0
    const invB = oddB > 0 ? 1 / oddB : 0
    const sumInv = invA + invB
    if (sumInv === 0) return { stakeA: 0, stakeB: 0 }

    const stakeA = (totalStake * invA) / sumInv
    const stakeB = (totalStake * invB) / sumInv

    const retA = stakeA * oddA
    const retB = stakeB * oddB

    return {
        stakeA: Number(stakeA.toFixed(2)),
        stakeB: Number(stakeB.toFixed(2)),
        retA: Number(retA.toFixed(2)),
        retB: Number(retB.toFixed(2))
    }
}

localStorage.clear()
localStorage.setItem('budget', 0)
localStorage.setItem('teams', JSON.stringify([]))
localStorage.setItem('plataforms', JSON.stringify([]))
localStorage.setItem('combinations', JSON.stringify([]))

document.querySelector('#saveBudgetBtn').addEventListener('click', saveBudget)
document.querySelector('#savePlataformBtn').addEventListener('click', () => {
    const name = document.querySelector('#savePlataformName') ? document.querySelector('#savePlataformName').value : ''
    if (name) saveTeam(name)
})