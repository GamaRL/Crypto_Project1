package mx.unam.fi.crypto01.service; /*Package correspondiente a la clase, organización lógica */

import org.springframework.stereotype.Service;/*clase de tipo servicio, disponible para inyección de dependencias*/

import com.corundumstudio.socketio.SocketIOClient;/*se importa clase del paquete Socket.IO, representa
un cliente conectado al servidor dado */

import mx.unam.fi.crypto01.messages.Message;/*impportación de la clase message */

/* Clase pública para la administración de la comunicación entre un remitente, mensaje*/
@Service
public class SocketService {
  /*Clase de tipo pública, encargado  de enviar un mensaje a los clientes de una conexión/sesión, exceptuando 
   * al remitente inicial
   * @senderClient remitente
   * @message     mensaje, contiene la información a enviar
   * @room        nombre del lugar a enviar 'sala'
   */
  public void sendSocketmessage(SocketIOClient senderClient, Message message, String room) {
    for (SocketIOClient client : senderClient.getNamespace().getRoomOperations(room).getClients()) {
      if (!client.getSessionId().equals(senderClient.getSessionId())) {
        client.sendEvent("read_message", message);
      }
    }
  }
}
