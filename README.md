# Project 01 - Secure Message Protocol

> Alumno:
> - Coria Martínez, Gustavo      - 318164838
> - García Lemus, Rocío			     - 318263254
> - Morales Zilli, Luis Fernando - 421085620
> - Organista Álvarez, Ricardo	 - 421018596
> - Ríos Lira, Gamaliel 			   - 115002126
>
> Materia: Criptografía
>
> Semestre: 2025-1

##
# Configuración de la aplicación
Para configurar la aplicación, es necesario contar con la herramienta Docker instalada, y se debe configurar el módulo Docker Compose.

---

## Instalación de Docker

Para la instalación de Docker se recomienda utilizar la documentación oficial proporcionada en el siguiente link, según la distribución con la que se cuente:

https://docs.docker.com/engine/install/

## Instalación de Docker Compose

Para esto, se recomienda utilizar la documentación oficial para instalar el paquete necesario. El link es el siguiente:

https://docs.docker.com/compose/install/linux/#install-using-the-repository

## Ejecución del programa

*Nota: se requiere abrir una terminal y cambiarse al directorio de este repositorio (justo arriba de `frontend/` y `backend/`)*.

Para poder ejecutar la aplicación, es necesario ejecutar las siguientes instrucciones:

   ```bash
   docker compose build
  ```

Con lo anterior, se crearán las imágenes correspondientes de la aplicación (`proyecto01-frontend` y `proyecto01-backend`). Se puede verificar su existencia haciendo uso del comando:
   ```bash
   docker image ls
  ```

Finalmente, para ejecutar el proyecto, se tienen que crear los contenedores correspondientes a través del siguiente comando:
   ```bash
   docker compose up
  ```

Con lo anterior, la aplicación se encontrará corriendo en  `http:localhost:3000/`.

La utilización del sistema se explica en la siguiente liga:

https://youtu.be/QK5zv9_eWnU