# Productos API con Node.js, Express, Mongoose y Docker

Esta API es un ejemplo desarrollado en Node.js para gestionar productos tecnológicos. La API se conecta a una base de datos MongoDB dockerizada y expone endpoints para obtener, crear/actualizar y eliminar productos.

## Descripción

La API implementa las siguientes funcionalidades:

- **GET /products:** Devuelve todos los documentos (productos) de la colección.
- **GET /products/query:** Devuelve los productos que cumplen con la condición especificada mediante query string.
- **PUT /products:** Actualiza (o crea) un producto, según se encuentre o no en la base de datos.
  - Si el producto no existe, lo crea y retorna `201 Created`.
  - Si el producto existe, lo actualiza y retorna `200 OK`.
- **DELETE /products:** Elimina los productos que cumplen con la condición del query.
  - Si no se encuentra ningún producto, retorna `204 No Content`.
  - Si se elimina al menos un producto, retorna `200 OK` con la cantidad de elementos eliminados.

## Requisitos

- [Docker](https://www.docker.com/) y Docker Compose.
- Git (para clonar el repositorio).

## Estructura del Proyecto

```
NodeApi/ 
├── data/ # Carpeta para persistencia de datos de MongoDB 
├── node_modules/ 
├── .gitignore 
├── app.js # Código fuente principal de la API 
├── docker-compose.yml # Archivo para levantar API y MongoDB conjuntamente 
├── Dockerfile # Instrucciones para construir la imagen de la API 
├── package.json 
├── package-lock.json 
├── productos_tecnologicos.json # Archivo con datos de ejemplo (ubicado en la raíz) 
└── readme.md 
```


## Cómo Levantar la Aplicación

### 1. Clonar el Repositorio

Abre una terminal y ejecuta:

```bash
git clone https://github.com/tu_usuario/tu_repositorio.git
cd tu_repositorio
```

### 2. Levantar los Contenedores con Docker Compose

El proyecto está dockerizado y utiliza Docker Compose para orquestar la API y MongoDB.

Ejecuta el siguiente comando en la raíz del proyecto:

```bash
docker-compose up --build
```

Esto hará lo siguiente:

- Construirá la imagen para la API (usando el Dockerfile).
- Levantará un contenedor con MongoDB (usando la imagen oficial de MongoDB).
- Levantará el contenedor de la API en el puerto 3000.
- Configurará una red interna para que la API se conecte a MongoDB mediante la variable de entorno ```MONGO_URL```.

**Nota:**

**Si el puerto 27017 ya está en uso en tu máquina (por ejemplo, porque tienes otra instancia de MongoDB corriendo localmente), detén el servicio local o modifica el mapeo de puertos en el archivo docker-compose.yml.**

### 3.  Probar la API
Una vez levantados los contenedores, puedes probar los endpoints desde tu navegador o con Postman:
- Obtener todos los productos:
Accede a ```http://localhost:3000/products```
Si aún no se han insertado productos, verás un arreglo vacío: [].
- Otros endpoints:
Para filtrar, actualizar, o eliminar productos, utiliza los endpoints definidos (por ejemplo, ```GET /products/query, PUT /products, DELETE /products```).

## Cómo Importar Datos a la Base de Datos

El archivo ```productos_tecnologicos.json``` contiene datos de ejemplo. Para poblar la base de datos, sigue estos pasos:

**Opción A: Usar MongoDB Compass**
1. Abre MongoDB Compass y conecta a ```mongodb://localhost:27017``` (o al puerto que uses).
2. Selecciona la base de datos ```miBaseDeDatos``` y la colección ```Productos```.
3. Usa la opción "IMPORT DATA" en Compass y selecciona el archivo ```productos_tecnologicos.json```.

4. Ajusta las configuraciones necesarias (por ejemplo, formato NDJSON o JSON array) y realiza la importación.

**Opción B: Usar mongoimport desde la Terminal**

Con el contenedor de MongoDB funcionando y mapeado al puerto 27017, ejecuta el siguiente comando desde la raíz del proyecto:

```
mongoimport --host localhost --port 27017 --db miBaseDeDatos --collection Productos --file productos_tecnologicos.json
```
Este comando insertará los productos en la colección Productos de la base de datos miBaseDeDatos.

## Notas Finales

- **Persistencia de Datos:**
Los datos se almacenan en la carpeta ```data/db``` (montada como volumen en el contenedor de MongoDB). Esta carpeta generalmente se incluye en el ```.gitignore```, por lo que los datos persistentes no se suben al repositorio. Por ello, se incluye el archivo ```productos_tecnologicos.json``` para que se pueda cargar la base de datos en otro equipo.
- **Variables de Entorno:**
La cadena de conexión a MongoDB se configura mediante la variable ```MONGO_URL```. En Docker Compose, la tenemos definida como ```mongodb://mongo:27017/miBaseDeDatos```.
- Requisitos del Proyecto:
Este proyecto cumple con los requerimientos:
1. Desplegar MongoDB en un contenedor Docker con persistencia.
2. Crear una API que se conecte a MongoDB y que ofrezca rutas GET, PUT y DELETE para gestionar documentos.
3. Dockerizar la API.

## Conclusión

Clonando el repositorio y ejecutando ```docker-compose up --build```, se levantarán la API y el contenedor de MongoDB. Luego, utilizando MongoDB Compass o mongoimport, podrás importar fácilmente los datos de ```productos_tecnologicos.json``` para poblar la base de datos.