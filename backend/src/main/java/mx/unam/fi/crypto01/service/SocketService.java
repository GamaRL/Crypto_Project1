package mx.unam.fi.crypto01.service;

import org.springframework.stereotype.Service;

import com.corundumstudio.socketio.SocketIOClient;

import mx.unam.fi.crypto01.messages.Message;

@Service
public class SocketService {
  public void sendSocketmessage(SocketIOClient senderClient, Message message, String room) {
    for (SocketIOClient client : senderClient.getNamespace().getRoomOperations(room).getClients()) {
      if (!client.getSessionId().equals(senderClient.getSessionId())) {
        client.sendEvent("read_message", message);
      }
    }
  }
}
