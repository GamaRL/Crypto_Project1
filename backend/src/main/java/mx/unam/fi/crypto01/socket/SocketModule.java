package mx.unam.fi.crypto01.socket;

import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;

import lombok.extern.slf4j.Slf4j;
import mx.unam.fi.crypto01.service.SocketService;
import mx.unam.fi.crypto01.service.UserService;

@Component
@Slf4j
public class SocketModule {

  private final SocketIOServer server;
  private final SocketService socketService;
  private final UserService userService;

  public SocketModule(SocketIOServer server, SocketService socketService, UserService userService) {
    this.server = server;
    this.socketService = socketService;
    this.userService = userService;
    server.addConnectListener(this.onConnected());
    server.addDisconnectListener(this.onDisconnected());
    server.addEventListener("show_connections", Void.class, this.onShowConnections());
  }

	private ConnectListener onConnected() {
    return (client) -> {
      String name = String.join("", client.getHandshakeData().getUrlParams().get("username"));
      userService.addUser(client.getSessionId().toString(), client);
      log.info("User connected: {}", name);
      //log.info("Users: {}", userService.getAllUsers());
    };
  }

  private DisconnectListener onDisconnected() {
    return client -> {
      userService.removeUser(client.getSessionId().toString());
      log.info("User disconnected: {}", client.getSessionId());
      // log.info("Users: {}", userService.getAllUsers());
    };
  }

  private DataListener<Void> onShowConnections() {
    return (client, data, ackSender) -> {

      var list = server.getAllClients()
      .stream()
      .map(c -> {
        var params = c.getHandshakeData().getUrlParams().get("username");
        String name = String.join("", params);
        String sessionId = c.getSessionId().toString();

        return Map.entry(name, sessionId);
      })
      .collect(Collectors.toList());

      ackSender.sendAckData(list);
    };
	}

}
