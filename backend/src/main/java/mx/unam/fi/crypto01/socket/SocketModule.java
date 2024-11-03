package mx.unam.fi.crypto01.socket;

import java.util.stream.Collectors;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;

import lombok.extern.slf4j.Slf4j;
import mx.unam.fi.crypto01.requests.PublicKeyMessage;
import mx.unam.fi.crypto01.requests.RequestSecretSessionKey;
import mx.unam.fi.crypto01.requests.SendMessage;
import mx.unam.fi.crypto01.requests.SendSecretSessionKey;
import mx.unam.fi.crypto01.responses.ConnectedUser;
import mx.unam.fi.crypto01.responses.PublicKeyResponse;
import mx.unam.fi.crypto01.service.UserService;

@Component
@Slf4j
public class SocketModule {

  private final SocketIOServer server;
  private final UserService userService;

  public SocketModule(SocketIOServer server, UserService userService) {
    this.server = server;
    this.userService = userService;
    server.addConnectListener(this.onConnected());
    server.addDisconnectListener(this.onDisconnected());
    server.addEventListener("show_connections", Void.class, this.onShowConnections());
    server.addEventListener("request_public_key", String.class, this.onRequestPublicKey());
    server.addEventListener("response_public_key", PublicKeyMessage.class, this.onResponsePublicKey());
    server.addEventListener("send_secret_session_key", RequestSecretSessionKey.class, this.onSendSecretSessionKey());
    server.addEventListener("send_message", SendMessage.class, this.onSendMessage());
  }

	private ConnectListener onConnected() {
    return (client) -> {
      String name = String.join("", client.getHandshakeData().getUrlParams().get("username"));
      String sessionId = client.getSessionId().toString();
      userService.addUser(sessionId, client);
      log.info("User connected: {}", name);

      var newConnectedUser = ConnectedUser.builder()
          .username(name)
          .sessionId(sessionId)
          .build();

      for (var c : server.getAllClients()) {
        c.sendEvent("add_user", newConnectedUser);
      }
    };
  }

  private DisconnectListener onDisconnected() {
    return client -> {
      String sessionId = client.getSessionId().toString();
      userService.removeUser(sessionId);
      log.info("User disconnected: {}", client.getSessionId());

      for (var c : server.getAllClients()) {
        c.sendEvent("remove_user", sessionId);
      }
    };
  }

  private DataListener<String> onRequestPublicKey() {

    return (client, data, ackSender) -> {
      SocketIOClient sender = client;
      SocketIOClient receiver = server.getClient(UUID.fromString(data));

      receiver.sendEvent("request_public_key", sender.getSessionId().toString());
    };
  }

  private DataListener<PublicKeyMessage> onResponsePublicKey() {

    return (client, data, ackSender) -> {
      SocketIOClient receiver = server.getClient(UUID.fromString(data.getSessionId()));

      var response = PublicKeyResponse.builder()
        .publicKey(data.getPublicKey())
        .sessionId(client.getSessionId().toString())
        .build();

      receiver.sendEvent("response_public_key", response);
    };
  }

  private DataListener<RequestSecretSessionKey> onSendSecretSessionKey() {

    return (client, data, ackSender) -> {
      SocketIOClient receiver = server.getClient(UUID.fromString(data.getSessionId()));

      var sendSecretKey = SendSecretSessionKey.builder()
        .key(data.getKey())
        .sessionId(client.getSessionId().toString())
        .build();

      receiver.sendEvent("receive_secret_session_key", sendSecretKey);
    };
  }

  private DataListener<SendMessage> onSendMessage() {

    return (client, message, ackSender) -> {
      var sessionId = UUID.fromString(message.getReceiver());
      SocketIOClient receiver = server.getClient(sessionId);

      log.info("{}", message);

      receiver.sendEvent("receive_message", message);
    };
  }

  private DataListener<Void> onShowConnections() {
    return (client, data, ackSender) -> {

      var list = server.getAllClients()
          .stream()
          .filter(c -> {
            return !c.getSessionId().equals(client.getSessionId());
          })
          .map(c -> {
            var params = c.getHandshakeData().getUrlParams().get("username");
            String name = String.join("", params);
            String sessionId = c.getSessionId().toString();

            return ConnectedUser.builder()
                .username(name)
                .sessionId(sessionId)
                .build();
          })
          .collect(Collectors.toList());

      ackSender.sendAckData(list);
    };
  }

}
