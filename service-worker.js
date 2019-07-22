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

/* eslint-env browser, serviceworker, es6 */

"use strict";

// DATA EXAMPLE: {"url":"192.168.64.91:9101", "titulo": "TESTIII", "mensagem":"KKKKKKKKKKKKK DAROA"}
self.addEventListener("push", function(event) {
  console.log("[Service Worker] Push Received.");
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  //toastr.warning("Warning");
  console.log(event);
  var data = JSON.parse(event.data.text());
  const title = data.titulo;
  const options = {
    body: data.mensagem,
    icon: "images/favicon.ico",
    badge: "images/badge.png",
    data: { url: data.url }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function(event) {
  console.log("[Service Worker] Notification click Received.");

  console.log(event);
  event.notification.close();
  event.waitUntil(
    clients.openWindow(
      "http://" + event.notification.data.url + "/GestaoPessoas/Relatorio"
    )
  );
});
