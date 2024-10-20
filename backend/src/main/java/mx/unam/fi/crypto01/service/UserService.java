package mx.unam.fi.crypto01.service;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.corundumstudio.socketio.SocketIOClient;

@Service
public class UserService {
  private Map<String, SocketIOClient> users = new HashMap<>();

  public void addUser(String sessionId, SocketIOClient client) {
    users.put(sessionId, client);
  }

  public SocketIOClient getUser(String sessionId) {
    return users.get(sessionId);
  }

  public void removeUser(String sessionId) {
    users.remove(sessionId);
  }

  public Collection<String> getAllUsers() {
    return users.keySet();
  }
}
