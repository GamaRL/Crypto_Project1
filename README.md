<!-- # Project 01 - Secure Message Protocol

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

***Nota:** se requiere abrir una terminal y cambiarse al directorio de este repositorio (justo arriba de `frontend/` y `backend/`)*.

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











Here's a combined and enhanced version of the README that integrates the content from both sources:

--- -->

# Project 01 - Secure Message Protocol

## 📚 Course Information
- **Course**: Cryptography
- **Semester**: 2025-1
- **Institution**: Universidad Nacional Autónoma de México (UNAM), Facultad de Ingeniería
- **Instructor**: Dra. Rocío Aldeco Pérez

## 👥 Team Members
- Coria Martínez, Gustavo - 318164838
- García Lemus, Rocío - 318263254
- Morales Zilli, Luis Fernando - 421085620
- Organista Álvarez, Ricardo - 421018596
- Ríos Lira, Gamaliel - 115002126

---

## 📖 Project Overview

This project is an implementation of a secure communication protocol that ensures confidentiality, integrity, and authentication between users exchanging messages over an insecure network. By leveraging modern cryptographic techniques, the application provides a secure messaging environment using a combination of symmetric and asymmetric encryption, hashing functions, and digital signatures.

## 🎯 Objectives
The primary goal of this project is to build a secure messaging system that achieves:
- **Confidentiality**: Only authorized recipients can access the message content.
- **Integrity**: Ensuring that messages are not altered during transmission.
- **Authentication**: Verifying the identity of message senders using digital signatures.

---

## ⚙️ Technologies Used
- **Backend**: Java (Spring Boot), Socket.IO
- **Frontend**: React (Next.js)
- **Cryptography**: Web Crypto API (AES-GCM, RSA-OAEP, RSA-PSS, SHA-256)
- **Containerization**: Docker, Docker Compose
- **Styling**: Tailwind CSS, Flowbite

---

## 🛠️ Setup and Installation

### Prerequisites
Make sure you have the following tools installed:
- [Docker](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/linux/#install-using-the-repository)
- [Node.js](https://nodejs.org/)
- [Java JDK 11+](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-repository.git
cd your-repository
```

### Step 2: Build Docker Images
Navigate to the root directory (where both `frontend/` and `backend/` folders are located) and run:
```bash
docker compose build
```
This will create the necessary Docker images: `proyecto01-frontend` and `proyecto01-backend`.

To confirm the images have been created, run:
```bash
docker image ls
```

### Step 3: Run the Application
Start the application using:
```bash
docker compose up
```
The frontend will be available at: [http://localhost:3000](http://localhost:3000)

---

## 🚀 Usage Guide

### 1. **Generate Keys**
   - Navigate to the "Generate Keys" section, enter a secure password, and download your public (`.pem`) and private (`.key`) keys.

### 2. **Login**
   - Use your generated keys to authenticate by providing your username, password, and key files.

### 3. **Start a Conversation**
   - Select a connected user, exchange public keys, and establish a shared session key to encrypt messages.

### 4. **Send and Receive Messages**
   - Once the session key is set, you can send encrypted and signed messages in real-time. The system ensures message integrity and authenticity.

For a detailed walkthrough of the application's usage, please refer to the demonstration video:
📺 [YouTube Video](https://youtu.be/QK5zv9_eWnU)

---

## 📊 System Architecture

The project leverages a client-server model using Socket.IO for real-time communication. Key components include:
- **Symmetric Encryption**: AES-GCM for encrypting messages.
- **Asymmetric Encryption**: RSA-OAEP for secure key exchange.
- **Hashing**: SHA-256 for ensuring data integrity.
- **Digital Signatures**: RSA-PSS for verifying sender authenticity.

### Flow of Operations
1. Users generate RSA key pairs and securely store them.
2. A session key is exchanged between clients using asymmetric encryption.
3. Messages are encrypted using AES and signed to verify integrity.
4. The server relays messages without access to their content, ensuring privacy.

---

## 🧩 Known Issues and Future Improvements
- **Key Management**: Currently, users handle their own key pairs. A key management system could be implemented to automate this process.
- **Public Key Validation**: There’s no mechanism to ensure public keys are genuinely from the intended users. Integrating certificate authorities would mitigate this risk.
- **Session Key Generation**: Automating session key creation would simplify the user experience and enhance security.
- **Secure Transport Layer**: Implementing TLS for encrypting traffic between clients and the server is recommended.