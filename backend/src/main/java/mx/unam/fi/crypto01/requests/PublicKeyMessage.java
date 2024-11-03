package mx.unam.fi.crypto01.requests;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data /*Anotación que genera automáticamente métodos de clase necesarios */
@Builder /*Genera un patrón Builder, el cual crea instancias de PublicKeyMessage  */
@AllArgsConstructor /*Genera un constructor de clase, acepta un argumento por cada campo de la clase */
@NoArgsConstructor/*Genera un constructor sin argumentos */
/**
 * Definición de la clase, contiene 2 atributos 
 * @sessionID identificador de sesión
 * @publicKey almacena la llave pública
 */
public class PublicKeyMessage {
  private String sessionId;
  private String publicKey;
}
