const plansza = document.getElementById('plansza');
const wynik = document.getElementById('wynik');
const rozpocznijBtn = document.getElementById('rozpocznijBtn');
const wypłataBtn = document.getElementById('wypłataBtn');
const stawkaInput = document.getElementById('stawka');
const liczbaBombInput = document.getElementById('liczbaBomb');
const rozmiarPlanszyInput = document.getElementById('rozmiarPlanszy');
const aktualnaStawka = document.getElementById('aktualnaStawka');

let rozmiarPlanszy = 4;
let liczbaBomb = 3;
let graAktywna = false;
let danePlanszy = [];
let ujawnionePola = 0;
let stawka = 1;
let trafionePola = 0;
let wszystkiePola;
let pozostalePola;

function sprawdzWarunki(stawka, wplacono, rozmiarPlanszy, liczbaBomb){
    if (stawka < 1) {
        alert("Stawka nie może być mniejsza od 1, biedaku.");
        return true;
    }
    if (wplacono > (parseInt(document.cookie.split("; ").find((row) => row.startsWith("chips="))?.split("=")[1]))) {            //refactor this
        alert("Masz za mało żetonów.");
        return true;
    }
    if (rozmiarPlanszy < 2){
        alert("Rozmiar planszy nie może być mniejszy od 2.");
        return true;
    }

    if (liczbaBomb >= rozmiarPlanszy * rozmiarPlanszy) {
        alert("Liczba bomb nie może być większa lub równa liczbie pól!");
        return true;
    }

    if (liczbaBomb < 1) {
        alert("Liczba bomb nie może być mniejsza niż 1!");
        return true;
    }

    return false;
}

function rozpocznijGrę() {
    rozmiarPlanszy = parseInt(rozmiarPlanszyInput.value);
    liczbaBomb = parseInt(liczbaBombInput.value);
    stawka = parseFloat(stawkaInput.value);
    const wplacono = parseFloat(stawkaInput.value);
    
    if (sprawdzWarunki(stawka, wplacono, rozmiarPlanszy, liczbaBomb)) {
        return;
    }

    rozmiarPlanszyInput.disabled = true;
    liczbaBombInput.disabled = true;
    stawkaInput.disabled = true;
    rozpocznijBtn.disabled = true;

    graAktywna = true;
    danePlanszy = [];
    ujawnionePola = 0;
    trafionePola = 0;
    wynik.textContent = `Wpłacono: ${stawka}`;
    aktualnaStawka.textContent = `Stawka: ${stawka}`;
    plansza.innerHTML = '';

    plansza.style.gridTemplateColumns = `repeat(${rozmiarPlanszy}, 60px)`;

    wszystkiePola = rozmiarPlanszy * rozmiarPlanszy;
    pozostalePola = wszystkiePola - liczbaBomb;

    for (let i = 0; i < wszystkiePola; i++) {
        const komorka = document.createElement('div');
        komorka.classList.add('komorka-planszy');
        komorka.dataset.index = i;
        komorka.addEventListener('click', kliknijKomorke);
        plansza.appendChild(komorka);
        danePlanszy.push({
            ujawnione: false,
            jestBomba: false,
        });
    }

    let bombyUstawione = 0;
    while (bombyUstawione < liczbaBomb) {
        let losowyIndex = Math.floor(Math.random() * wszystkiePola);
        if (!danePlanszy[losowyIndex].jestBomba) {
            danePlanszy[losowyIndex].jestBomba = true;
            bombyUstawione++;
        }
    }

    function kliknijKomorke(event) {
        if (!graAktywna) return;

        const index = event.target.dataset.index;
        const komorka = event.target;

        if (danePlanszy[index].ujawnione) return;

        danePlanszy[index].ujawnione = true;
        ujawnionePola++;
        komorka.classList.add('ujawniona');

        if (danePlanszy[index].jestBomba) {
            komorka.classList.add('bomba');
            wynik.textContent = `Game Over! Straciłeś ${wplacono}!`;
            graAktywna = false;
            document.cookie = "chips=" + (parseInt(document.cookie.split("; ").find((row) => row.startsWith("chips="))?.split("=")[1]) - wplacono) + "; SameSite=None; secure; expires=Fri, 20 Aug 2077 12:00:00 UTC; path=/";
            updateUserInfo();
            ujawnijWszystkieKomorki();
        } else {
            komorka.classList.add('pusta', 'flip-horizontal-bottom');
            trafionePola++;
            const mnoznik = 1 + ((trafionePola * 1.8) / pozostalePola);
            stawka = Math.round(parseFloat(stawkaInput.value) * mnoznik);
            aktualnaStawka.textContent = `Stawka: ${stawka} (Pomnożona o ${mnoznik.toFixed(2)} razy)`;
        }

        if (ujawnionePola === pozostalePola) {
            wynik.textContent = `Gratulacje! Wygrałeś ${stawka}!`;
            graAktywna = false;
            document.cookie = "chips=" + (parseInt(document.cookie.split("; ").find((row) => row.startsWith("chips="))?.split("=")[1]) + stawka - wplacono) + "; SameSite=None; secure; expires=Fri, 20 Aug 2077 12:00:00 UTC; path=/";
            updateUserInfo();
            ujawnijWszystkieKomorki();
        }
    }
}

function ujawnijWszystkieKomorki() {
    rozmiarPlanszyInput.disabled = false;
    liczbaBombInput.disabled = false;
    stawkaInput.disabled = false;
    rozpocznijBtn.disabled = false;
    danePlanszy.forEach((komorkaData, index) => {
        const komorka = plansza.children[index];
        if (!komorkaData.ujawnione) {
            komorka.classList.add('ujawniona');
            if (komorkaData.jestBomba) {
                komorka.classList.add('bomba');
            }
        }
    });
}

function wyplac() {
    const wplacono = parseFloat(stawkaInput.value);

    if (graAktywna) {
        graAktywna = false;
        wynik.textContent = `Wypłacono! Otrzymałeś ${stawka} żetonów.`;
        document.cookie = "chips=" + (parseInt(document.cookie.split("; ").find((row) => row.startsWith("chips="))?.split("=")[1]) + stawka - wplacono) + "; SameSite=None; secure; expires=Fri, 20 Aug 2077 12:00:00 UTC; path=/";
        updateUserInfo();
        ujawnijWszystkieKomorki();
    }
}

rozpocznijBtn.addEventListener('click', rozpocznijGrę);
wypłataBtn.addEventListener('click', wyplac);