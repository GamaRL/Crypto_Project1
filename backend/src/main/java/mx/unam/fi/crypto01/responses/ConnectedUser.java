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

/*Clase correspondete a almacenar los datos de la conexión con el usuario activo 
 * @username nombre de usuario, activo
 * @sessionID número de sesión del usuario activo
*/
public class ConnectedUser {
  private String username;
  private String sessionId;
}
