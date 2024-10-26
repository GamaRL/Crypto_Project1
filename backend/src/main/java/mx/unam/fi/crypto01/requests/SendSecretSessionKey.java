package mx.unam.fi.crypto01.requests;//package, organización lógica de paquetes

/*Importación de la biblioteca lombok utilizada en Java, para eliminar código repetitivo */
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data /*Anotación que genera automáticamente métodos de clase necesarios */
@Builder /*Genera un patrón Builder, el cual crea instancias de PublicKeyMessage  */
@AllArgsConstructor /*Genera un constructor de clase, acepta un argumento por cada campo de la clase */
@NoArgsConstructor/*Genera un constructor sin argumentos */

/*Clase de tip pública, correspondiente, se encarga de manejar los datos de envío de la llave, según
 * el id de sesión
 * @key llave
 * @sessionID user
 */
public class SendSecretSessionKey {
  private String key;
  private String sessionId;
}