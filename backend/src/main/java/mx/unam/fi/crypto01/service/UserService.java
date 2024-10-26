package mx.unam.fi.crypto01.service;/*pacgake correspondiente a la clase, organización lógica */

/*Importaciones de clases para manejar colecciones en Java */
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
/*Importación de la clase de tipo spring, framework para manejar los clientes conectados al SocketIOClient */
import org.springframework.stereotype.Service;

import com.corundumstudio.socketio.SocketIOClient;

/*Definición de la clase, se encarga de gestionar un map para almacenar la relación
 * entre los usuarios conectados al servidor mediante un id y su conexión dentro del socket
 */
@Service
public class UserService {
  private Map<String, SocketIOClient> users = new HashMap<>();
  /*Método público que permite añadir un usuario al HashMap con los datos; IDuser, SocketCliente */
  public void addUser(String sessionId, SocketIOClient client) {
    users.put(sessionId, client);
  }
  /*Método de tipo get, devuelve la instancia de SocketIOClient asociada a un IDsession, permite 
   * obtener información de un cliente
    */
  public SocketIOClient getUser(String sessionId) {
    return users.get(sessionId);
  }
  /*Método público, se encarga de remover un cliente del HashMap mediante su ID de sesión*/
  public void removeUser(String sessionId) {
    users.remove(sessionId);
  }
  /*Método público, permite obtener una colección de todos los datos de sessionID que está en el hashMap user */
  public Collection<String> getAllUsers() {
    return users.keySet();
  }
}
