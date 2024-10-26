package mx.unam.fi.crypto01.requests;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendMessage {
  private String sender;
  private String receiver;
  private String date;
  private String content;
}
