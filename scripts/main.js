/*
 *
 *  Push Notifications codelab
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

/* eslint-env browser, es6 */

"use strict";

const chavePublica =
  "BLKF3E0V3_5Ttlx-NIrmqyP4cXzgGexjQOerdO594cudhB_vMd_dubz7h3fZQ3yYS00hB6G0VFd1xCzt1cUQUbc";
let estaInscrito = false;
let registroDoServiceWorker = null;

function urlB64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

$(document).ready(() => {
  $("#botao-enviar").click(self => {
    $(self).prop("disabled", true);
    if (estaInscrito) {
      desinscreverOUsuario();
      console.log("to inscrito");
    } else {
      subscrevaOUsuario();
    }
  });

  if ("serviceWorker" in navigator && "PushManager" in window) {
    console.log("Service Worker and Push é suportado");

    navigator.serviceWorker
      .register("service-worker.js")
      .then(function(registro) {
        console.log("Service Worker esta registrado", registro);

        registroDoServiceWorker = registro;
      })
      .catch(function(error) {
        console.error("Service Worker Erro", error);
      });

    navigator.serviceWorker
      .register("service-worker.js")
      .then(function(registro) {
        console.log("Service Worker esta registrado", registro);

        registroDoServiceWorker = registro;
        iniciarInterfaceDoUsuario();
      });
  } else {
    console.warn("Push messaging não é suportado");
    $("#botao-enviar").text("Push não habilitado pelo navegador");
    $("#botao-enviar").prop("disabled", true);
  }
});

function iniciarInterfaceDoUsuario() {
  if (registroDoServiceWorker != null) {
    registroDoServiceWorker.pushManager
      .getSubscription()
      .then(function(inscricao) {
        estaInscrito = !(inscricao === null);

        if (estaInscrito) {
          console.log("Usuario inscrito.");
        } else {
          console.log("Usuario não inscrito.");
        }

        atualizarBotao();
      });
  }
}

function atualizarBotao() {
  if (Notification.permission === "denied") {
    $("#botao-enviar").text(
      "Ce BLOQUEOU A PERMISAO DE NOTIFICAO, QUER CLICAR AQUI P QUE?! INFERNO."
    );
    $("#botao-enviar").prop("disabled", true);
    enviarSerialDeInscricaoParaGestaoDeFerias(null);
    return;
  }

  if (estaInscrito) {
    $("#botao-enviar").text("Desabilitar recebimento de Push");
  } else {
    $("#botao-enviar").text("Habilitar recebimento de Push");
  }

  $("#botao-enviar").prop("disabled", false);
}

function subscrevaOUsuario() {
  console.log("subscreva");
  const chavePrivada = urlB64ToUint8Array(chavePublica);
  registroDoServiceWorker.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: chavePrivada
    })
    .then(retornoInscrito => {
      console.log(
        "Usuario esta inscrito!!! POOORAAA!!!!!!!!!!",
        retornoInscrito
      );

      enviarSerialDeInscricaoParaGestaoDeFerias(retornoInscrito);

      estaInscrito = true;

      atualizarBotao();
    })
    .catch(function(err) {
      console.log("Falha ao inscrever o usuario no servidor: ", err);
      atualizarBotao();
    });
}
function desinscreverOUsuario() {
  registroDoServiceWorker.pushManager
    .getSubscription()
    .then(retornoInscricao => {
      if (retornoInscricao) {
        console.log(
          "Usuario esta desinscrito!!! POOORAAA!!!!!!!!!!",
          retornoInscrito
        );
        return retornoInscricao.unsubscribe();
      }
    })
    .catch(function(err) {
      console.log("Falha ao desinscrever o usuario do FCM: ", err);
    })
    .then(() => {
      enviarSerialDeInscricaoParaGestaoDeFerias(null);
      estaInscrito = false;
      atualizarBotao();
    });
}

function enviarSerialDeInscricaoParaGestaoDeFerias(inscricao) {
  // arg0 = PushSubscription

  if (inscricao) {
    $("#serial-inscricao-json").text(JSON.stringify(inscricao));
    $(".detalhes-incricao-json").removeClass("is-invisible");
  } else {
    $(".detalhes-incricao-json").addClass("is-invisible");
  }
}
