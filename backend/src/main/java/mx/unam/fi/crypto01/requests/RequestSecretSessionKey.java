package mx.unam.fi.crypto01.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RequestSecretSessionKey {
  private String key;
  private String sessionId;
}
