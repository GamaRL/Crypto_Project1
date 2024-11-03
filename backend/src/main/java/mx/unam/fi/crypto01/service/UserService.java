package mx.unam.fi.crypto01.service;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import com.corundumstudio.socketio.SocketIOClient;

/**
 * Definición de la clase, se encarga de gestionar un Map para almacenar la relación
 * entre los usuarios conectados al servidor mediante un id y socket de conexión
 */
@Service
public class UserService {

  private Map<String, SocketIOClient> users = new HashMap<>();

  /**
   * Método público que permite añadir un usuario al HashMap con
   * los datos; IDuser, SocketCliente
   */
  public void addUser(String sessionId, SocketIOClient client) {
    users.put(sessionId, client);
  }

  /**
   * Método de tipo get, devuelve la instancia de SocketIOClient
   * asociada a un IDsession, permite obtener información de un
   * cliente
   */
  public SocketIOClient getUser(String sessionId) {
    return users.get(sessionId);
  }

  /**
   * Método público, se encarga de remover un cliente del HashMap
   * mediante su ID de sesión
   */
  public void removeUser(String sessionId) {
    users.remove(sessionId);
  }

  /**
   * Método público, permite obtener una colección de todos los datos
   * de sessionID que está en el hashMap user
   */
  public Collection<String> getAllUsers() {
    return users.keySet();
  }
}
