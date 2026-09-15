Feature: Registro de salas
  Como administrador
  Quiero registrar nuevas salas
  Para ampliar la oferta del coworking

  Scenario: Registro exitoso de una nueva sala
    Given que no existe una sala llamada "Sala A"
    When el administrador registra la sala "Sala A" con capacidad 4
    Then la sala "Sala A" debe quedar registrada exitosamente

  Scenario: Intento de registro de una sala con nombre duplicado
    Given que existe una sala llamada "Sala A"
    When el administrador registra la sala "Sala A" con capacidad 4
    Then el sistema debe rechazar el registro de la sala
    And debe mostrar el mensaje de error "La sala \"Sala A\" ya existe"
