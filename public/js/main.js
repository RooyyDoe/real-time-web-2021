import * as utils from './utils/utils.mjs'

const socket = io()

const infoElement = document.getElementById('user-info')
const userInfo = {
    username: infoElement.getAttribute('user-name'),
    gym: infoElement.getAttribute('gym-name'),
    gender: infoElement.getAttribute('gender'),
}

socket.on('return-search-results', (pokemonInfo) => {
    const pokemonName = document.getElementById('pokemon-name')
    const pokemonImage = document.getElementById('pokemon-image')
    const pokemonHealth = document.getElementById('health')
    const pokemonType = document.getElementById('type')
    const pokemonWeight = document.getElementById('weight')
    const healthBar = document.getElementById('health-output')
    const lobby = document.querySelector('.lobby-container-leftside')
    const battle = document.querySelector('.container-leftside-battle')
    const startButton = document.querySelector('.start-button')
    
    pokemonHealth.innerText = pokemonInfo.health
    pokemonType.innerText = pokemonInfo.type
    pokemonWeight.innerText = pokemonInfo.weight
    pokemonName.innerText = pokemonInfo.name
    pokemonImage.src = pokemonInfo.sprites.display
    healthBar.value = pokemonInfo.health
    healthBar.max = pokemonInfo.health

    const newUserData = {
        username: userInfo.username,
        gym: userInfo.gym,
        gender: userInfo.gender,
        pokemon: {
            name: pokemonInfo.name,
            type: pokemonInfo.type,
            health: pokemonInfo.health,
        }
    }

    startButton.addEventListener('click', (event) => {
        event.preventDefault();

        lobby.classList.add('fade-out')
        battle.classList.add('fade-in')

        socket.emit('battle', newUserData)
    });
})

// const renderTurnMessage = (playerOneTurn) => {
//     if (playerOneTurn) {
//         document.querySelector(".battle-message").textContent = "Your opponent's turn";
//         document.querySelector(".attack-button").disabled = true
//     } else {
//         document.querySelector(".battle-message").textContent = "Your turn";
//         document.querySelector(".attack-button").removeAttribute("disabled")
//     }
// }

const attackButton = document.querySelector('.attack-button')

attackButton.addEventListener('click', (event) => {
    event.preventDefault()
    utils.clearMessages()
    socket.emit('attack', userInfo)
})

const search_bar = document.getElementById('search')
const search_button = document.getElementById('search-button')

search_button.addEventListener("click", () => {
    socket.emit('search-results', search_bar.value)
})

socket.emit('join-lobby', userInfo)

// get gym and users

socket.on('gym-users', users => utils.userList(users, userInfo.username))

socket.on('notification', notification => {
    utils.appendLobbyMessage(notification)  
    // utils.fadeAndRemoveMessage()
})

socket.on('message', message => {
    // if(message) {
    //     document.querySelector(".battle-message").textContent = message;
    // }
    utils.appendGameMessage(message)  
    // utils.clearMessages()
})



socket.on('game-starts', (health)=> {
    // const battleContainer = document.querySelector('.battle-container')
    console.log('test', health)

    document.querySelector(".start-button").disabled = true
})

socket.on('game-over', () => {
    utils.clearMessages()
    document.querySelector(".attack-button").disabled = true

    // setTimeout(() => {
    //     window.location.href = '/'
    // }, 5000);
})

