package mx.unam.fi.crypto01.responses;//package, organización lógica de paquetes

/*Importación de la biblioteca lombok utilizada en Java, para eliminar código repetitivo */
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data /*Anotación que genera automáticamente métodos de clase necesarios */
@Builder /*Genera un patrón Builder, el cual crea instancias de PublicKeyMessage  */
@AllArgsConstructor /*Genera un constructor de clase, acepta un argumento por cada campo de la clase */
@NoArgsConstructor/*Genera un constructor sin argumentos */

/*Clase correspondiente a la llave pública
 * @sessionID num. de sesión del user 
 * @publickey almacena la llave pública del user
 */
public class PublicKeyResponse {
  private String sessionId;
  private String publicKey;
}
