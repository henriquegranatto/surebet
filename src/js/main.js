import '../scss/styles.scss'
import * as bootstrap from 'bootstrap'

const selectElement = selector => document.querySelector(selector)
const getLocalStorage = key => JSON.parse(localStorage.getItem(key) || '[]')
const setLocalStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value))
const clearInputValues = (...selectors) => selectors.forEach(selector => selectElement(selector).value = '')

function saveBudget() {
  const inputValue = parseFloat(selectElement('#saveBudgetValue').value || 0)
  selectElement('#budget').value = `R$ ${inputValue.toFixed(2)}`
  localStorage.setItem('budget', inputValue)
  clearInputValues('#saveBudgetValue')
}

function savePlatform(platformName) {
  const platforms = getLocalStorage('platforms')
  const id = platforms.length + 1

  platforms.push({ id, name: platformName })
  setLocalStorage('platforms', platforms)

  return id
}

function saveTeam() {
  const [
    platformName,
    teamNameA,
    oddTeamA,
    teamNameB,
    oddTeamB
  ] = [
    '#savePlatformName',
    '#saveTeamNameA',
    '#saveOddA',
    '#saveTeamNameB',
    '#saveOddB'
  ].map(selector => selectElement(selector).value.trim())

  const teams = getLocalStorage('teams')
  const platformId = savePlatform(platformName)
  const baseId = teams.length + 1

  teams.push(
    { id: baseId, type: 1, name: teamNameA, odd: oddTeamA, platform: platformId },
    { id: baseId + 1, type: 2, name: teamNameB, odd: oddTeamB, platform: platformId }
  )

  setLocalStorage('teams', teams)
  generateCombinations()
  showPlatformsTable()
  clearInputValues('#savePlatformName', '#saveTeamNameA', '#saveOddA', '#saveTeamNameB', '#saveOddB')
}

function showPlatformsTable() {
  const platforms = getLocalStorage('platforms')
  const teams = getLocalStorage('teams')

  selectElement('#platformsTable').innerHTML = platforms.map(platform => {
    const [teamA = {}, teamB = {}] = [1, 2].map(type =>
      teams.find(team => team.platform == platform.id && team.type == type)
    )

    return `
      <tr>
        <td>${platform.id}</td>
        <td>${platform.name}</td>
        <td>${teamA.name || ''}</td>
        <td>${teamA.odd || ''}</td>
        <td>${teamB.name || ''}</td>
        <td>${teamB.odd || ''}</td>
      </tr>`
  }).join('')
}

function calculateSurebetValue(oddTeamA, oddTeamB) {
  return (1 / oddTeamA) + (1 / oddTeamB)
}

function showCombinations(combinations) {
  const tableBody = selectElement('#combinationsTable')
  if (!tableBody) return

  const teams = getLocalStorage('teams')
  const platforms = getLocalStorage('platforms')

  tableBody.innerHTML = combinations.map((combination, index) => {
    const teamA = teams.find(team => team.id == combination.teamA) || {}
    const teamB = teams.find(team => team.id == combination.teamB) || {}

    const platformA = platforms.find(p => p.id == combination.platformA)?.name || ''
    const platformB = platforms.find(p => p.id == combination.platformB)?.name || ''

    const oddTeamA = Number(combination.oddA)
    const oddTeamB = Number(combination.oddB)
    const surebetValue = calculateSurebetValue(oddTeamA, oddTeamB).toFixed(4)

    return `
      <tr>
        <td>${index + 1}</td>
        <td>${platformA}</td>
        <td>${teamA.name || ''}</td>
        <td>${oddTeamA}</td>
        <td>${platformB}</td>
        <td>${teamB.name || ''}</td>
        <td>${oddTeamB}</td>
        <td>${surebetValue}</td>
      </tr>`
  }).join('')

  showArbitrages(combinations)
}

function showArbitrages(combinations) {
  const tableBody = selectElement('#arbitragesTable')
  if (!tableBody) return

  const totalBudget = Number(localStorage.getItem('budget') || 0)
  const teams = getLocalStorage('teams')
  const platforms = getLocalStorage('platforms')

  tableBody.innerHTML = combinations.map((combination, index) => {
    const teamA = teams.find(team => team.id == combination.teamA) || {}
    const teamB = teams.find(team => team.id == combination.teamB) || {}

    const platformA = platforms.find(p => p.id == combination.platformA)?.name || ''
    const platformB = platforms.find(p => p.id == combination.platformB)?.name || ''

    const oddTeamA = Number(combination.oddA)
    const oddTeamB = Number(combination.oddB)
    const surebetValue = calculateSurebetValue(oddTeamA, oddTeamB)

    if (surebetValue > 1) return ''

    const betTeamA = ((totalBudget / oddTeamA) / surebetValue).toFixed(2)
    const betTeamB = ((totalBudget / oddTeamB) / surebetValue).toFixed(2)
    const earningsTeamA = (betTeamA * oddTeamA).toFixed(2)
    const earningsTeamB = (betTeamB * oddTeamB).toFixed(2)

    return `
      <tr>
        <td>${index + 1}</td>
        <td>${platformA}</td>
        <td>${teamA.name}</td>
        <td>${oddTeamA}</td>
        <td>R$${betTeamA}</td>
        <td>${platformB}</td>
        <td>${teamB.name}</td>
        <td>${oddTeamB}</td>
        <td>R$${betTeamB}</td>
        <td>${surebetValue.toFixed(4)}</td>
        <td>R$${earningsTeamA} - ${earningsTeamB}</td>
      </tr>`
  }).join('')
}

function generateCombinations() {
  const teams = getLocalStorage('teams')
  const teamsTypeA = teams.filter(team => team.type == 1)
  const teamsTypeB = teams.filter(team => team.type == 2)

  const combinations = teamsTypeA.flatMap(teamA =>
    teamsTypeB.map(teamB => ({
      teamA: teamA.id,
      teamB: teamB.id,
      oddA: teamA.odd,
      oddB: teamB.odd,
      platformA: teamA.platform,
      platformB: teamB.platform
    }))
  )

  setLocalStorage('combinations', combinations)
  showCombinations(combinations)
  return combinations
}

localStorage.clear()
localStorage.setItem('budget', 0)
localStorage.setItem('teams', JSON.stringify([]))
localStorage.setItem('plataforms', JSON.stringify([]))
localStorage.setItem('combinations', JSON.stringify([]))

selectElement('#saveBudgetBtn')?.addEventListener('click', saveBudget)
selectElement('#savePlatformBtn')?.addEventListener('click', () => {
  const name = selectElement('#savePlatformName')?.value?.trim()
  if (name) saveTeam(name)
})
