// Plays revealable effect to game cards.

let animation = {
    revealDistance: 60,
    initialOpacity: 0,
    transitionDelay: 0,
    transitionDuration: '1.5s',
    transitionProperty: 'all',
    transitionTimingFunction: 'ease'
  }
  
const windowHeight = window.innerHeight;
    
const reveal = () => {
    if (animationBool == true) {
        let revealableContainers = document.querySelectorAll(".revealable");
        for (let i = 0; i < revealableContainers.length; i++) {
            let topOfRevealableContainer = revealableContainers[i].getBoundingClientRect().top;
            if (topOfRevealableContainer < windowHeight - animation.revealDistance) {
                // add the active class to the revealableContainer's classlist
                revealableContainers[i].classList.add("active");
            } else {
                // remove the active class to the revealableContainer's classlist
                revealableContainers[i].classList.remove("active");
            }
        }
    }
}

const revealImmediately = () => {
    let revealableContainers = document.querySelectorAll(".revealable");
    for (let i = 0; i < revealableContainers.length; i++) {
        revealableContainers[i].classList.add("active");
    }        
}
  
  window.addEventListener('scroll', reveal);

//Toggle Animations

let animationBool = true;

const toggleAnimationBtn = document.getElementById('toggle-animations-btn');

toggleAnimationBtn.addEventListener('click', () => {
    revealImmediately();
    animationBool = !animationBool;

    if (animationBool) {
        toggleAnimationBtn.style.color = "#89FAA0";
    }else {
        toggleAnimationBtn.style.color = "#FA9E89";
    }

});


// Function to search Game
const input = document.getElementById("search-input");

function searchGame() {    
    deleteChildElements(gamesContainer);

    let filter = input.value.toUpperCase();

    // use filter() to get a list of games that matches the user's search
    const filteredGames = GAMES_JSON.filter ( (GAMES_JSON) => {
        let gameName = GAMES_JSON.name.toUpperCase();
        
        return gameName.includes(filter);
    });

    const storedBool = animationBool;
    animationBool = false;
    addGamesToPage(filteredGames);
    animationBool = storedBool;
        
}
  
input.addEventListener("keyup", searchGame);


import games from './games.js';
/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
    // loop over each item in the data
    for (let i = 0; i < games.length; i++) {
        
        // create a new div element, which will become the game card
        const gameCard = document.createElement("div");
        
        // add the class game-card to the list
        gameCard.classList.add("game-card");

        // add class for revealable effect
        if (animationBool == true) {
            gameCard.classList.add("revealable");
        }   

        // set the inner HTML using a template literal to display some info 
        // about each game        
        gameCard.innerHTML = `
            <img class = "game-img" src="${games[i].img}" />

            <div class = "game-card-info">
                <h3>${games[i].name}</h3>
                <p>${games[i].description}</p>
                <div class = "game-card-stats">
                    <h4>Pledged: $${games[i].pledged} / Goal: $${games[i].goal}</h4>
                    <h4> Number of Backers: ${games[i].backers}</h4>
                </div>
            </div>
        `;

        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")

        // append the game to the games-container
        gamesContainer.appendChild(gameCard);
    }
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games

addGamesToPage(GAMES_JSON);


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalIndvContributions = GAMES_JSON.reduce( (acc, GAMES_JSON) => {
    return acc + GAMES_JSON.backers;
}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `${totalIndvContributions.toLocaleString('en-US')}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const amountRaised = GAMES_JSON.reduce( (acc, GAMES_JSON) => {
    return acc + GAMES_JSON.pledged;
}, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `${amountRaised.toLocaleString('en-US')}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");

const numGames = GAMES_JSON.reduce( (acc, GAMES_JSON) => {
    return acc + 1;
}, 0);

gamesCard.innerHTML = `${numGames.toLocaleString('en-US')}`;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    const unfundedGames = GAMES_JSON.filter ( (GAMES_JSON) => {
        return GAMES_JSON.pledged < GAMES_JSON.goal;
    });

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedGames);
    reveal();
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    const fundedGames = GAMES_JSON.filter ( (GAMES_JSON) => {
        return GAMES_JSON.pledged >= GAMES_JSON.goal;
    });

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedGames);
    reveal();
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
    reveal();

}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener('click', filterUnfundedOnly);
fundedBtn.addEventListener('click', filterFundedOnly);
allBtn.addEventListener('click', showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const unfundedGames = GAMES_JSON.filter ( (GAMES_JSON) => {
    return GAMES_JSON.pledged < GAMES_JSON.goal;
});
const numUnfundedGames = unfundedGames.length;

// create a string that explains the number of unfunded games using the ternary operator

const displayStr = `
    A total of ${amountRaised.toLocaleString('en-US')} has been raised for ${numGames.toLocaleString('en-US')}
    ${(numGames == 1) ? "game" : "games"}. Currently, ${numUnfundedGames.toLocaleString('en-US')} 
    ${(numUnfundedGames == 1) ? "game" : "games"} remains unfunded. We need your help to fund these amazing games!
`;

// create a new DOM element containing the template string and append it to the description container
const description = document.createElement("p");
description.innerHTML = displayStr;
descriptionContainer.appendChild(description);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [{name: firstName}, {name: secondName}, ...rest] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
const firstGame = document.createElement("h3");
firstGame.innerHTML = `${firstName}`;
firstGameContainer.appendChild(firstGame);

// do the same for the runner up item
const secondGame = document.createElement("h3");
secondGame.innerHTML = `${secondName}`;
secondGameContainer.appendChild(secondGame);





