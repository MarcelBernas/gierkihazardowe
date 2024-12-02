const kolumna1 = document.getElementById("kolumna1");
const kolumna2 = document.getElementById("kolumna2");
const kolumna3 = document.getElementById("kolumna3");
const wiadomosc = document.getElementById("wiadomosc");
const zetonyWyświetlacz = document.getElementById("zetony");
const stawkaWejście = document.getElementById("stawka");
const krecPrzycisk = document.getElementById("krec");

let zetony = 100;
const symboleZwykle = ["🍒", "🍋", "🍊", "🍇", "⭐"];
const symboleSpecjalne = ["🍀", "💀", "💎"];
const symbole = [...symboleZwykle, ...symboleSpecjalne];

function losujSymbol() {
  const szansa = Math.random();
  if (szansa < 0.05) return symboleSpecjalne[Math.floor(Math.random() * symboleSpecjalne.length)];
  return symboleZwykle[Math.floor(Math.random() * symboleZwykle.length)];
}

function wylosujWynik() {
  let symbol1, symbol2, symbol3;
  do {
    symbol1 = losujSymbol();
    symbol2 = losujSymbol();
    symbol3 = losujSymbol();
  } while (
    symboleSpecjalne.includes(symbol1) + symboleSpecjalne.includes(symbol2) + symboleSpecjalne.includes(symbol3) > 1
  );
  return [symbol1, symbol2, symbol3];
}

function stwórzAnimację(kolumna, symbolKońcowy) {
  return new Promise((resolve) => {
    kolumna.innerHTML = "";
    const symboleDoAnimacji = [...Array(20)].map(() => symbole[Math.floor(Math.random() * symbole.length)]);

    
    symboleDoAnimacji.slice(0, 5).forEach((symbol) => {
      const div = document.createElement("div");
      div.textContent = symbol;
      kolumna.appendChild(div);
    });

    
    const divKońcowy = document.createElement("div");
    divKońcowy.textContent = symbolKońcowy;
    divKońcowy.classList.add("symbol-wygrany");
    kolumna.appendChild(divKońcowy);

  
    symboleDoAnimacji.slice(5).forEach((symbol) => {
      const div = document.createElement("div");
      div.textContent = symbol;
      kolumna.appendChild(div);
    });

    let offset = 0;
    const animacja = setInterval(() => {
      offset += 5;
      kolumna.scrollTop = offset;
      if (offset >= kolumna.scrollHeight - kolumna.clientHeight) {
        clearInterval(animacja);
        kolumna.innerHTML = "";
        kolumna.appendChild(divKońcowy);
        resolve();
      }
    }, 15); 
  });
}

async function krec() {
  const stawka = parseInt(stawkaWejście.value, 10);

  if (isNaN(stawka) || stawka < 1) {
    wiadomosc.textContent = "Podaj prawidłową stawkę!";
    return;
  }

  if (zetony < stawka) {
    wiadomosc.textContent = "Masz za mało żetonów!";
    return;
  }

  zetony -= stawka;
  zetonyWyświetlacz.textContent = zetony;

  krecPrzycisk.disabled = true;

  const [symbol1, symbol2, symbol3] = wylosujWynik();

  await Promise.all([
    stwórzAnimację(kolumna1, symbol1),
    stwórzAnimację(kolumna2, symbol2),
    stwórzAnimację(kolumna3, symbol3),
  ]);

  const licznikSymboli = {};
  [symbol1, symbol2, symbol3].forEach((symbol) => {
    licznikSymboli[symbol] = (licznikSymboli[symbol] || 0) + 1;
  });

  if (licznikSymboli[symbol1] === 3) {
    wiadomosc.textContent = `Wygrana! Zgarnąłeś ${stawka * 3} żetonów!`;
    zetony += stawka * 3;
  } else if (licznikSymboli[symbol1] === 2) {
    wiadomosc.textContent = `Wygrana! Zgarnąłeś ${stawka * 2} żetonów!`;
    zetony += stawka * 2;
  } else {
    wiadomosc.textContent = `Przegrałeś ${stawka} żetonów!`;
  }

  zetonyWyświetlacz.textContent = zetony;
  krecPrzycisk.disabled = false;
}

krecPrzycisk.addEventListener("click", krec);

function przełączZasady() {
  const zasady = document.getElementById("zasady");
  zasady.style.display = zasady.style.display === "none" ? "block" : "none";
}
