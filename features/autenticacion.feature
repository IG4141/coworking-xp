Feature: Registro e inicio de sesion
  Como usuario nuevo
  Quiero registrarme e iniciar sesion
  Para acceder al sistema de forma segura

  Scenario: Registro exitoso de un nuevo usuario
    Given que no existe un usuario con nombre "juan"
    When "juan" se registra con la contrasena "clave1234"
    Then el usuario "juan" debe quedar registrado exitosamente
    And la contrasena almacenada de "juan" no debe ser texto plano

  Scenario: Intento de registro con un nombre de usuario ya existente
    Given que existe un usuario registrado con nombre "juan"
    When "juan" se registra con la contrasena "otraClave"
    Then el sistema debe rechazar el registro
    And debe mostrar el mensaje de error "El usuario \"juan\" ya existe"

  Scenario: Inicio de sesion exitoso
    Given que existe un usuario registrado con nombre "juan" y contrasena "clave1234"
    When "juan" inicia sesion con la contrasena "clave1234"
    Then el inicio de sesion debe ser exitoso

  Scenario: Inicio de sesion con contrasena incorrecta
    Given que existe un usuario registrado con nombre "juan" y contrasena "clave1234"
    When "juan" inicia sesion con la contrasena "incorrecta"
    Then el sistema debe rechazar el inicio de sesion
    And debe mostrar el mensaje de error "Usuario o contrasena invalidos"
