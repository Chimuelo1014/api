const API_KEY = ""; //api key 
const form = document.getElementById("form");
const input = document.getElementById("pregunta");
const chat = document.getElementById("chat");

form.addEventListener("submit", async (e) => { //evento de escucha
  e.preventDefault();
  const mensajeUsuario = input.value.trim();
  if (mensajeUsuario === "") return;

  mostrarMensaje(mensajeUsuario, "user");
  input.value = "";
  mostrarMensaje("Cargando respuesta...", "bot");

  try {
    const respuesta = await enviarPregunta(mensajeUsuario);
    eliminarUltimoMensaje(); // quitar "Cargando respuesta..."
    mostrarMensaje(respuesta, "bot");
  } catch (error) {
    eliminarUltimoMensaje();
    mostrarMensaje("Error al obtener respuesta. Intenta nuevamente.", "bot");
    console.error(error);
  }
});

function mostrarMensaje(texto, clase) {
  const div = document.createElement("div");
  div.className = clase;
  div.textContent = texto;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function eliminarUltimoMensaje() {
  const ultimo = chat.lastChild;
  if (ultimo) chat.removeChild(ultimo);
}

async function enviarPregunta(mensaje) {
  const url = "https://api.openai.com/v1/chat/completions";

  const respuesta = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`, // ← Aquí se usa la clave
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: mensaje }]
    })
  });

  if (!respuesta.ok) {
    throw new Error("Error HTTP: " + respuesta.status);
  }

  const data = await respuesta.json();
  return data.choices[0].message.content.trim();
}
