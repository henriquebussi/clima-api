const apiUrl = "http://127.0.0.1:80/climatempo/";

// Função para realizar um efeito de fade out em um elemento HTML
function fade(element, callback) {
    let op = 1; // Inicialização da opacidade
    let timer = setInterval(function () { // Configuração de um intervalo para diminuir gradualmente a opacidade
        if (op <= 0.1){  // Verificação da opacidade mínima alcançada
            clearInterval(timer); // Limpeza do intervalo e ocultação do elemento
            element.style.display = 'none';// Chamada de callback se fornecido
            if (typeof callback === 'function') {
                callback();
            }
        }
        // Atualização da opacidade do elemento
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1; // Diminuição da opacidade gradualmente
    }, 50); // Intervalo de atualização
}

function updateElementText(elementId, text, text2) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerText = text + text2;
    }
}

function updateElementImg(elementId, src) {
    const element = document.getElementById(elementId);
    if (element) {
        element.src = src;
    }
}

function displayData(data) {
    if (!data) return;

    const temperatura = data.temperatura . toFixed(0);

    console.log(data);
    const imgUrl = `https://flagsapi.com/${data.pais}/flat/64.png`;
    updateElementText("temperatura", temperatura, "ºC");
    updateElementText("umidade", data.umidade, "%");
    updateElementText("veloVento", data.velocidadeDoVento, "km/h");
    updateElementText("clima", data.clima, "");
    updateElementText("nome", data.nome, "");
    updateElementImg("iconClima", data.iconUrl);    
    updateElementImg("iconPais", imgUrl);
    updateBackground("background", data.clima)
}

function handleError(errorMsg) {
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

async function getData(cidade) {
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

function setHorario() {
    let date = new Date();
    let minute =  ("0" + date.getMinutes()).slice(-2);
    let hour =  ("0" + date.getHours()).slice(-2);
    let horario = `${hour}:${minute}`
    updateElementText("horario", horario, "");
}

window.addEventListener("load", async () => {
    setHorario();
    setInterval(setHorario, 1000);
    const informacoes = await getData("pompéia");
    displayData(informacoes);
});

const pesquisarCampo = document.getElementById("pesquisar");

pesquisarCampo.addEventListener("keyup", async (e) => { //
    if (e.key === 'Enter') {
        const informacoes = await getData(pesquisarCampo.value.toLowerCase());
        displayData(informacoes);
        pesquisaCampo.value = '';
        
    }
});

function updateBackground(background, clima){
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
