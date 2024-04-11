const apiUrl = "http://127.0.0.1:80/climatempo/"; //url da api clima tempo

function fade(element, callback) { //função que serve para o toast desaparecer devagar
    let op = 1;
    let timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
            if (typeof callback === 'function') {
                callback();
            }
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
}

function updateElementText(elementId, text, text2) { // função que serve para podermos colocar os textos (graus celcius etc e tal)
    const element = document.getElementById(elementId);
    if (element) {
        element.innerText = text + text2;
    }
}

function updateElementImg(elementId, src) { // mesma coisa q o updateElementText só que com imagem 
    const element = document.getElementById(elementId);
    if (element) {
        element.src = src;
    }
}

function displayData(data) { // função na qual retorna as informações como, clima, imagem etc
    if (!data) return;

    const temperatura = data.temperatura.toFixed(0);

    console.log(data);
    const imgUrl = `https://flagsapi.com/${data.pais}/flat/64.png`; // imagem do icone que aparece (bandeira)
    updateElementText("temperatura", temperatura, "ºC");
    updateElementText("umidade", data.umidade, "%");
    updateElementText("veloVento", data.velocidadeDoVento, "km/h");
    updateElementText("clima", data.clima, "");
    updateElementText("nome", data.nome, "");
    updateElementImg("iconClima", data.iconUrl);    
    updateElementImg("iconPais", imgUrl);
    updateBackground("background", data.clima)
}

function handleError(errorMsg) { // função que serve para mostrar o toast quando a cidade tiver com algum erro
    const toast = document.createElement("div");
    const icon = document.createElement("i");
    icon.className = "bx bxs-shield-x";
    toast.classList.add("toast");
    toast.innerText = errorMsg;
    toast.appendChild(icon);
    document.body.appendChild(toast);

    setTimeout(() => {
        fade(toast, function() {
            toast.remove();
        });
    }, 3000);
}

async function getData(cidade) { // fazer a pesquisa da cidade
    const url = apiUrl + cidade;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro ao se conectar!');
        }
        return await response.json();
    } catch (error) {
        handleError("Cidade não encontrada!");
        return null;
    }
}

function setHorario() { // mostrar horario no canto da tela
    let date = new Date();
    let minute =  ("0" + date.getMinutes()).slice(-2);
    let hour =  ("0" + date.getHours()).slice(-2);
    let horario = `${hour}:${minute}`
    updateElementText("horario", horario, "");
}

window.addEventListener("load", async () => { // o que acontece quando você começa a usar o bglh em si
    setHorario(); //mostra o horario
    setInterval(setHorario, 1000); // mudar a cada segundo o horario
    const informacoes = await getData("marília"); // pegar as informações de marilia (cidade padrão)
    displayData(informacoes); // mostrar informações
});

const pesquisarCampo = document.getElementById("pesquisar"); // pegar o id do input de pesquisar

pesquisarCampo.addEventListener("keyup", async (e) => { //vai rodar esse evento toda vez q clicar qualquer tecla do input
    if (e.key === 'Enter') { // se a tal tecla for igual a enter vai fazer oq ta aq
        const informacoes = await getData(pesquisarCampo.value.toLowerCase()); //que é pegar as informações
        displayData(informacoes); // mostrar as informações
        pesquisarCampo.value = ''; // e apagar o input 
        
    }
});

function updateBackground(background, clima){ //função que serve para dar o update de bacground dependendo do clima
    const background1 = document.getElementById(background)

    if (clima == "Chuva" || clima == "Garoa"){
        background1.src = "images/chuva-20995920-131120200056.gif"
    } else if(clima == "Neve"){
        background1.src = "images/neve.gif"
    } else if (clima =="Névoa"){
        background1.src = "images/nevoa.jpg"
    } else if (clima =="Céu limpo"){
        background1.src = "images/ceu.jpg"
    } else if (clima == "Parcialmente nublado" ){
        background1.src = "images/nublado.gif"
    } else if (clima == "Tempestade") {
        background1.src = "images/tempestade.gif"
    } else if (clima == "Nublado") {
        background1.src = "images/nubladoR.gif"
    }
     else{
        background1.src = "https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg"
    }
}