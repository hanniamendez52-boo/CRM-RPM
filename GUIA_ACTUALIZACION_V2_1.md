# Campo360 CRM Agropecuario — Guía de Actualización v2.1

Esta versión incorpora las funcionalidades solicitadas para el instalador PWA con límite por IP y el sistema integral de notificaciones configurables.

---

## 1. Ventana Flotante del Instalador PWA (Límite de 3 ocasiones por IP)

### Funcionamiento
- **Detección de IP:** Al iniciar la aplicación, se consulta de forma asíncrona la dirección IP pública del cliente (`https://api.ipify.org?format=json`). Si la conexión falla o el cliente está sin internet, utiliza el identificador de respaldo `local_client`.
- **Contador por IP:** En el almacenamiento local (`localStorage`), bajo la clave `campo360_pwa_ip_counts`, se guarda el registro de apariciones por cada dirección IP:
  ```json
  {
    "187.190.22.10": 2,
    "local_client": 1
  }
  ```
- **Regla de visualización:**
  - Si el contador para la IP es **menor a 3**, se incrementa en 1 y se despliega la ventana flotante (`#pwaDialog`), indicando el número de aparición actual (ej. *"Aparición 1 de 3 para esta IP"*).
  - Si el contador llega a **3 o más**, la ventana flotante **no vuelve a aparecer** automáticamente para esa IP.
  - La ventana incluye la opción *"No volver a mostrar en esta IP"*, que fija el contador en 3 de inmediato.

### Instalador PWA
- **Soporte PWA:** Genera dinámicamente un `manifest.json` y registra un `Service Worker` para habilitar capacidades offline e instalación nativa.
- **Botón de instalación:** Captura el evento `beforeinstallprompt`. Al hacer clic en **"📥 Instalar aplicación PWA"**, invoca el diálogo de instalación nativo del sistema operativo o navegador (Android, Windows, macOS, Chrome OS). Si el navegador no soporta el evento directamente (como iOS Safari), despliega instrucciones para agregar el acceso directo a la pantalla de inicio.

---

## 2. Sistema de Notificaciones a Dispositivos y Configuración

En el módulo **Configuración** se añadió el panel **"Notificaciones del sistema y PWA"**, permitiendo alternar entre los cuatro modos requeridos:

| Modo | Identificador | Comportamiento |
| :--- | :--- | :--- |
| **Encendido todo** | `all` | Notificaciones nativas al dispositivo (Web Notifications API) más alertas visuales constantes en pantalla. |
| **Formato ventana** | `window` | Alertas emergentes dentro del sistema mediante ventana modal interna (`#notifDialog`), sin emitir notificaciones del sistema operativo. |
| **Suspender a una al día** | `once_daily` | Limita la emisión a un máximo de **1 notificación por día**. Las alertas adicionales quedan suspendidas hasta el día siguiente. |
| **Apagar notificaciones** | `off` | Desactiva por completo cualquier notificación o alerta. |

### Validación y pruebas
Desde la sección de Configuración se incluyen botones de validación inmediata:
- **Validar permisos dispositivo:** Solicita los permisos del navegador mediante `Notification.requestPermission()` y reporta el estado en pantalla (*granted*, *denied*, o *default*).
- **Probar notificación:** Envía una alerta de prueba en el modo actualmente configurado.
- **Abrir ventana instalador PWA:** Permite consultar la ventana flotante del instalador en cualquier momento.
- **Reiniciar contador IP:** Restablece el contador a `0/3` para facilitar pruebas de desarrollo.

---

## 3. Alerta Automática de Fin de Día (8:30 p.m.)

### Regla de negocio
- **Horario:** Se evalúa de manera automática a las **8:30 p.m. (20:30 hrs)** mediante un temporizador en segundo plano.
- **Condición de envío:**
  1. Filtra los registros de la colección `clients` creados en la fecha actual (`createdAt`).
  2. **Si hay personas registradas (conteo > 0):** Emite la notificación con el número de clientes y los nombres de las empresas/contactos registrados en la jornada.
  3. **Si no hay registros en el día (conteo = 0):** **No se envía ninguna notificación**, cumpliendo estrictamente con la indicación.
- **Prevención de duplicidad:** Registra la fecha de envío en `campo360_daily_summary_YYYY-MM-DD` para evitar avisos repetidos en el mismo día.
- **Simulación:** En la pestaña de Configuración se incluye el botón **"Simular alerta 8:30 p.m."** para validar el comportamiento en cualquier momento sin esperar el horario límite.
