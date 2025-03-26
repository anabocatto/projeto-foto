const video = document.getElementById("camera");
const capturarBtn = document.getElementById("capturar");
const pbBtn = document.getElementById("pb");
const ativarBtn = document.getElementById("ativar");
const desativarBtn = document.getElementById("desativar");
const galeria = document.getElementById("galeria");
let stream = null;
let fotos = 0;
const maxFotos = 8;

async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (erro) {
        alert("Erro ao abrir a câmera");
    }
}

function stopCamera() {
    if (stream) {
        let tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
    }
}

function tirarFoto(pretoBranco = false) {
    if (fotos >= maxFotos) {
        alert("Você já tirou 8 fotos!");
        return;
    }

    const canvas = document.createElement("canvas");
    const contexto = canvas.getContext("2d");

    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    contexto.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (pretoBranco) {
        let imgData = contexto.getImageData(0, 0, canvas.width, canvas.height);
        let data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
            let media = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = media; 
            data[i + 1] = media; 
            data[i + 2] = media; 
        }

        contexto.putImageData(imgData, 0, 0);
    }

    galeria.appendChild(canvas);
    fotos++;
}

capturarBtn.addEventListener("click", () => tirarFoto(false));
pbBtn.addEventListener("click", () => tirarFoto(true));
ativarBtn.addEventListener("click", startCamera);
desativarBtn.addEventListener("click", stopCamera);

startCamera();
