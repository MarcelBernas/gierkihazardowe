let newX = 0, newY = 0, startX = 0, startY = 0;
let activeElement;

let returnTopValue;
let returnLeftValue;

if (document.cookie.split("; ").find((row) => row.startsWith("username="))?.split("=")[1] === undefined) {
    document.cookie = "username=" + window.prompt('Witaj w strefie hazardu! Proszę podać nazwę użytkownika.') + "; SameSite=None; secure; expires=Fri, 20 Aug 2077 12:00:00 UTC; path=/";
}
if (document.cookie.split("; ").find((row) => row.startsWith("chips="))?.split("=")[1] === undefined) {
    document.cookie = "chips=1000; SameSite=None; secure; expires=Fri, 20 Aug 2077 12:00:00 UTC; path=/";
}
function updateUserInfo() {
    document.getElementById('user-name').innerText = document.cookie.split("; ").find((row) => row.startsWith("username="))?.split("=")[1];
    document.getElementById('token_count').innerText = document.cookie.split("; ").find((row) => row.startsWith("chips="))?.split("=")[1];
}
function redirectToHome() {
    window.location.href = 'index.html';
}
function editUserName() {
    const userNameSpan = document.getElementById('user-name');
    const editNameTextarea = document.getElementById('edit-name');

    userNameSpan.style.display = 'none';
    editNameTextarea.style.display = 'block';
    editNameTextarea.value = userNameSpan.innerText;
    editNameTextarea.focus();

    editNameTextarea.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();


            userNameSpan.innerText = editNameTextarea.value.trim() || 'nazwa użytkownika';
            userNameSpan.style.display = 'block';
            editNameTextarea.style.display = 'none';
            document.cookie = "username=" + editNameTextarea.value + "; SameSite=None; secure; expires=Fri, 20 Aug 2077 12:00:00 UTC; path=/";
        }
    });
}

function addListener(element) {
    element.addEventListener('mousedown', mouseDown);
}

function mouseDown(e) {
    if (!isRouletteSpinning) {
        startX = e.clientX;
        startY = e.clientY;

        returnLeftValue = e.target.style.left;
        returnTopValue = e.target.style.top;

        activeElement = e.target;

        document.addEventListener('mousemove', mouseMove)
        document.addEventListener('mouseup', mouseUp)
    }
}

function mouseMove(e) {
    newX = startX - e.clientX;
    newY = startY - e.clientY;

    startX = e.clientX;
    startY = e.clientY;

    activeElement.style.top = (activeElement.offsetTop - newY) + 'px';
    activeElement.style.left = (activeElement.offsetLeft - newX) + 'px';
}

function mouseUp(e) {
    document.removeEventListener('mousemove', mouseMove);

    if (activeElement != undefined) {
        if (!isRouletteSpinning) {
            let elementsUnderCursor = document.elementsFromPoint(e.clientX, e.clientY);
            if (elementsUnderCursor.length > 0) {
                for (let i in elementsUnderCursor) {
                    if (parseInt(elementsUnderCursor[i].id) >= 0) {
                        updateBet(parseInt(activeElement.id.match(/\d+/g)), elementsUnderCursor[i].id);
                    } else if (["r1", "r2", "r3", "black", "red", "even", "odd"].includes(elementsUnderCursor[i].id)) {
                        updateBet(parseInt(activeElement.id.match(/\d+/g)), elementsUnderCursor[i].id);
                    }
                }
            }
        }

        activeElement.style.top = returnTopValue;
        activeElement.style.left = returnLeftValue;

        activeElement = undefined;
    }
}

function updateBet(chip, betName) {
    if (parseInt(activeElement.id.match(/\d+/g)) > localTokens) {
        window.alert("Nie masz wystarczającej ilości żetonów!");
        return;
    }
    if (bets.find(x => x.name === betName) != undefined) {
        bets.find(x => x.name === betName).bet += chip;
        document.getElementById(betName).getElementsByTagName('span')[0].innerText = "Zakład: " + bets.find(x => x.name === betName).bet;
    } else {
        bets.push({ name: betName, bet: chip });
        document.getElementById(betName).getElementsByTagName('span')[0].innerText = "Zakład: " + chip;
    }
    totalbet += chip;
    localTokens -= chip;
    document.getElementById("current_bet").innerText = "Obecna suma zakładów: " + totalbet + ".";
}

function resetBet() {
    if (!isRouletteSpinning) {
        for (let x of bets) {
            document.getElementById(x.name).getElementsByTagName('span')[0].innerText = "Zakład: 0";
        }
        localTokens = document.cookie.split("; ").find((row) => row.startsWith("chips="))?.split("=")[1];
        totalbet = 0;
        bets = [];
        document.getElementById("current_bet").innerText = "Obecna suma zakładów: " + totalbet + ".";
    }
}

