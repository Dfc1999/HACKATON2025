# 📘 Conexión y uso de la base de datos MongoDB Atlas

Este documento explica cómo interactuar con la base de datos desde el endpoint `conection_db` de Azure Functions.

---

## 🚀 Endpoint

**URL local:**
```
POST http://localhost:7071/api/conection_db
```

Este endpoint permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre la colección `agente_reconocimiento_caras` en MongoDB Atlas.

---

## ⚙️ Variables de entorno requeridas

Asegúrate de tener configuradas las siguientes variables en tu archivo `.env` o `local.settings.json`:

```bash
MONGO_ATLAS_URI=<tu_uri_de_conexion_a_mongo_atlas>
MONGO_DB_NAME=hospital_ai
```

---

## 🧩 Estructura general del cuerpo de la solicitud

Cada solicitud debe ser de tipo **POST** y contener un cuerpo JSON con el campo `action` que define la operación a realizar.

```json
{
  "action": "create | read | update | delete",
  "data": { ... },
  "filter": { ... },
  "id": "..."
}
```

---

## 🔹 Operaciones disponibles

### 1. Crear un agente (`create`)
```json
{
  "action": "create",
  "data": {
    "nombre": "Juan",
    "apellido": "Pérez",
    "direccion": "Av. Central 123",
    "numero": "78945612",
    "referencia_nombre": "María",
    "referencia_numero": "65432198",
    "vectores": [0.12, 0.45, 0.78],
    "datos_medicos": {
      "presion": "120/80",
      "pulso": 72
    },
    "enfermedades_base": ["diabetes", "hipertensión"]
  }
}
```

**Respuesta:**
```json
{
  "message": "Agente creado exitosamente",
  "id": "ID_GENERADO"
}
```

---

### 2. Leer agentes (`read`)
```json
{
  "action": "read"
}
```

**Con filtro opcional:**
```json
{
  "action": "read",
  "filter": { "apellido": "Pérez" }
}
```

**Respuesta:**
```json
[
  {
    "_id": "ID_DEL_DOCUMENTO",
    "nombre": "Juan",
    "apellido": "Pérez",
    ...
  }
]
```

---

### 3. Actualizar un agente (`update`)
```json
{
  "action": "update",
  "id": "ID_DEL_DOCUMENTO",
  "data": {
    "direccion": "Av. Nueva 456",
    "numero": "98765432"
  }
}
```

**Respuesta:**
```json
{
  "message": "Agente actualizado",
  "modifiedCount": 1
}
```

---

### 4. Eliminar un agente (`delete`)
```json
{
  "action": "delete",
  "id": "ID_DEL_DOCUMENTO"
}
```

**Respuesta:**
```json
{
  "message": "Agente eliminado",
  "deletedCount": 1
}
```

---

## 🧠 Notas adicionales

- La colección utilizada es **`agente_reconocimiento_caras`**.
- El campo `_id` es generado automáticamente por MongoDB.
- Si se intenta realizar una acción no válida, el servidor responderá con:
  ```json
  { "error": "Acción no válida. Usa create, read, update o delete." }
  ```
- En caso de error de conexión o parámetros faltantes, se devolverá un código `500` con el mensaje de error correspondiente.

---

## 🧪 Pruebas con Postman

1. Inicia el servidor local:
   ```bash
   func start
   ```
2. Abre Postman y crea una nueva solicitud `POST` a:
   ```
   http://localhost:7071/api/conection_db
   ```
3. En la pestaña **Body**, selecciona **raw → JSON** y copia uno de los ejemplos anteriores.
4. Presiona **Send** y verifica la respuesta.

---

## 🧾 Autor

**Proyecto:** Hospital AI Backend  
**Módulo:** Conexión con MongoDB Atlas  
**Responsable:** Equipo de desarrollo Hackaton Microsoft  
**Fecha:** 27/11/2025