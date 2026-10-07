# Guía de Activación de PWA, Notificaciones y Firebase Cloud Messaging (FCM)

Esta guía explica paso a paso cómo conectar la clave VAPID y desplegar la Cloud Function para que las notificaciones funcionen directamente en los teléfonos celulares y computadoras, incluso cuando la aplicación o el navegador estén completamente cerrados.

---

## 1. Obtener la clave pública VAPID en Firebase Console

Para que el navegador autorice el envío de mensajes push desde Firebase a los dispositivos, se requiere una clave VAPID generada en tu proyecto:

1. Ingresa a la consola de Firebase: [https://console.firebase.google.com/](https://console.firebase.google.com/).
2. Selecciona tu proyecto: **`crm-crpm`** (o `aquaviva-crm-rpm`).
3. En el menú lateral superior izquierdo, haz clic en el ícono de engrane ⚙️ y selecciona **Configuración del proyecto**.
4. Haz clic en la pestaña superior **Cloud Messaging**.
5. Desplázate hacia abajo hasta la sección **Configuración web**.
6. En el apartado **Certificados push web**, haz clic en el botón **Generar par de claves**.
7. Se creará una clave extensa (por ejemplo: `BKagZ-m7f2P...`). Copia esa **Clave pública**.

---

## 2. Configurar la clave VAPID en la aplicación

En `index.html` (o en el panel de **Configuración** de la aplicación):
* Pega tu clave en el campo **Clave VAPID de FCM** o asígnala en la configuración JavaScript (`CFG.vapidKey = 'TU_CLAVE_VAPID_AQUI'`).
* Haz clic en **"Vincular dispositivo a Push FCM"**. El navegador solicitará permisos de notificación y registrará el token de tu dispositivo en la colección Firestore `fcm_tokens`.

---

## 3. Desplegar la Cloud Function para la alerta de las 8:30 p.m.

La carpeta `functions/` incluida en el paquete contiene la función automática que se ejecuta en los servidores de Google todos los días a las 8:30 p.m. (20:30 hrs de México).

### Pasos de despliegue desde tu terminal:
```bash
# 1. Entrar a la carpeta functions
cd functions

# 2. Instalar las dependencias de Firebase
npm install

# 3. Iniciar sesión en Firebase (si no lo has hecho)
firebase login

# 4. Asegurarse de seleccionar tu proyecto
firebase use crm-crpm

# 5. Desplegar la función programada
firebase deploy --only functions
```

Una vez desplegada, la función `dailyRegistrationSummary` se activará automáticamente a las 20:30 hrs todos los días:
* Si en el día se registraron 1 o más personas/clientes, envía la notificación push a todos los teléfonos y navegadores suscritos.
* Si en el día **no hubo ningún registro**, la función finaliza en silencio **sin enviar ninguna notificación**, cumpliendo con la regla solicitada.

---

## 4. Reglas de Seguridad en Firestore para tokens

En Firebase Console > **Firestore Database** > **Reglas**, asegúrate de que la colección `fcm_tokens` permita el registro de los dispositivos:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Colección de tokens para notificaciones push
    match /fcm_tokens/{tokenId} {
      allow read, write: if true; // O restringido por usuario autenticado request.auth != null
    }
    
    // Reglas para tus colecciones de CRM
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 5. Resumen de archivos incluidos en el paquete

* **`index.html`:** CRM completo con PWA, ventana emergente (máximo 3 veces por IP) y panel de configuración de 4 modos de alerta.
* **`firebase-messaging-sw.js`:** Service Worker para recibir las notificaciones push en segundo plano cuando la pantalla o app estén apagadas.
* **`manifest.json`:** Manifiesto oficial PWA para instalación en escritorio y móviles.
* **`functions/index.js` y `functions/package.json`:** Código de la Cloud Function programada para la alerta de las 8:30 p.m.
