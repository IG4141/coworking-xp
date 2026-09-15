Feature: Historial de reservas de una sala
  Como administrador
  Quiero ver el historial de reservas de una sala
  Para controlar el uso del espacio

  Scenario: Consultar el historial de una sala con reservas
    Given que la sala "Sala A" existe
    And "juan" tiene una reserva confirmada de la "Sala A" para el "2026-10-15"
    When el administrador consulta el historial de la "Sala A"
    Then el historial debe contener 1 reserva

  Scenario: Consultar el historial de una sala inexistente
    Given que no existe una sala llamada "Sala Fantasma"
    When el administrador consulta el historial de la "Sala Fantasma"
    Then el sistema debe rechazar la consulta de historial
    And debe mostrar el mensaje de error "La sala \"Sala Fantasma\" no existe"
