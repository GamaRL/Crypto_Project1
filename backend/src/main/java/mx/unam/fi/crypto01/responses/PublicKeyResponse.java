package mx.unam.fi.crypto01.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PublicKeyResponse {
  private String sessionId;
  private String publicKey;
}