function startRoulette() {
    if (isRouletteSpinning == false && totalbet > 0) {
        isRouletteSpinning = true;
        rouletteStrip.style.transition='none';

        rouletteStrip.style.transform='translateX(0px)';
        void rouletteStrip.offsetWidth;

        const boxWidth = 96;
        const visibleWidth = 960;
        const totalLength = numbers.length * 5;
        const randomIndex = Math.floor(Math.random() * numbers.length);

        // Docelowa pozycja przesunięcia (środek ekranu)
        const targetPosition = -(randomIndex * boxWidth + (totalLength - numbers.length) * boxWidth / 2) + (visibleWidth / 2 - boxWidth / 2);

        // Ustawienie animacji
        rouletteStrip.style.transition = 'transform 4s ease-in-out';
        rouletteStrip.style.transform = `translateX(${targetPosition}px)`;

        // Po zakończeniu animacji
        rouletteStrip.addEventListener('transitionend', function stopAtPosition() {
            // Po zakończeniu animacji, nie resetujemy pozycji, tylko zatrzymujemy na wylosowanej liczbie
            rouletteStrip.style.transition = 'none'; // Wyłączamy animację na czas "stania" ruletki
            rouletteStrip.style.transform = `translateX(${targetPosition}px)`; // Ustawiamy pozycję na tej samej

            const result = numbers[randomIndex]; // Numer pod strzałką
            resultDisplay.textContent = `Wylosowano: ${result}`;

            // Sprawdzenie wyniku
            let winnings = 0;
            for (let object of bets) {
                if (object.name == result) {
                    winnings += object.bet * 36;
                }
            }

            if ([32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18, 7, 12, 3].includes(result) && bets.find(x => x.name == 'red') != undefined) {
                winnings += bets.find(x => x.name == 'red').bet * 2;
            }
            if ([15, 4, 2, 17, 6, 13, 11, 8, 10, 24, 33, 20, 31, 22, 29, 28, 35, 26].includes(result) && bets.find(x => x.name == 'black') != undefined) {
                winnings += bets.find(x => x.name == 'black').bet * 2;
            }

            if ([1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34].includes(result) && bets.find(x => x.name == 'r1') != undefined) {
                winnings += bets.find(x => x.name == 'r1').bet * 3;
            }
            if ([2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35].includes(result) && bets.find(x => x.name == 'r2') != undefined) {
                winnings += bets.find(x => x.name == 'r2').bet * 3;
            }
            if ([3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36].includes(result) && bets.find(x => x.name == 'r3') != undefined) {
                winnings += bets.find(x => x.name == 'r3').bet * 3;
            }

            if ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].includes(result) && bets.find(x => x.name == '1-12') != undefined) {
                winnings += bets.find(x => x.name == '1-12').bet * 3;
            }
            if ([13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].includes(result) && bets.find(x => x.name == '13-24') != undefined) {
                winnings += bets.find(x => x.name == '13-24').bet * 3;
            }
            if ([25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36].includes(result) && bets.find(x => x.name == '25-36') != undefined) {
                winnings += bets.find(x => x.name == '25-36').bet * 3;
            }

            if (result % 2 == 0 && bets.find(x => x.name == 'even') != undefined) {
                winnings += bets.find(x => x.name == 'even').bet * 2;
            }
            if (result % 2 == 1 && bets.find(x => x.name == 'odd') != undefined) {
                winnings += bets.find(x => x.name == 'odd').bet * 2;
            }

            if ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].includes(result) && bets.find(x => x.name == '1-18') != undefined) {
                winnings += bets.find(x => x.name == '1-18').bet * 2;
            }
            if ([19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36].includes(result) && bets.find(x => x.name == '19-36') != undefined) {
                winnings += bets.find(x => x.name == '19-36').bet * 2;
            }

            console.log('Wygrana: ' + winnings);
            // Aktualizacja salda
            document.cookie = "chips=" + (localTokens + winnings) + "; SameSite=None; secure; expires=Fri, 20 Aug 2077 12:00:00 UTC; path=/";
            if(winnings>0){
                window.alert('Wygrałeś '+(winnings-totalbet)+' żetonów!');
            }else{
                window.alert('Straciłeś '+totalbet+'.');
            }
            isRouletteSpinning = false;
            updateUserInfo();
            resetBet();
            rouletteStrip.removeEventListener('transitionend', stopAtPosition); // Usunięcie event listenera

            if (document.cookie.split("; ").find((row) => row.startsWith("chips="))?.split("=")[1] < 1) {
                window.alert("Nie masz już żadnych żetonów. Wciśnij 'OK', żeby zresetować swoje postępy.");
                document.cookie = "chips=1000; SameSite=None; secure; expires=Fri, 20 Aug 2077 12:00:00 UTC; path=/";
                location.reload();
            }
        });
    }
}
